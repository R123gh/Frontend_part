let selectedImage = null;
let currentAudioUrl = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('RAG System initializing...');
    console.log(`API Base URL: ${API.getBaseUrl()}`);

    await checkSystemHealth();
    initializeEventListeners();

    console.log('RAG System ready!');
});

async function checkSystemHealth() {
    try {
        const health = await API.healthCheck();
        if (health.status === 'healthy') {
            console.log(`Backend connected: ${health.collection_count} chunks available`);
        }
    } catch (error) {
        UI.showError(`Backend connection failed at ${API.getBaseUrl()}. Please ensure backend is running and reachable.`);
        console.error('Health check failed:', error);
    }
}

function initializeEventListeners() {
    setupTextVoiceTab();
    setupImageTab();
}

function setupTextVoiceTab() {
    const askBtn = document.getElementById('ask-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const listenBtn = document.getElementById('listen-btn');
    const clearBtn = document.getElementById('clear-btn');
    const queryInput = document.getElementById('query-input');

    if (queryInput) {
        queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                askBtn.click();
            }
        });
    }

    if (askBtn) {
        askBtn.addEventListener('click', handleTextQuery);
    }

    if (voiceBtn) {
        voiceBtn.addEventListener('click', handleVoiceInput);
    }

    if (listenBtn) {
        listenBtn.addEventListener('click', handleTextToSpeech);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearTextResults);
    }
}

function setupImageTab() {
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const downloadBtn = document.getElementById('download-btn');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => imageInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageSelect(file);
            } else {
                UI.showError('Please upload a valid image file');
            }
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageSelect(file);
            }
        });
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleImageAnalysis);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadResult);
    }
}

async function handleTextQuery() {
    const queryInput = document.getElementById('query-input');
    const query = queryInput.value.trim();

    if (!query) {
        UI.showStatus('voice-status', 'Please enter a question', 'error');
        return;
    }

    UI.showLoading('Thinking...');
    UI.hideStatus('voice-status');

    try {
        const result = await API.queryText(query, 5);

        if (!result || result.success === false) {
            throw new Error(result?.error || 'Query failed');
        }

        const answer = result?.data?.answer ?? result?.answer;
        if (!answer) {
            throw new Error('No answer returned from backend');
        }

        UI.hideLoading();
        UI.displayTextAnswer(answer);

    } catch (error) {
        UI.hideLoading();
        UI.showStatus('voice-status', `Error: ${error.message}`, 'error');
        console.error('Query error:', error);
    }
}

async function handleVoiceInput() {
    if (!Voice.isSupported()) {
        UI.showStatus('voice-status', 'Voice recognition not supported in this browser', 'error');
        return;
    }

    UI.showStatus('voice-status', 'Listening... Speak now!', 'success');

    try {
        const transcript = await Voice.recognize();

        if (transcript) {
            document.getElementById('query-input').value = transcript;
            UI.showStatus('voice-status', transcript, 'success');

            setTimeout(() => {
                handleTextQuery();
            }, 500);
        } else {
            UI.showStatus('voice-status', 'Could not understand. Try again.', 'error');
        }
    } catch (error) {
        UI.showStatus('voice-status', 'Voice input failed. Try again.', 'error');
        console.error('Voice error:', error);
    }
}

async function handleTextToSpeech() {
    const answerText = document.getElementById('text-answer').textContent;

    if (!answerText) {
        return;
    }

    UI.showLoading('Generating audio...');

    try {
        const audioBlob = await API.textToSpeech(answerText);

        if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl);
        }

        currentAudioUrl = URL.createObjectURL(audioBlob);

        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = currentAudioUrl;
        audioPlayer.classList.remove('hidden');
        audioPlayer.play();

        UI.hideLoading();

    } catch (error) {
        UI.hideLoading();
        UI.showStatus('voice-status', 'Audio generation failed', 'error');
        console.error('TTS error:', error);
    }
}

function clearTextResults() {
    document.getElementById('query-input').value = '';
    document.getElementById('text-result').classList.add('hidden');
    document.getElementById('audio-player').classList.add('hidden');
    UI.hideStatus('voice-status');

    if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
        currentAudioUrl = null;
    }
}

function handleImageSelect(file) {
    const maxSize = 16 * 1024 * 1024;

    if (file.size > maxSize) {
        UI.showError('Image size must be less than 16MB');
        return;
    }

    selectedImage = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const previewImg = document.getElementById('preview-img');
        previewImg.src = e.target.result;
        document.getElementById('image-preview').classList.remove('hidden');
        document.getElementById('analyze-btn').disabled = false;
    };
    reader.onerror = () => {
        UI.showError('Failed to read image file');
    };
    reader.readAsDataURL(file);
}

async function handleImageAnalysis() {
    if (!selectedImage) {
        return;
    }

    const query = document.getElementById('image-query-input').value.trim();

    UI.showLoading('Analyzing image...');

    try {
        const result = await API.imageQuery(selectedImage, query, 5);

        if (!result || result.success === false) {
            throw new Error(result?.error || 'Image analysis failed');
        }

        const payload = result?.data ?? result;
        UI.hideLoading();
        UI.displayImageResult(payload);

    } catch (error) {
        UI.hideLoading();
        UI.showError(`Analysis failed: ${error.message}`);
        console.error('Image analysis error:', error);
    }
}

function downloadResult() {
    const ocrEl = document.getElementById('ocr-text');
    const ocrText = ocrEl ? (ocrEl.value || '') : '';
    const answer = document.getElementById('image-answer').textContent;

    const content = ocrText
        ? `=== IMAGE OCR TEXT ===\n${ocrText}\n\n=== AI ANSWER ===\n${answer}`
        : `=== AI ANSWER ===\n${answer}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rag-result-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.switchTab = function(tab) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    if (tab === 'text') {
        tabBtns[0].classList.add('active');
        document.getElementById('text-tab').classList.add('active');
    } else {
        tabBtns[1].classList.add('active');
        document.getElementById('image-tab').classList.add('active');
    }
};

window.addEventListener('beforeunload', () => {
    if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
    }
});
