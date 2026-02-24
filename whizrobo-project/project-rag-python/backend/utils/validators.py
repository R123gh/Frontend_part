import re
import os
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'}
MAX_FILE_SIZE_MB = 16
MAX_QUERY_LENGTH = 1000
MIN_QUERY_LENGTH = 1

def validate_text_input(text: str, min_length: int = MIN_QUERY_LENGTH, max_length: int = MAX_QUERY_LENGTH) -> Tuple[bool, Optional[str]]:
    """
    Validate text input.
    
    Args:
        text (str): Text to validate
        min_length (int): Minimum length
        max_length (int): Maximum length
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not text:
        return False, "Text cannot be empty"
    
    text = text.strip()
    
    if len(text) < min_length:
        return False, f"Text must be at least {min_length} characters"
    
    if len(text) > max_length:
        return False, f"Text must not exceed {max_length} characters"
    
    return True, None

def validate_file_upload(file) -> Tuple[bool, Optional[str]]:
    """
    Validate uploaded file.
    
    Args:
        file: Uploaded file object
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not file:
        return False, "No file provided"
    
    if not hasattr(file, 'filename') or not file.filename:
        return False, "Invalid file"
    
    if file.filename == '':
        return False, "No file selected"
    
    return True, None

def validate_image_file(file, max_size_mb: int = MAX_FILE_SIZE_MB) -> Tuple[bool, Optional[str]]:
    """
    Validate image file.
    
    Args:
        file: Uploaded file object
        max_size_mb (int): Maximum file size in MB
        
    Returns:
        tuple: (is_valid, error_message)
    """
    is_valid, error = validate_file_upload(file)
    if not is_valid:
        return False, error
    
    filename = file.filename.lower()
    extension = filename.rsplit('.', 1)[-1] if '.' in filename else ''
    
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        return False, f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
    
    if hasattr(file, 'content_length') and file.content_length:
        size_mb = file.content_length / (1024 * 1024)
        if size_mb > max_size_mb:
            return False, f"File size must not exceed {max_size_mb}MB"
    
    return True, None

def validate_api_key(api_key: str, key_name: str = "API key") -> Tuple[bool, Optional[str]]:
    """
    Validate API key format.
    
    Args:
        api_key (str): API key to validate
        key_name (str): Name of the API key
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not api_key:
        return False, f"{key_name} is required"
    
    api_key = api_key.strip()
    
    if len(api_key) < 10:
        return False, f"{key_name} is too short"
    
    if not re.match(r'^[A-Za-z0-9_\-\.]+$', api_key):
        return False, f"{key_name} contains invalid characters"
    
    return True, None

def validate_top_k(top_k: any, min_value: int = 1, max_value: int = 20) -> Tuple[bool, Optional[str], int]:
    """
    Validate top_k parameter.
    
    Args:
        top_k: Value to validate
        min_value (int): Minimum allowed value
        max_value (int): Maximum allowed value
        
    Returns:
        tuple: (is_valid, error_message, validated_value)
    """
    try:
        top_k_int = int(top_k)
    except (ValueError, TypeError):
        return False, "top_k must be an integer", 5
    
    if top_k_int < min_value:
        return False, f"top_k must be at least {min_value}", min_value
    
    if top_k_int > max_value:
        return False, f"top_k must not exceed {max_value}", max_value
    
    return True, None, top_k_int

def validate_query_length(query: str, max_length: int = MAX_QUERY_LENGTH) -> Tuple[bool, Optional[str]]:
    """
    Validate query length.
    
    Args:
        query (str): Query string
        max_length (int): Maximum allowed length
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not query:
        return False, "Query cannot be empty"
    
    query = query.strip()
    
    if not query:
        return False, "Query cannot be empty"
    
    if len(query) > max_length:
        return False, f"Query too long (max {max_length} characters)"
    
    return True, None

def is_valid_url(url: str) -> bool:
    """
    Check if string is a valid URL.
    
    Args:
        url (str): URL to validate
        
    Returns:
        bool: True if valid URL
    """
    if not url:
        return False
    
    url_pattern = re.compile(
        r'^https?://'
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'
        r'localhost|'
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
        r'(?::\d+)?'
        r'(?:/?|[/?]\S+)$', re.IGNORECASE
    )
    
    return bool(url_pattern.match(url))

def is_safe_filename(filename: str) -> bool:
    """
    Check if filename is safe (no path traversal).
    
    Args:
        filename (str): Filename to check
        
    Returns:
        bool: True if safe
    """
    if not filename:
        return False
    
    if '..' in filename or '/' in filename or '\\' in filename:
        return False
    
    if filename.startswith('.'):
        return False
    
    dangerous_chars = ['<', '>', ':', '"', '|', '?', '*']
    if any(char in filename for char in dangerous_chars):
        return False
    
    return True

def validate_language_code(lang_code: str) -> Tuple[bool, Optional[str]]:
    """
    Validate language code.
    
    Args:
        lang_code (str): Language code (e.g., 'en', 'es')
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not lang_code:
        return False, "Language code is required"
    
    lang_code = lang_code.strip().lower()
    
    if not re.match(r'^[a-z]{2}(-[A-Z]{2})?$', lang_code):
        return False, "Invalid language code format"
    
    supported_languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko']
    base_lang = lang_code.split('-')[0]
    
    if base_lang not in supported_languages:
        return False, f"Unsupported language. Supported: {', '.join(supported_languages)}"
    
    return True, None

def validate_temperature(temperature: any) -> Tuple[bool, Optional[str], float]:
    """
    Validate temperature parameter for LLM.
    
    Args:
        temperature: Value to validate
        
    Returns:
        tuple: (is_valid, error_message, validated_value)
    """
    try:
        temp_float = float(temperature)
    except (ValueError, TypeError):
        return False, "Temperature must be a number", 0.7
    
    if temp_float < 0.0 or temp_float > 2.0:
        return False, "Temperature must be between 0.0 and 2.0", 0.7
    
    return True, None, temp_float

def validate_max_tokens(max_tokens: any) -> Tuple[bool, Optional[str], int]:
    """
    Validate max_tokens parameter.
    
    Args:
        max_tokens: Value to validate
        
    Returns:
        tuple: (is_valid, error_message, validated_value)
    """
    try:
        tokens_int = int(max_tokens)
    except (ValueError, TypeError):
        return False, "max_tokens must be an integer", 1000
    
    if tokens_int < 1:
        return False, "max_tokens must be at least 1", 1
    
    if tokens_int > 4000:
        return False, "max_tokens must not exceed 4000", 4000
    
    return True, None, tokens_int