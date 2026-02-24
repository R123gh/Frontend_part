import hashlib
import logging
import math
import re

try:
    from sentence_transformers import SentenceTransformer
    import torch
    ST_IMPORT_ERROR = None
except Exception as exc:
    SentenceTransformer = None
    torch = None
    ST_IMPORT_ERROR = exc

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self, model_name='all-MiniLM-L6-v2', fallback_dim=384):
        self.mode = 'sentence_transformers'
        self.model_name = model_name
        self.fallback_dim = int(fallback_dim)
        self.model = None

        if SentenceTransformer is None:
            self.mode = 'fallback_hash'
            logger.warning(
                "SentenceTransformer unavailable (%s). Using fallback hash embeddings.",
                ST_IMPORT_ERROR,
            )
            return

        try:
            device = 'cuda' if torch and torch.cuda.is_available() else 'cpu'
            self.model = SentenceTransformer(model_name, device=device)
            logger.info("Embedding model loaded: %s on %s", model_name, device)
        except Exception as exc:
            self.mode = 'fallback_hash'
            logger.warning(
                "Failed to load embedding model (%s). Using fallback hash embeddings.",
                str(exc),
            )

    def _encode_fallback_single(self, text):
        vector = [0.0] * self.fallback_dim
        tokens = re.findall(r"[a-zA-Z0-9_]+", text.lower())

        if not tokens:
            return vector

        for token in tokens:
            digest = hashlib.sha256(token.encode('utf-8')).digest()
            idx = int.from_bytes(digest[:4], 'little') % self.fallback_dim
            sign = 1.0 if (digest[4] % 2 == 0) else -1.0
            vector[idx] += sign

        norm = math.sqrt(sum(v * v for v in vector))
        if norm > 0:
            vector = [v / norm for v in vector]

        return vector

    def encode(self, text):
        try:
            if isinstance(text, str):
                text = [text]
            elif not isinstance(text, list):
                raise ValueError("Input must be string or list of strings")

            if not text or all((t or '').strip() == '' for t in text):
                raise ValueError("Input text cannot be empty")

            if self.mode == 'sentence_transformers' and self.model is not None:
                embedding = self.model.encode(
                    text,
                    convert_to_tensor=False,
                    show_progress_bar=False,
                )
                if len(text) == 1:
                    return embedding[0].tolist()
                return [emb.tolist() for emb in embedding]

            embeddings = [self._encode_fallback_single(t) for t in text]
            if len(text) == 1:
                return embeddings[0]
            return embeddings

        except Exception as exc:
            logger.error("Encoding error: %s", str(exc))
            raise

    def encode_batch(self, texts, batch_size=32):
        try:
            if not isinstance(texts, list):
                raise ValueError("Input must be a list of strings")

            if self.mode == 'sentence_transformers' and self.model is not None:
                embeddings = self.model.encode(
                    texts,
                    batch_size=batch_size,
                    show_progress_bar=False,
                    convert_to_tensor=False
                )
                return [emb.tolist() for emb in embeddings]

            return [self._encode_fallback_single(text or '') for text in texts]

        except Exception as exc:
            logger.error("Batch encoding error: %s", str(exc))
            raise

    def get_model_info(self):
        if self.mode == 'sentence_transformers' and self.model is not None:
            return {
                'mode': self.mode,
                'model_name': self.model._model_card_vars.get('model_name', self.model_name),
                'max_seq_length': self.model.max_seq_length,
                'embedding_dimension': self.model.get_sentence_embedding_dimension(),
                'device': str(self.model.device)
            }

        return {
            'mode': self.mode,
            'model_name': 'fallback-hash-embedding',
            'max_seq_length': None,
            'embedding_dimension': self.fallback_dim,
            'device': 'cpu'
        }
