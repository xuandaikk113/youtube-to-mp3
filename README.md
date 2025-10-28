# 🎧 Zen Downloader - Personal Audio Extractor 🎶

![Conceptual image of a futuristic, dark user interface with slow-moving neon gradients, symbolizing a minimalist, tech-chic aesthetic.]

## Project Overview

**Zen Downloader** is a personal "vibe coding" project designed to be a sleek, distraction-free, and ad-free tool for downloading audio from YouTube.

This application focuses on delivering a highly customized and optimized user experience, blending a minimalist functional core with a captivating Cyberpunk/Tech-Chic aesthetic.

***Disclaimer: This project is strictly for personal, educational, and non-commercial use. It should not be deployed publicly or used to infringe upon copyright laws.***

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

## 🚀 Setup and Installation (For Personal Deployment)

To run Zen Downloader on your local machine or private server, you must install the following prerequisites and follow the steps below:

### Prerequisites

1.  **Python 3.x**
2.  **`ffmpeg`:** Must be installed and available in your system's PATH.
3.  **`yt-dlp`:** Install via pip: `pip install yt-dlp`
4.  **Backend Framework:** (FastAPI) `pip install FastAPI`

### Getting Started

1.  **Backend (Python):**
    * Navigate to the directory containing your `app.py` file.
    * Start the server: `python app.py` (or the equivalent command for your chosen framework).
2.  **Frontend (Web App):**
    * Access the application via your browser, usually at `http://localhost:[PORT]`.

## 💡 How to Use

1.  Copy the URL of the desired YouTube video.
2.  Paste the URL into the input field on the Zen Downloader interface.
3.  Click the **EXTRACT VIBE** button.
4.  Monitor the status area for real-time processing updates.
5.  Once complete, a download link will appear for the MP3 file.

## 🤝 Credits and Acknowledgements

* **`yt-dlp`** and **`ffmpeg`** projects for providing robust open-source media processing capabilities.
* The personal design focus is dedicated to an optimized, distraction-free experience.

---