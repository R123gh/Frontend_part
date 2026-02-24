import logging
import os
import tempfile
import time

import ocrspace

logger = logging.getLogger(__name__)

OCR_QUERY_INSTRUCTIONS = """INSTRUCTIONS:
- Analyze the text extracted from the image
- Use the related video content to provide additional context
- Answer the user's question in a precise manner
- Be clear, detailed, and helpful
- If the image contains code, explain it step by step
- If there's related information in the video database, mention it
- Combine all sources naturally in your response
- Explain in 3-4 lines and use bullet points if needed
- For all questions, try to use text from the videos as much as possible
- Give answer only one time and do not repeat in different ways
- If video text is not present, explain the concept precisely"""


class OCRService:
    def __init__(self, api_key, ocr_engine=2, timeout=20, retries=2, retry_delay=1.5):
        try:
            if not api_key:
                raise ValueError("OCR_SPACE_API_KEY is required")

            self.api = ocrspace.API(api_key=api_key)
            self.ocr_engine = ocr_engine
            self.timeout = float(timeout)
            self.retries = max(0, int(retries))
            self.retry_delay = max(0.0, float(retry_delay))

            logger.info(
                "OCR service initialized with engine=%s timeout=%ss retries=%s",
                self.ocr_engine,
                self.timeout,
                self.retries,
            )
        except Exception as e:
            logger.error("OCR initialization failed: %s", str(e))
            raise

    @staticmethod
    def _is_timeout_error(error):
        message = str(error).lower()
        timeout_markers = [
            "timed out",
            "connecttimeout",
            "readtimeout",
            "connection to api.ocr.space timed out",
        ]
        return any(marker in message for marker in timeout_markers)

    @staticmethod
    def _is_connection_error(error):
        message = str(error).lower()
        connection_markers = [
            "connection error",
            "max retries exceeded",
            "failed to establish a new connection",
            "name or service not known",
            "temporary failure in name resolution",
            "connection aborted",
        ]
        return any(marker in message for marker in connection_markers)

    def _ocr_file_with_retry(self, tmp_path):
        attempts = self.retries + 1
        last_error = None

        for attempt in range(1, attempts + 1):
            try:
                # ocrspace library does not expose request timeout directly.
                return self.api.ocr_file(tmp_path)
            except Exception as e:
                last_error = e
                if attempt >= attempts:
                    break
                if self._is_timeout_error(e) or self._is_connection_error(e):
                    logger.warning(
                        "OCR attempt %s/%s failed (%s). Retrying in %ss...",
                        attempt,
                        attempts,
                        str(e),
                        self.retry_delay,
                    )
                    time.sleep(self.retry_delay)
                    continue
                raise

        raise last_error

    def extract_text(self, image_bytes, language='eng', detect_orientation=True):
        tmp_path = None
        try:
            if not image_bytes or len(image_bytes) == 0:
                raise ValueError("Image bytes cannot be empty")

            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                tmp.write(image_bytes)
                tmp_path = tmp.name

            extracted_text = self._ocr_file_with_retry(tmp_path)

            if tmp_path and os.path.exists(tmp_path):
                os.remove(tmp_path)

            if not extracted_text or len(extracted_text.strip()) == 0:
                return "No text found in image"

            logger.info("OCR extracted %s characters", len(extracted_text))
            return extracted_text.strip()

        except Exception as e:
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except Exception:
                    pass

            if self._is_timeout_error(e):
                logger.warning("OCR request timed out after retries: %s", str(e))
                return "Error: OCR service timed out. Please retry in a moment."

            if self._is_connection_error(e):
                logger.warning("OCR service unreachable after retries: %s", str(e))
                return "Error: OCR service is temporarily unreachable. Please retry."

            logger.error("OCR extraction error: %s", str(e))
            raise

    def extract_text_from_url(self, image_url):
        try:
            if not image_url or image_url.strip() == '':
                raise ValueError("Image URL cannot be empty")

            attempts = self.retries + 1
            extracted_text = None
            last_error = None

            for attempt in range(1, attempts + 1):
                try:
                    extracted_text = self.api.ocr_url(image_url)
                    break
                except Exception as e:
                    last_error = e
                    if attempt >= attempts:
                        break
                    if self._is_timeout_error(e) or self._is_connection_error(e):
                        logger.warning(
                            "OCR URL attempt %s/%s failed (%s). Retrying in %ss...",
                            attempt,
                            attempts,
                            str(e),
                            self.retry_delay,
                        )
                        time.sleep(self.retry_delay)
                        continue
                    raise

            if extracted_text is None and last_error is not None:
                if self._is_timeout_error(last_error):
                    return "Error: OCR service timed out. Please retry in a moment."
                if self._is_connection_error(last_error):
                    return "Error: OCR service is temporarily unreachable. Please retry."
                raise last_error

            if not extracted_text or len(extracted_text.strip()) == 0:
                return "No text found in image"

            logger.info("OCR extracted %s characters from URL", len(extracted_text))
            return extracted_text.strip()

        except Exception as e:
            logger.error("OCR URL extraction error: %s", str(e))
            raise

    def get_service_info(self):
        return {
            'ocr_engine': self.ocr_engine,
            'timeout': self.timeout,
            'retries': self.retries,
            'supported_formats': ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
        }

    @staticmethod
    def get_query_instructions():
        return OCR_QUERY_INSTRUCTIONS
