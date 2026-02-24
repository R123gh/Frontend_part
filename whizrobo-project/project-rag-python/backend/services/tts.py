from gtts import gTTS
import tempfile
import os
import re
import logging

logger = logging.getLogger(__name__)

class TTSService:
    def __init__(self, language='en', slow=False):
        try:
            self.language = language
            self.slow = slow
            logger.info(f"✓ TTS service initialized with language: {language}")
        except Exception as e:
            logger.error(f"TTS initialization failed: {str(e)}")
            raise
    
    def clean_text(self, text):
        try:
            if not text or text.strip() == '':
                raise ValueError("Text cannot be empty")
            
            cleaned = re.sub(r'[•\-\*]\s*', '', text)
            cleaned = re.sub(r'\*\*(.+?)\*\*', r'\1', cleaned)
            cleaned = re.sub(r'\*(.+?)\*', r'\1', cleaned)
            cleaned = re.sub(r'#{1,6}\s*', '', cleaned)
            cleaned = re.sub(r'\n+', '. ', cleaned)
            cleaned = re.sub(r'\s+', ' ', cleaned)
            cleaned = re.sub(r'\.\.+', '.', cleaned)
            cleaned = re.sub(r'[^\w\s\.,!?\'\"-]', '', cleaned)
            
            return cleaned.strip()
        
        except Exception as e:
            logger.error(f"Text cleaning error: {str(e)}")
            raise
    
    def generate_audio(self, text, language=None, slow=None):
        tmp_path = None
        try:
            if not text or text.strip() == '':
                raise ValueError("Text cannot be empty for TTS")
            
            clean_text = self.clean_text(text)
            
            if len(clean_text) == 0:
                raise ValueError("Cleaned text is empty")
            
            lang = language or self.language
            is_slow = slow if slow is not None else self.slow
            
            tts = gTTS(text=clean_text, lang=lang, slow=is_slow)
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp:
                tmp_path = tmp.name
                tts.save(tmp_path)
            
            with open(tmp_path, 'rb') as f:
                audio_bytes = f.read()
            
            if tmp_path and os.path.exists(tmp_path):
                os.remove(tmp_path)
            
            logger.info(f"✓ TTS generated {len(audio_bytes)} bytes audio")
            return audio_bytes
        
        except Exception as e:
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except:
                    pass
            logger.error(f"TTS generation error: {str(e)}")
            raise
    
    def save_audio(self, text, output_path, language=None, slow=None):
        try:
            audio_bytes = self.generate_audio(text, language, slow)
            
            with open(output_path, 'wb') as f:
                f.write(audio_bytes)
            
            logger.info(f"✓ Audio saved to: {output_path}")
            return output_path
        
        except Exception as e:
            logger.error(f"Audio save error: {str(e)}")
            raise
    
    def get_service_info(self):
        return {
            'language': self.language,
            'slow': self.slow,
            'supported_languages': ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko']
        }