const resolveApiBaseUrl = () => {
    const fromWindow = window.__API_BASE_URL;
    const fromStorage = window.localStorage ? localStorage.getItem('API_BASE_URL') : null;
    const fromMeta = document.querySelector('meta[name="api-base-url"]')?.content;
    let fallback = window.location.origin;
    if (!fromWindow && !fromStorage && !fromMeta) {
        const host = window.location.hostname;
        const isLocal = host === 'localhost' || host === '127.0.0.1';
        if (isLocal && window.location.port && window.location.port !== '5000') {
            fallback = `${window.location.protocol}//${host}:5000`;
        }
    }
    const selected = fromWindow || fromStorage || fromMeta || fallback;
    return selected.replace(/\/$/, '');
};

let API_BASE_URL = resolveApiBaseUrl();

window.setApiBaseUrl = (url) => {
    if (!url || typeof url !== 'string') {
        throw new Error('API base URL must be a non-empty string');
    }
    API_BASE_URL = url.replace(/\/$/, '');
    if (window.localStorage) {
        localStorage.setItem('API_BASE_URL', API_BASE_URL);
    }
    return API_BASE_URL;
};

const API = {
    async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    },

    async queryText(query, topK = 5) {
        try {
            if (!query || query.trim() === '') {
                throw new Error('Query cannot be empty');
            }

            const response = await fetch(`${API_BASE_URL}/api/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query.trim(),
                    top_k: topK
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Request failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Query text error:', error);
            throw error;
        }
    },

    async extractOCR(imageFile) {
        try {
            if (!imageFile) {
                throw new Error('Image file is required');
            }

            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch(`${API_BASE_URL}/api/ocr`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `OCR failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('OCR extraction error:', error);
            throw error;
        }
    },

    async imageQuery(imageFile, query = '', topK = 5) {
        try {
            if (!imageFile) {
                throw new Error('Image file is required');
            }

            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('query', query.trim());
            formData.append('top_k', topK.toString());

            const response = await fetch(`${API_BASE_URL}/api/image-query`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Image query failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Image query error:', error);
            throw error;
        }
    },

    async textToSpeech(text) {
        try {
            if (!text || text.trim() === '') {
                throw new Error('Text cannot be empty');
            }

            const response = await fetch(`${API_BASE_URL}/api/tts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `TTS failed: ${response.status}`);
            }

            return await response.blob();
        } catch (error) {
            console.error('Text-to-speech error:', error);
            throw error;
        }
    },

    isOnline() {
        return navigator.onLine;
    },

    async checkConnection() {
        try {
            const health = await this.healthCheck();
            return health.status === 'healthy';
        } catch (error) {
            return false;
        }
    },

    getBaseUrl() {
        return API_BASE_URL;
    }
};

window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});

window.API = API;
