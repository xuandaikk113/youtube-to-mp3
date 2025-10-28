// DOM elements
const submitBtn = document.getElementById('submit-btn');
const videoUrlInput = document.getElementById('video-url');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const btnLoader = document.getElementById('btn-loader');

// State management
let isProcessing = false;

// Utility functions
function showStatus(message, type = '') {
    statusEl.textContent = message;
    statusEl.className = `status-text ${type}`;
}

function clearResult() {
    resultEl.innerHTML = '';
}

function setButtonLoading(loading) {
    isProcessing = loading;
    submitBtn.disabled = loading;
    
    if (loading) {
        btnLoader.classList.add('active');
    } else {
        btnLoader.classList.remove('active');
    }
}

function isValidYouTubeUrl(url) {
    const youtubePatterns = [
        /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//,
        /^(https?:\/\/)?(www\.)?youtu\.be\//,
        /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=/,
        /^(https?:\/\/)?(www\.)?youtube\.com\/embed\//,
        /^(https?:\/\/)?(www\.)?youtube\.com\/v\//
    ];
    
    return youtubePatterns.some(pattern => pattern.test(url));
}

function createDownloadLink(data) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'download-item';
    
    const downloadLink = document.createElement('a');
    downloadLink.href = data.download_link;
    downloadLink.download = data.filename;
    downloadLink.className = 'download-link';
    downloadLink.target = '_blank';
    
    downloadLink.innerHTML = `
        <span class="download-icon">⬇️</span>
        <span>Download: ${data.title || 'audio.mp3'}</span>
    `;
    
    linkContainer.appendChild(downloadLink);
    
    // Add file info
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    fileInfo.style.fontSize = '0.8rem';
    fileInfo.style.color = 'rgba(215, 234, 255, 0.6)';
    fileInfo.style.marginTop = '0.5rem';
    fileInfo.textContent = `File: ${data.filename}`;
    
    linkContainer.appendChild(fileInfo);
    
    return linkContainer;
}

function getFriendlyErrorMessage(status, detail) {
    if (detail) {
        return detail;
    }

    if (status >= 500) {
        return 'Server error. Please try again later.';
    }

    if (status === 408) {
        return 'Download timed out. The video might be too long or unavailable.';
    }

    if (status === 400) {
        return 'Unable to process this URL. Please verify the link and try again.';
    }

    return 'An error occurred. Please try again.';
}

async function downloadAudio() {
    const url = videoUrlInput.value.trim();
    
    // Validation
    if (!url) {
        showStatus('Please paste a valid URL.', 'error');
        videoUrlInput.focus();
        return;
    }
    
    if (!isValidYouTubeUrl(url)) {
        showStatus('Please provide a valid YouTube URL.', 'error');
        videoUrlInput.focus();
        return;
    }
    
    // Start processing
    setButtonLoading(true);
    clearResult();
    showStatus('Analyzing and processing...', 'processing');
    
    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();

        if (!response.ok) {
            const message = getFriendlyErrorMessage(response.status, data.detail);
            throw new Error(message);
        }
        
        if (data.status === 'success') {
            showStatus('Complete! Your audio is ready.', 'success');
            
            // Create download link
            const downloadElement = createDownloadLink(data);
            resultEl.appendChild(downloadElement);
            
            // Optional: Auto-trigger download after a short delay
            setTimeout(() => {
                const link = downloadElement.querySelector('.download-link');
                if (link) {
                    link.click();
                }
            }, 1000);
            
        } else {
            throw new Error(data.message || 'An error occurred during processing.');
        }
        
    } catch (error) {
        console.error('Download error:', error);
        
        let errorMessage = 'An error occurred. Please try again.';
        const normalizedMessage = (error.message || '').toLowerCase();

        if (normalizedMessage.includes('timeout')) {
            errorMessage = 'Download timeout - the video may be too long or unavailable.';
        } else if (normalizedMessage.includes('network')) {
            errorMessage = 'Network error. Please check your connection.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showStatus(errorMessage, 'error');
    } finally {
        setButtonLoading(false);
    }
}

// Event listeners
submitBtn.addEventListener('click', downloadAudio);

videoUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isProcessing) {
        downloadAudio();
    }
});

videoUrlInput.addEventListener('input', () => {
    // Clear status when user types
    if (statusEl.className.includes('error')) {
        showStatus('');
    }
});

videoUrlInput.addEventListener('paste', (e) => {
    // Clear status on paste
    setTimeout(() => {
        if (statusEl.className.includes('error')) {
            showStatus('');
        }
    }, 100);
});

// Auto-focus input on page load
window.addEventListener('load', () => {
    videoUrlInput.focus();
});

// Optional: Add some visual effects
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(0, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: float 6s linear infinite;
        left: ${Math.random() * 100}%;
        top: 100%;
        box-shadow: 0 0 6px rgba(0, 255, 255, 0.3);
    `;
    
    document.getElementById('particles').appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 6000);
}

// Add floating particles effect (subtle)
if (window.innerWidth > 768) {
    setInterval(createParticle, 3000);
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console easter egg
console.log(`
🎧 ZEN DOWNLOADER - Personal Audio Extractor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ▄███████▄ ▄███████▄ ██▄   ▄██ 
  ▀▀███▀▀▀  ▀▀███▀▀▀  ███   ███  
    ███      ███      ███   ███  
    ███      ███      ███▄▄▄███  
    ███      ███      ▀▀▀▀▀▀███  
    ███      ███      ▄██   ███  
    ███      ███      ███   ███  
   ▄████▀   ▄████▀    ███   █▀   

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 For personal use only
🔧 Powered by yt-dlp & ffmpeg
💫 Made with cyberpunk vibes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);