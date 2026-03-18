import ast
import csv
import logging
import math
import os
import re
import sqlite3

try:
    import chromadb  # type: ignore
    CHROMADB_IMPORT_ERROR = None
except Exception as exc:  # pragma: no cover - environment-dependent import
    chromadb = None
    CHROMADB_IMPORT_ERROR = exc

logger = logging.getLogger(__name__)


class VectorDBService:
    def __init__(self, db_path='./chroma_db', collection_name='video_chunks'):
        self.mode = "chroma"
        self.collection_name = collection_name
        self._fallback_records = []
        self._fallback_docs = []
        self.db_path = db_path

        fallback_csv_path = os.getenv(
            "EMBEDDINGS_CSV_PATH",
            os.path.normpath(
                os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "..",
                    "Data",
                    "processed",
                    "chunks_with_embeddings.csv",
                )
            ),
        )

        if chromadb is None:
            logger.warning(
                "ChromaDB unavailable (%s). Falling back to CSV vector search: %s",
                CHROMADB_IMPORT_ERROR,
                fallback_csv_path,
            )
            self._initialize_fallback(fallback_csv_path, sqlite_path=db_path)
            return

        try:
            if not db_path:
                raise ValueError("Database path is required")

            self.client = chromadb.PersistentClient(path=db_path)

            try:
                self.collection = self.client.get_collection(name=collection_name)
                count = self.collection.count()
                logger.info("ChromaDB connected: %s chunks available in '%s'", count, collection_name)
            except Exception as exc:
                logger.warning(
                    "Chroma collection '%s' unavailable (%s). Falling back to CSV vector search: %s",
                    collection_name,
                    str(exc),
                    fallback_csv_path,
                )
                self._initialize_fallback(fallback_csv_path, sqlite_path=db_path)

        except Exception as exc:
            logger.warning(
                "ChromaDB initialization failed (%s). Falling back to CSV vector search: %s",
                str(exc),
                fallback_csv_path,
            )
            self._initialize_fallback(fallback_csv_path, sqlite_path=db_path)

    def _resolve_sqlite_file(self, db_path):
        if not db_path:
            return None
        if os.path.isdir(db_path):
            candidate = os.path.join(db_path, "chroma.sqlite3")
            return candidate if os.path.exists(candidate) else None
        return db_path if os.path.exists(db_path) else None

    def _load_docs_from_sqlite(self, sqlite_file):
        try:
            conn = sqlite3.connect(sqlite_file)
            cur = conn.cursor()
            cur.execute(
                "SELECT string_value FROM embedding_metadata WHERE key='chroma:document'"
            )
            rows = [r[0] for r in cur.fetchall() if r and r[0]]
            conn.close()
            return rows
        except Exception as exc:
            logger.warning("SQLite fallback load failed: %s", str(exc))
            return []

    def _initialize_fallback(self, csv_path, sqlite_path=None):
        if os.path.exists(csv_path):
            records = []
            with open(csv_path, "r", encoding="utf-8", newline="") as handle:
                reader = csv.DictReader(handle)
                for row in reader:
                    text = (row.get("text") or "").strip()
                    emb_raw = row.get("embeddings")
                    if not text or not emb_raw:
                        continue

                    try:
                        embedding = ast.literal_eval(emb_raw)
                    except Exception:
                        continue

                    if not isinstance(embedding, list) or not embedding:
                        continue

                    try:
                        embedding = [float(value) for value in embedding]
                    except Exception:
                        continue

                    records.append(
                        {
                            "id": str(len(records)),
                            "text": text,
                            "embedding": embedding,
                            "metadata": {
                                "index": row.get("index"),
                                "chunk_num": row.get("chunk_num"),
                            },
                        }
                    )

            if records:
                self.mode = "fallback_csv"
                self._fallback_records = records
                logger.info("Fallback vector DB initialized from CSV with %s records", len(self._fallback_records))
                return

        sqlite_file = self._resolve_sqlite_file(
            sqlite_path or os.getenv("CHROMA_SQLITE_PATH") or self.db_path
        )
        if sqlite_file:
            docs = self._load_docs_from_sqlite(sqlite_file)
            if docs:
                self.mode = "fallback_sqlite"
                self._fallback_docs = docs
                logger.info("Fallback vector DB initialized from SQLite with %s docs", len(self._fallback_docs))
                return

        raise ValueError(
            f"No fallback data available. Checked CSV: {csv_path} and SQLite: {sqlite_file}"
        )

    @staticmethod
    def _cosine_similarity(vec_a, vec_b):
        if len(vec_a) != len(vec_b):
            return -1.0

        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))

        if norm_a == 0.0 or norm_b == 0.0:
            return -1.0

        return dot / (norm_a * norm_b)

    def search(self, query_embedding, top_k=5, query_text=None):
        try:
            if not query_embedding:
                raise ValueError("Query embedding cannot be empty")

            if not isinstance(query_embedding, list):
                raise ValueError("Query embedding must be a list")

            if top_k < 1:
                raise ValueError("top_k must be at least 1")

            if self.mode == "chroma":
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k
                )
                logger.info("Search returned %s results", len(results['documents'][0]))
                return results

            if self.mode == "fallback_sqlite":
                text = (query_text or "").strip()
                if not text:
                    docs = self._fallback_docs[:top_k]
                else:
                    tokens = re.findall(r"[a-zA-Z0-9_]+", text.lower())
                    scored = []
                    for doc in self._fallback_docs:
                        lower_doc = doc.lower()
                        score = sum(lower_doc.count(token) for token in tokens)
                        if score > 0:
                            scored.append((score, doc))
                    scored.sort(key=lambda item: item[0], reverse=True)
                    docs = [item[1] for item in scored[:top_k]] or self._fallback_docs[:top_k]

                return {
                    "ids": [[str(idx) for idx, _ in enumerate(docs)]],
                    "documents": [docs],
                    "metadatas": [[{"source": "sqlite"} for _ in docs]],
                    "distances": [[0.0 for _ in docs]],
                }

            scored = []
            for record in self._fallback_records:
                similarity = self._cosine_similarity(query_embedding, record["embedding"])
                scored.append((similarity, record))

            scored.sort(key=lambda item: item[0], reverse=True)
            top = scored[:top_k]

            results = {
                "ids": [[item[1]["id"] for item in top]],
                "documents": [[item[1]["text"] for item in top]],
                "metadatas": [[item[1]["metadata"] for item in top]],
                "distances": [[1.0 - item[0] for item in top]],
            }
            logger.info("Fallback search returned %s results", len(results['documents'][0]))
            return results

        except Exception as exc:
            logger.error("Vector search error: %s", str(exc))
            raise

    def search_with_filter(self, query_embedding, top_k=5, where=None, query_text=None):
        try:
            if not query_embedding:
                raise ValueError("Query embedding cannot be empty")

            if self.mode == "chroma":
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k,
                    where=where
                )
                logger.info("Filtered search returned %s results", len(results['documents'][0]))
                return results

            return self.search(query_embedding=query_embedding, top_k=top_k, query_text=query_text)

        except Exception as exc:
            logger.error("Filtered search error: %s", str(exc))
            raise

    def get_count(self):
        try:
            if self.mode == "chroma":
                return self.collection.count()
            if self.mode == "fallback_sqlite":
                return len(self._fallback_docs)
            return len(self._fallback_records)
        except Exception as exc:
            logger.error("Count error: %s", str(exc))
            return 0

    def get_by_id(self, ids):
        try:
            if not ids:
                raise ValueError("IDs cannot be empty")

            if isinstance(ids, str):
                ids = [ids]

            if self.mode == "chroma":
                return self.collection.get(ids=ids)

            if self.mode == "fallback_sqlite":
                matched = []
                for raw_id in ids:
                    try:
                        idx = int(raw_id)
                        if 0 <= idx < len(self._fallback_docs):
                            matched.append(self._fallback_docs[idx])
                    except Exception:
                        continue
                return {
                    "ids": [str(i) for i in range(len(matched))],
                    "documents": matched,
                    "metadatas": [{"source": "sqlite"} for _ in matched],
                }

            id_set = set(ids)
            matched = [record for record in self._fallback_records if record["id"] in id_set]
            return {
                "ids": [record["id"] for record in matched],
                "documents": [record["text"] for record in matched],
                "metadatas": [record["metadata"] for record in matched],
            }

        except Exception as exc:
            logger.error("Get by ID error: %s", str(exc))
            raise

    def peek(self, limit=10):
        try:
            if self.mode == "chroma":
                return self.collection.peek(limit=limit)

            if self.mode == "fallback_sqlite":
                sample = self._fallback_docs[:limit]
                return {
                    "ids": [str(idx) for idx, _ in enumerate(sample)],
                    "documents": sample,
                    "metadatas": [{"source": "sqlite"} for _ in sample],
                }

            sample = self._fallback_records[:limit]
            return {
                "ids": [record["id"] for record in sample],
                "documents": [record["text"] for record in sample],
                "metadatas": [record["metadata"] for record in sample],
            }
        except Exception as exc:
            logger.error("Peek error: %s", str(exc))
            raise

    def get_collection_info(self):
        try:
            if self.mode == "fallback_csv":
                return {
                    'name': self.collection_name,
                    'count': len(self._fallback_records),
                    'metadata': {'mode': 'fallback_csv'}
                }

            return {
                'name': self.collection_name,
                'count': self.collection.count(),
                'metadata': self.collection.metadata
            }
        except Exception as exc:
            logger.error("Get info error: %s", str(exc))
            return {}

    def health_check(self):
        try:
            count = self.get_count()
            return {
                'status': 'healthy',
                'collection': self.collection_name,
                'count': count,
                'connected': True,
                'mode': self.mode
            }
        except Exception as exc:
            logger.error("Health check failed: %s", str(exc))
            return {
                'status': 'unhealthy',
                'collection': self.collection_name,
                'count': 0,
                'connected': False,
                'mode': self.mode,
                'error': str(exc)
            }
