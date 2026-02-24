import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # API Keys
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")
    
    # Database
    CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "../chroma_db")
    
    # Model Configuration
    MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
    LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
    LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.7"))
    LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "1000"))
    
    # Search Configuration
    TOP_K = int(os.getenv("TOP_K", "5"))
    
    # Server Configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "5000"))
    DEBUG = os.getenv("DEBUG", "False").lower() in ('true', '1', 'yes')
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(16 * 1024 * 1024)))  # 16MB default
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'}
    
    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE = os.getenv("LOG_FILE", "logs/app.log")
    ERROR_LOG_FILE = os.getenv("ERROR_LOG_FILE", "logs/error.log")
    
    # TTS Configuration
    TTS_LANGUAGE = os.getenv("TTS_LANGUAGE", "en")
    TTS_SLOW = os.getenv("TTS_SLOW", "False").lower() in ('true', '1', 'yes')
    
    # OCR Configuration
    OCR_ENGINE = int(os.getenv("OCR_ENGINE", "2"))  # 1=fast, 2=accurate
    OCR_LANGUAGE = os.getenv("OCR_LANGUAGE", "eng")
    OCR_TIMEOUT = float(os.getenv("OCR_TIMEOUT", "20"))
    OCR_RETRIES = int(os.getenv("OCR_RETRIES", "2"))
    OCR_RETRY_DELAY = float(os.getenv("OCR_RETRY_DELAY", "1.5"))
    
    # Query Limits
    MAX_QUERY_LENGTH = int(os.getenv("MAX_QUERY_LENGTH", "1000"))
    MIN_QUERY_LENGTH = int(os.getenv("MIN_QUERY_LENGTH", "1"))
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
    
    @staticmethod
    def validate():
        """Validate required configuration"""
        errors = []
        
        if not Config.GROQ_API_KEY:
            errors.append("GROQ_API_KEY is not set")
        
        if not Config.OCR_SPACE_API_KEY:
            errors.append("OCR_SPACE_API_KEY is not set")
        
        if not os.path.exists(Config.CHROMA_DB_PATH):
            errors.append(f"CHROMA_DB_PATH does not exist: {Config.CHROMA_DB_PATH}")
        
        if errors:
            raise ValueError(f"Configuration errors:\n" + "\n".join(f"  - {e}" for e in errors))
        
        return True
    
    @classmethod
    def get_config_info(cls):
        """Get configuration information (safe for logging)"""
        return {
            "model_name": cls.MODEL_NAME,
            "llm_model": cls.LLM_MODEL,
            "llm_temperature": cls.LLM_TEMPERATURE,
            "llm_max_tokens": cls.LLM_MAX_TOKENS,
            "top_k": cls.TOP_K,
            "host": cls.HOST,
            "port": cls.PORT,
            "debug": cls.DEBUG,
            "max_content_length_mb": cls.MAX_CONTENT_LENGTH / (1024 * 1024),
            "chroma_db_path": cls.CHROMA_DB_PATH,
            "log_level": cls.LOG_LEVEL
        }


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = "DEBUG"


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = "INFO"


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    LOG_LEVEL = "DEBUG"


def get_config(env=None):
    """Get configuration based on environment"""
    if env is None:
        env = os.getenv('FLASK_ENV', 'development')
    
    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    
    return config_map.get(env, DevelopmentConfig)
