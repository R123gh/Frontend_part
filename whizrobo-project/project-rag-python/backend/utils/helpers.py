import re
import os
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any, Union

logger = logging.getLogger(__name__)

def clean_text(text: str) -> str:
    """
    Clean and normalize text by removing extra whitespace and special characters.
    
    Args:
        text (str): Input text to clean
        
    Returns:
        str: Cleaned text
    """
    if not text:
        return ""
    
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    text = re.sub(r'[^\w\s\.,!?\'\"-]', '', text)
    
    return text

def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate text to specified length.
    
    Args:
        text (str): Text to truncate
        max_length (int): Maximum length
        suffix (str): Suffix to add if truncated
        
    Returns:
        str: Truncated text
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length].rsplit(' ', 1)[0] + suffix

def format_timestamp(dt: Optional[datetime] = None, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format datetime object to string.
    
    Args:
        dt (datetime): Datetime object (default: now)
        format_str (str): Format string
        
    Returns:
        str: Formatted timestamp
    """
    if dt is None:
        dt = datetime.now()
    
    return dt.strftime(format_str)

def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename.
    
    Args:
        filename (str): File name
        
    Returns:
        str: File extension (lowercase, without dot)
    """
    if not filename:
        return ""
    
    _, ext = os.path.splitext(filename)
    return ext.lower().lstrip('.')

def get_file_size_mb(file_size_bytes: int) -> float:
    """
    Convert file size from bytes to megabytes.
    
    Args:
        file_size_bytes (int): File size in bytes
        
    Returns:
        float: File size in MB
    """
    return round(file_size_bytes / (1024 * 1024), 2)

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename by removing unsafe characters.
    
    Args:
        filename (str): Original filename
        
    Returns:
        str: Sanitized filename
    """
    if not filename:
        return "unnamed_file"
    
    filename = re.sub(r'[^\w\s\.-]', '', filename)
    filename = re.sub(r'\s+', '_', filename)
    filename = filename.strip('._')
    
    if not filename:
        return "unnamed_file"
    
    return filename

def generate_unique_id(prefix: str = "") -> str:
    """
    Generate a unique identifier.
    
    Args:
        prefix (str): Optional prefix for the ID
        
    Returns:
        str: Unique identifier
    """
    unique_id = str(uuid.uuid4())
    
    if prefix:
        return f"{prefix}_{unique_id}"
    
    return unique_id

def format_response(success: bool, data: Any = None, message: str = "", error: str = "") -> Dict[str, Any]:
    """
    Format API response in a consistent structure.
    
    Args:
        success (bool): Whether the operation was successful
        data (Any): Response data
        message (str): Success message
        error (str): Error message
        
    Returns:
        dict: Formatted response
    """
    response = {
        "success": success,
        "timestamp": format_timestamp()
    }
    
    if success:
        response["data"] = data
        if message:
            response["message"] = message
    else:
        response["error"] = error or "An error occurred"
    
    return response

def handle_error(error: Exception, context: str = "") -> Dict[str, Any]:
    """
    Handle and format error for API response.
    
    Args:
        error (Exception): The exception that occurred
        context (str): Context where error occurred
        
    Returns:
        dict: Formatted error response
    """
    error_message = str(error)
    
    if context:
        error_message = f"{context}: {error_message}"
    
    logger.error(f"Error occurred: {error_message}", exc_info=True)
    
    return format_response(
        success=False,
        error=error_message
    )

def parse_boolean(value: Union[str, bool, int, None]) -> bool:
    """
    Parse various types to boolean.
    
    Args:
        value: Value to parse
        
    Returns:
        bool: Parsed boolean value
    """
    if isinstance(value, bool):
        return value
    
    if isinstance(value, int):
        return value != 0
    
    if isinstance(value, str):
        return value.lower() in ('true', '1', 'yes', 'y', 'on')
    
    return False

def extract_keywords(text: str, max_keywords: int = 10) -> list:
    """
    Extract keywords from text (simple implementation).
    
    Args:
        text (str): Input text
        max_keywords (int): Maximum number of keywords
        
    Returns:
        list: List of keywords
    """
    if not text:
        return []
    
    words = re.findall(r'\b\w+\b', text.lower())
    
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being'}
    
    keywords = [word for word in words if word not in stop_words and len(word) > 2]
    
    from collections import Counter
    word_freq = Counter(keywords)
    
    return [word for word, _ in word_freq.most_common(max_keywords)]

def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate simple text similarity (Jaccard similarity).
    
    Args:
        text1 (str): First text
        text2 (str): Second text
        
    Returns:
        float: Similarity score (0-1)
    """
    if not text1 or not text2:
        return 0.0
    
    set1 = set(text1.lower().split())
    set2 = set(text2.lower().split())
    
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    
    if not union:
        return 0.0
    
    return len(intersection) / len(union)

def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human-readable format.
    
    Args:
        size_bytes (int): Size in bytes
        
    Returns:
        str: Formatted size (e.g., "2.5 MB")
    """
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    
    return f"{size_bytes:.2f} PB"

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list:
    """
    Split text into overlapping chunks.
    
    Args:
        text (str): Text to chunk
        chunk_size (int): Size of each chunk
        overlap (int): Overlap between chunks
        
    Returns:
        list: List of text chunks
    """
    if not text:
        return []
    
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    
    return chunks