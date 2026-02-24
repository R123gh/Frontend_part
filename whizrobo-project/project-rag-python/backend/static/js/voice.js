const Voice = {
    recognition: null,
    isListening: false,

    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },

    initialize() {
        if (!this.isSupported()) {
            console.warn('Speech recognition not supported');
            return null;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        return this.recognition;
    },

    async recognize() {
        return new Promise((resolve, reject) => {
            if (!this.isSupported()) {
                reject(new Error('Speech recognition not supported'));
                return;
            }

            if (!this.recognition) {
                this.initialize();
            }

            if (this.isListening) {
                reject(new Error('Already listening'));
                return;
            }

            this.isListening = true;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const confidence = event.results[0][0].confidence;
                
                console.log(`Voice input: "${transcript}" (confidence: ${confidence.toFixed(2)})`);
                
                this.isListening = false;
                resolve(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                
                if (event.error === 'no-speech') {
                    reject(new Error('No speech detected'));
                } else if (event.error === 'audio-capture') {
                    reject(new Error('Microphone not available'));
                } else if (event.error === 'not-allowed') {
                    reject(new Error('Microphone permission denied'));
                } else {
                    reject(new Error(event.error));
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };

            try {
                this.recognition.start();
            } catch (error) {
                this.isListening = false;
                reject(error);
            }
        });
    },

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    },

    async recognizeWithTimeout(timeout = 10000) {
        return Promise.race([
            this.recognize(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Voice input timeout')), timeout)
            )
        ]);
    },

    checkMicrophonePermission() {
        if (navigator.permissions) {
            return navigator.permissions.query({ name: 'microphone' })
                .then(result => {
                    console.log('Microphone permission:', result.state);
                    return result.state === 'granted';
                })
                .catch(error => {
                    console.error('Permission check error:', error);
                    return false;
                });
        }
        return Promise.resolve(false);
    },

    async requestMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }
};

window.Voice = Voice;