from groq import Groq
import logging

logger = logging.getLogger(__name__)


TEXT_QUERY_INSTRUCTIONS = """Instructions:
- Use information from the video content when available
- If the video mentions related concepts, use them to explain the topic
- Combine the video content with your general knowledge to provide precise answers
- Do not add the extra information only dependent on the text
- Be positive and constructive - focus on what you CAN explain
- If the exact term isn't defined in the video but related concepts are mentioned, explain the concept using both the video context and general knowledge in less manner
- Never say "the video doesn't cover this" - instead, provide relevant information from the video
- Explain in topic five to six lines and use bullet points if needed to make it easier to read
- For all the questions, try to use text from the videos as much as possible
- Give me answer only one time and do not repeat the answer in different ways
- It should handle all type of questions and give me similar answers for all asked answer
- If the video text is not present so explain the concept in precise
-Always provide the informative results 
-Do not repeat the answer that are generated 
- Give the result confident 
-Point to point answer
- Do not add key word like in the video content 

"""


IMAGE_QUERY_INSTRUCTIONS = """INSTRUCTIONS:
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


class LLMService:
    def __init__(self, api_key, model_name='llama-3.3-70b-versatile', temperature=0.7, max_tokens=1000):
        try:
            if not api_key:
                raise ValueError("GROQ_API_KEY is required")

            self.client = Groq(api_key=api_key)
            self.model_name = model_name
            self.temperature = temperature
            self.max_tokens = max_tokens

            logger.info("Groq LLM service initialized with model: %s", model_name)
        except Exception as e:
            logger.error("Groq initialization failed: %s", str(e))
            raise

    def generate_answer(self, prompt, temperature=None, max_tokens=None, timeout=30):
        try:
            if not prompt or prompt.strip() == '':
                raise ValueError("Prompt cannot be empty")

            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature if temperature is not None else self.temperature,
                max_tokens=max_tokens if max_tokens is not None else self.max_tokens,
                timeout=timeout,
            )

            answer = response.choices[0].message.content
            if not answer:
                raise ValueError("Empty response from LLM")

            return answer

        except Exception as e:
            logger.error("LLM generation error: %s", str(e))
            raise

    def build_text_query_prompt(self, context, query):
        return f"""You are a helpful AI assistant answering questions about video content.

Video Content:
{context}

Question: {query}

{TEXT_QUERY_INSTRUCTIONS}

Provide a clear and helpful answer:"""

    def build_image_query_prompt(self, extracted_text, video_context, user_query, instructions=None):
        instruction_block = instructions or IMAGE_QUERY_INSTRUCTIONS
        effective_query = user_query if user_query else "Explain what's in the image and provide relevant information."
        effective_context = video_context if video_context else "No related video content found."

        return f"""You are a helpful AI assistant that combines information from multiple sources.

TEXT EXTRACTED FROM IMAGE (via OCR):
{extracted_text}

RELATED CONTENT FROM VIDEO DATABASE:
{effective_context}

USER QUESTION: {effective_query}

{instruction_block}

Provide a comprehensive answer:"""

    def generate_streaming(self, prompt, temperature=None, max_tokens=None):
        try:
            if not prompt or prompt.strip() == '':
                raise ValueError("Prompt cannot be empty")

            stream = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature if temperature is not None else self.temperature,
                max_tokens=max_tokens if max_tokens is not None else self.max_tokens,
                stream=True,
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error("LLM streaming error: %s", str(e))
            raise

    def get_model_info(self):
        return {
            'model_name': self.model_name,
            'temperature': self.temperature,
            'max_tokens': self.max_tokens,
        }
