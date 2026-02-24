
import os
import sys
import logging
from app import app, initialize_services
from config import Config

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def create_directories():
    """Create necessary directories if they don't exist"""
    directories = ['logs', 'static/images', 'static/css', 'static/js']
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            logger.info(f"Created directory: {directory}")

def validate_configuration():
    """Validate configuration before starting"""
    try:
        Config.validate()
        logger.info("[OK] Configuration validated successfully")
        return True
    except ValueError as e:
        logger.error(f"Configuration validation failed:\n{e}")
        return False

def print_startup_info():
    """Print startup information"""
    logger.info("=" * 80)
    logger.info("RAG BASED SYSTEM - FLASK BACKEND")
    logger.info("=" * 80)
    logger.info("")
    logger.info("Configuration:")
    
    config_info = Config.get_config_info()
    for key, value in config_info.items():
        logger.info(f"  {key}: {value}")
    
    logger.info("")
    logger.info("=" * 80)

def print_server_info():
    """Print server information after successful start"""
    logger.info("=" * 80)
    logger.info("[OK] SERVER STARTED SUCCESSFULLY")
    logger.info("=" * 80)
    logger.info(f"")
    logger.info(f"  Server URL:        http://{Config.HOST}:{Config.PORT}")
    logger.info(f"  Health Check:      http://{Config.HOST}:{Config.PORT}/health")
    logger.info(f"  API Endpoints:     http://{Config.HOST}:{Config.PORT}/api/")
    logger.info(f"")
    logger.info(f"  Status:            Running")
    logger.info(f"  Debug Mode:        {Config.DEBUG}")
    logger.info(f"")
    logger.info("=" * 80)
    logger.info("")
    logger.info("Press CTRL+C to stop the server")
    logger.info("")

def main():
    """Main application entry point"""
    try:
        print_startup_info()
        
        create_directories()
        
        if not validate_configuration():
            logger.error("[ERROR] Cannot start server due to configuration errors")
            sys.exit(1)
        
        logger.info("Initializing services...")
        
        if not initialize_services():
            logger.error("[ERROR] Service initialization failed")
            logger.error("[ERROR] Cannot start server")
            sys.exit(1)
        
        print_server_info()
        
        app.run(
            host=Config.HOST,
            port=Config.PORT,
            debug=Config.DEBUG,
            threaded=True
        )
    
    except KeyboardInterrupt:
        logger.info("")
        logger.info("=" * 80)
        logger.info("Server shutdown requested")
        logger.info("=" * 80)
        sys.exit(0)
    
    except Exception as e:
        logger.error("=" * 80)
        logger.error("FATAL ERROR")
        logger.error("=" * 80)
        logger.error(f"Error: {str(e)}", exc_info=True)
        logger.error("=" * 80)
        sys.exit(1)

if __name__ == '__main__':
    main()
