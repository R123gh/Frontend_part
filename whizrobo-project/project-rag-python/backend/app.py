from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
import logging
from io import BytesIO
from PIL import Image, UnidentifiedImageError
import io
import os
from werkzeug.utils import secure_filename

from config import Config
from services import EmbeddingService, VectorDBService, LLMService, OCRService, TTSService
from utils import (
    validate_text_input,
    validate_image_file,
    validate_top_k,
    clean_text,
    format_response,
    handle_error,
    get_file_size_mb
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH
app.config['SECRET_KEY'] = os.urandom(24)

embedding_service = None
vector_db_service = None
llm_service = None
ocr_service = None
tts_service = None


def preprocess_image_for_ocr(image_bytes):
    """Convert image to RGB, resize, and compress before OCR to reduce failures/timeouts."""
    try:
        image = Image.open(io.BytesIO(image_bytes))

        if image.mode == 'RGBA':
            image = image.convert('RGB')
        elif image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')

        image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

        output_buffer = io.BytesIO()
        image.save(output_buffer, format='JPEG', quality=85)
        return output_buffer.getvalue()

    except UnidentifiedImageError:
        raise ValueError("Invalid or unsupported image format")
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")

def initialize_services():
    """Initialize all services"""
    global embedding_service, vector_db_service, llm_service, ocr_service, tts_service
    
    try:
        logger.info("=" * 60)
        logger.info("Initializing RAG System Services...")
        logger.info("=" * 60)
        
        embedding_service = EmbeddingService(Config.MODEL_NAME)
        
        vector_db_service = VectorDBService(
            db_path=Config.CHROMA_DB_PATH,
            collection_name='video_chunks'
        )
        
        try:
            llm_service = LLMService(
                api_key=Config.GROQ_API_KEY,
                model_name=Config.LLM_MODEL,
                temperature=Config.LLM_TEMPERATURE,
                max_tokens=Config.LLM_MAX_TOKENS
            )
        except Exception as e:
            llm_service = None
            logger.warning(f"LLM service unavailable: {str(e)}")
        
        try:
            ocr_service = OCRService(
                api_key=Config.OCR_SPACE_API_KEY,
                ocr_engine=Config.OCR_ENGINE,
                timeout=Config.OCR_TIMEOUT,
                retries=Config.OCR_RETRIES,
                retry_delay=Config.OCR_RETRY_DELAY
            )
        except Exception as e:
            ocr_service = None
            logger.warning(f"OCR service unavailable: {str(e)}")
        
        try:
            tts_service = TTSService(language='en', slow=False)
        except Exception as e:
            tts_service = None
            logger.warning(f"TTS service unavailable: {str(e)}")
        
        logger.info("=" * 60)
        logger.info("✓ All services initialized successfully")
        logger.info("=" * 60)
        
        return True
    
    except Exception as e:
        logger.error(f"Service initialization failed: {str(e)}", exc_info=True)
        return False

@app.before_request
def check_services():
    """Check if services are initialized before processing requests"""
    if request.endpoint and request.endpoint.startswith('api_'):
        if not embedding_service:
            logger.warning("Services not initialized, attempting initialization...")
            if not initialize_services():
                return jsonify(format_response(
                    success=False,
                    error="Service initialization failed"
                )), 500

@app.route('/')
def index():
    """Render main page"""
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Error rendering index: {str(e)}")
        return "Error loading application", 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        if not vector_db_service:
            return jsonify({
                'status': 'unhealthy',
                'error': 'Services not initialized'
            }), 500
        
        health_info = vector_db_service.health_check()
        
        return jsonify({
            'status': health_info['status'],
            'collection_count': health_info['count'],
            'services': {
                'embeddings': embedding_service is not None,
                'vector_db': vector_db_service is not None,
                'llm': llm_service is not None,
                'ocr': ocr_service is not None,
                'tts': tts_service is not None
            },
            'collection': health_info.get('collection', 'unknown')
        })
    
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

@app.route('/api/query', methods=['POST'])
def api_query_text():
    """Text query endpoint"""
    try:
        if llm_service is None:
            return jsonify(format_response(
                success=False,
                error="LLM service is unavailable. Check dependencies and GROQ configuration."
            )), 503

        data = request.get_json()
        
        if not data:
            return jsonify(format_response(
                success=False,
                error="No JSON data provided"
            )), 400
        
        query = data.get('query', '').strip()
        top_k = data.get('top_k', Config.TOP_K)
        
        is_valid, error = validate_text_input(query)
        if not is_valid:
            return jsonify(format_response(success=False, error=error)), 400
        
        is_valid_k, error_k, top_k = validate_top_k(top_k)
        if not is_valid_k:
            logger.warning(f"Invalid top_k: {error_k}, using default: {top_k}")
        
        logger.info(f"Processing text query: {query[:50]}... (top_k={top_k})")
        
        query_embedding = embedding_service.encode(query)
        results = vector_db_service.search(query_embedding, top_k)
        
        if not results['documents'][0]:
            return jsonify(format_response(
                success=True,
                data={'answer': 'No relevant information found in the knowledge base.'},
                message="No results found"
            ))
        
        context = "\n\n".join(results['documents'][0])
        
        prompt = llm_service.build_text_query_prompt(
            context=context,
            query=query
        )
        
        answer = llm_service.generate_answer(prompt)
        
        logger.info(f"Query successful: {len(answer)} characters generated")
        
        return jsonify(format_response(
            success=True,
            data={
                'answer': answer,
                'chunks_used': len(results['documents'][0])
            },
            message="Query processed successfully"
        ))
    
    except Exception as e:
        logger.error(f"Query error: {str(e)}", exc_info=True)
        return jsonify(handle_error(e, "Query processing")), 500

@app.route('/api/ocr', methods=['POST'])
def api_ocr_extract():
    """OCR extraction endpoint"""
    try:
        if ocr_service is None:
            return jsonify(format_response(
                success=False,
                error="OCR service is unavailable. Check dependencies and OCR configuration."
            )), 503

        if 'image' not in request.files:
            return jsonify(format_response(
                success=False,
                error="No image file provided"
            )), 400
        
        image_file = request.files['image']
        
        is_valid, error = validate_image_file(image_file)
        if not is_valid:
            return jsonify(format_response(success=False, error=error)), 400
        
        filename = secure_filename(image_file.filename)
        logger.info(f"Processing OCR for image: {filename}")
        
        original_bytes = image_file.read()
        image_bytes = preprocess_image_for_ocr(original_bytes)
        original_size = get_file_size_mb(len(original_bytes))
        processed_size = get_file_size_mb(len(image_bytes))
        
        logger.info(f"Image size (original/processed): {original_size} MB / {processed_size} MB")
        
        extracted_text = ocr_service.extract_text(image_bytes)

        if extracted_text.startswith("Error:"):
            return jsonify(format_response(
                success=False,
                error=extracted_text
            )), 503
        
        logger.info(f"OCR successful: {len(extracted_text)} characters extracted")
        
        return jsonify(format_response(
            success=True,
            data={'extracted_text': extracted_text},
            message="OCR completed successfully"
        ))
    
    except Exception as e:
        logger.error(f"OCR error: {str(e)}", exc_info=True)
        return jsonify(handle_error(e, "OCR processing")), 500

@app.route('/api/image-query', methods=['POST'])
def api_image_query():
    """Image query with OCR and RAG endpoint"""
    try:
        if ocr_service is None:
            return jsonify(format_response(
                success=False,
                error="OCR service is unavailable. Check dependencies and OCR configuration."
            )), 503

        if llm_service is None:
            return jsonify(format_response(
                success=False,
                error="LLM service is unavailable. Check dependencies and GROQ configuration."
            )), 503

        if 'image' not in request.files:
            return jsonify(format_response(
                success=False,
                error="No image file provided"
            )), 400
        
        image_file = request.files['image']
        
        is_valid, error = validate_image_file(image_file)
        if not is_valid:
            return jsonify(format_response(success=False, error=error)), 400
        
        query = request.form.get('query', '').strip()
        top_k = int(request.form.get('top_k', Config.TOP_K))
        
        is_valid_k, error_k, top_k = validate_top_k(top_k)
        if not is_valid_k:
            logger.warning(f"Invalid top_k: {error_k}, using: {top_k}")
        
        filename = secure_filename(image_file.filename)
        logger.info(f"Processing image query: {filename}, query: '{query}'")
        
        original_bytes = image_file.read()
        image_bytes = preprocess_image_for_ocr(original_bytes)
        
        extracted_text = ocr_service.extract_text(image_bytes)

        if extracted_text.startswith("Error:"):
            return jsonify(format_response(
                success=False,
                error=extracted_text
            )), 503
        
        if extracted_text == "No text found in image":
            return jsonify(format_response(
                success=True,
                data={
                    'extracted_text': extracted_text,
                    'answer': extracted_text,
                    'video_context': '',
                    'chunks_used': 0
                },
                message="OCR completed but no text found"
            ))
        
        search_query = f"{extracted_text} {query}" if query else extracted_text
        query_embedding = embedding_service.encode(search_query)
        results = vector_db_service.search(query_embedding, top_k)
        
        video_context = "\n\n".join(results['documents'][0]) if results['documents'][0] else ""
        
        prompt = llm_service.build_image_query_prompt(
            extracted_text=extracted_text,
            video_context=video_context,
            user_query=query,
            instructions=ocr_service.get_query_instructions()
        )
        
        answer = llm_service.generate_answer(prompt)
        
        logger.info(f"Image query successful: {len(answer)} characters generated")
        
        return jsonify(format_response(
            success=True,
            data={
                'extracted_text': extracted_text,
                'answer': answer,
                'video_context': video_context,
                'chunks_used': len(results['documents'][0]) if results['documents'][0] else 0
            },
            message="Image query processed successfully"
        ))
    
    except Exception as e:
        logger.error(f"Image query error: {str(e)}", exc_info=True)
        return jsonify(handle_error(e, "Image query processing")), 500

@app.route('/api/tts', methods=['POST'])
def api_text_to_speech():
    """Text-to-speech endpoint"""
    try:
        if tts_service is None:
            return jsonify(format_response(
                success=False,
                error="TTS service is unavailable. Check dependencies and configuration."
            )), 503

        data = request.get_json()
        
        if not data:
            return jsonify(format_response(
                success=False,
                error="No JSON data provided"
            )), 400
        
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify(format_response(
                success=False,
                error="Text is required"
            )), 400
        
        logger.info(f"Generating TTS for text: {text[:50]}...")
        
        audio_bytes = tts_service.generate_audio(text)
        
        logger.info(f"TTS successful: {len(audio_bytes)} bytes generated")
        
        return send_file(
            BytesIO(audio_bytes),
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='audio.mp3'
        )
    
    except Exception as e:
        logger.error(f"TTS error: {str(e)}", exc_info=True)
        return jsonify(handle_error(e, "Text-to-speech")), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    logger.warning(f"404 error: {request.url}")
    return jsonify(format_response(
        success=False,
        error="Endpoint not found"
    )), 404

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large errors"""
    logger.warning(f"413 error: File too large")
    return jsonify(format_response(
        success=False,
        error=f"File too large. Maximum size: {Config.MAX_CONTENT_LENGTH / (1024*1024)} MB"
    )), 413

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"500 error: {str(error)}", exc_info=True)
    return jsonify(format_response(
        success=False,
        error="Internal server error"
    )), 500

@app.errorhandler(Exception)
def handle_exception(error):
    """Handle uncaught exceptions"""
    logger.error(f"Uncaught exception: {str(error)}", exc_info=True)
    return jsonify(format_response(
        success=False,
        error="An unexpected error occurred"
    )), 500

@app.after_request
def after_request(response):
    """Add headers to response"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    if initialize_services():
        logger.info("=" * 60)
        logger.info(f"Starting Flask server on {Config.HOST}:{Config.PORT}")
        logger.info(f"Debug mode: {Config.DEBUG}")
        logger.info("=" * 60)
        
        app.run(
            host=Config.HOST,
            port=Config.PORT,
            debug=Config.DEBUG
        )
    else:
        logger.error("Failed to start server - service initialization failed")
        exit(1)
