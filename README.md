# 🎧 Zen Downloader - Personal Audio Extractor 🎶

![Conceptual image of a futuristic, dark user interface with slow-moving neon gradients, symbolizing a minimalist, tech-chic aesthetic.]

## Project Overview

**Zen Downloader** is a personal audio extraction web application with a captivating **Minimalist Cyberpunk/Tech-Chic** aesthetic. Built with FastAPI backend and vanilla JavaScript frontend, it provides a sleek, distraction-free experience for downloading audio from YouTube videos.

### 🌟 Key Features
- **Cyberpunk Aesthetic**: Deep dark mode with animated neon gradients and glow effects
- **One-Click Download**: Simple paste URL → extract audio → download workflow
- **High-Quality Audio**: MP3 extraction using yt-dlp and ffmpeg
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Status updates and visual loading indicators

***⚠️ Disclaimer: This project is strictly for personal, educational, and non-commercial use. It should not be deployed publicly or used to infringe upon copyright laws.***

## ✨ Core Vibe & Features

| Feature | Description |
| :--- | :--- |
| **Aesthetic (The Vibe)** | Deep Dark Mode, subtle continuous background gradient animation, and striking Neon Glow effects on interactive elements. |
| **Functionality** | Dead simple workflow: Paste URL, click 'Extract Vibe', and download. No clutter, no ads. |
| **Performance** | Optimized backend leveraging `yt-dlp` and `ffmpeg` for rapid audio extraction and conversion. |
| **Output** | Extracts the audio stream and converts it into high-quality **MP3** files. |

## 🛠️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Vanilla CSS (Keyframes, Shadow), JavaScript | Creating the immersive UI/UX and handling user interaction/API calls. |
| **Backend** | Python (FastAPI) | Server-side API to manage requests and control CLI utilities. |
| **CLI Utilities** | `yt-dlp` and `ffmpeg` | Core tools for stream parsing, audio extraction, and format conversion. |

## 🚀 Quick Start

### Prerequisites

1. **Python 3.8+** - [Download here](https://www.python.org/downloads/)
2. **ffmpeg** - Required for audio processing
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `choco install ffmpeg`
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian) or `sudo dnf install ffmpeg` (Fedora)

### Installation

#### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup

1. **Clone and navigate:**
```bash
git clone <repository-url>
cd youtube-to-mp3
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Verify ffmpeg installation:**
```bash
ffmpeg -version
```

### Running the Application

1. **Start the server:**
```bash
python app.py
```

2. **Open your browser:**
Navigate to `http://localhost:8000`

3. **Start downloading:**
   - Paste a YouTube URL
   - Click "EXTRACT VIBE"
   - Download your MP3!

## 🎯 How to Use

1. **Copy YouTube URL**: Get the URL of any YouTube video
2. **Paste URL**: Enter it in the neon-glowing input field
3. **Extract Audio**: Click the "EXTRACT VIBE" button
4. **Monitor Progress**: Watch the real-time status updates
5. **Download**: Click the generated download link for your MP3

### Supported URLs
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- And other YouTube URL formats

## 📁 Project Structure

```
youtube-to-mp3/
├── app.py                 # FastAPI backend server
├── requirements.txt       # Python dependencies
├── setup.bat             # Windows setup script
├── setup.sh              # macOS/Linux setup script
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── styles.css        # Cyberpunk CSS styling
│   └── app.js            # Frontend JavaScript
└── downloads/            # Downloaded MP3 files
```

## ⚡ Features in Detail

### Backend (FastAPI)
- **REST API**: Clean `/api/download` endpoint
- **URL Validation**: Checks for valid YouTube URLs
- **Audio Processing**: yt-dlp integration with MP3 conversion
- **Error Handling**: Comprehensive error messages and timeouts
- **File Management**: Automatic file naming and cleanup

### Frontend (Vanilla JS + CSS)
- **Cyberpunk UI**: Animated gradients and neon glow effects
- **Responsive Design**: Mobile-friendly interface
- **Real-time Feedback**: Loading animations and status updates
- **Auto-download**: Automatic file download after processing
- **Keyboard Support**: Enter key to submit, auto-focus input

### Security Features
- **URL Validation**: Only accepts valid YouTube URLs
- **Timeout Protection**: Prevents long-running processes
- **Error Sanitization**: Clean error messages without sensitive data

## 🛠️ Troubleshooting

### Common Issues

**"ffmpeg not found"**
- Ensure ffmpeg is installed and in your system PATH
- Test with: `ffmpeg -version`

**"Download timeout"**
- Video may be too long (>5 minutes timeout)
- Check your internet connection
- Try a different video

**"Invalid URL"**
- Ensure you're using a valid YouTube URL
- Remove any extra parameters from the URL

**Python dependencies fail**
- Update pip: `python -m pip install --upgrade pip`
- Try installing individually: `pip install fastapi uvicorn yt-dlp`

## 🎨 Customization

### Changing Colors
Edit `static/styles.css` and modify the CSS variables:
- `#00ffff` - Cyan neon
- `#ff00aa` - Pink neon  
- `#0a0014`, `#000a14`, `#1a052b` - Background gradients

### Modifying Audio Quality
In `app.py`, adjust the yt-dlp parameters:
```python
"--audio-quality", "0",  # 0=best, 9=worst
```

## 🔧 Development

### Adding New Features
1. Backend changes: Modify `app.py`
2. Frontend changes: Edit `static/app.js` and `static/styles.css`
3. Template changes: Update `templates/index.html`

### Testing
- Test the `/health` endpoint: `curl http://localhost:8000/health`
- Test API directly: `curl -X POST http://localhost:8000/api/download -H "Content-Type: application/json" -d '{"url":"YOUTUBE_URL"}'`

## 🤝 Credits and Acknowledgements

- **[yt-dlp](https://github.com/yt-dlp/yt-dlp)**: Powerful YouTube download library
- **[FFmpeg](https://ffmpeg.org/)**: Audio/video processing toolkit
- **[FastAPI](https://fastapi.tiangolo.com/)**: Modern Python web framework
- **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)**: Cyberpunk-style monospace font

---