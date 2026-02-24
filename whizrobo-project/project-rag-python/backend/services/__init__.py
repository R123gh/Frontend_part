from .embeddings import EmbeddingService
from .vector_db import VectorDBService
from .tts import TTSService


def _unavailable_service_class(name, import_error):
    class _UnavailableService:
        def __init__(self, *args, **kwargs):
            raise RuntimeError(
                f"{name} is unavailable in this environment: {import_error}. "
                "Use a compatible Python runtime and reinstall dependencies."
            )

    _UnavailableService.__name__ = name
    return _UnavailableService


try:
    from .llm import LLMService
except Exception as exc:  
    LLMService = _unavailable_service_class('LLMService', exc)

try:
    from .ocr import OCRService
except Exception as exc:  
    OCRService = _unavailable_service_class('OCRService', exc)


__all__ = [
    'EmbeddingService',
    'VectorDBService',
    'LLMService',
    'OCRService',
    'TTSService'
]
