const UI = {
    showLoading(text = 'Processing...') {
        const loadingEl = document.getElementById('loading');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingEl) {
            loadingEl.classList.remove('hidden');
        }
        
        if (loadingText) {
            loadingText.textContent = text;
        }
    },

    hideLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }
    },

    showStatus(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `status-message ${type}`;
            element.style.display = 'block';
        }
    },

    hideStatus(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
            element.className = 'status-message';
        }
    },

    showError(message) {
        alert(`Error: ${message}`);
        console.error(message);
    },

    showSuccess(message) {
        console.log(`${message}`);
    },

    displayTextAnswer(answer) {
        const textAnswerEl = document.getElementById('text-answer');
        const textResultEl = document.getElementById('text-result');
        const audioPlayerEl = document.getElementById('audio-player');

        if (textAnswerEl) {
            textAnswerEl.textContent = answer;
        }

        if (textResultEl) {
            textResultEl.classList.remove('hidden');
        }

        if (audioPlayerEl) {
            audioPlayerEl.classList.add('hidden');
        }

        this.scrollToElement('text-result');
    },

    displayImageResult(result) {
        const ocrTextEl = document.getElementById('ocr-text');
        const imageAnswerEl = document.getElementById('image-answer');
        const imageResultEl = document.getElementById('image-result');

        if (ocrTextEl) {
            ocrTextEl.value = result.extracted_text || '';
        }

        if (imageAnswerEl) {
            imageAnswerEl.textContent = result.answer || '';
        }

        if (imageResultEl) {
            imageResultEl.classList.remove('hidden');
        }

        this.scrollToElement('image-result');
    },

    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    },

    clearInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
        }
    },

    disableButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
        }
    },

    enableButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
        }
    },

    toggleElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle('hidden');
        }
    },

    addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    },

    removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    },

    formatText(text) {
        if (!text) return '';
        
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/\n/g, '<br>');
        
        return text;
    },

    truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    },

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    },

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Copied to clipboard!', 'success', 2000);
            }).catch(() => {
                this.showNotification('Failed to copy', 'error', 2000);
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Copied to clipboard!', 'success', 2000);
        }
    }
};

window.UI = UI;
