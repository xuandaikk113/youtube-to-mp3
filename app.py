import logging
import os
import subprocess
import uuid
import json
from pathlib import Path
from urllib.parse import urlparse
import re
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Zen Downloader", description="Personal Audio Extractor")

# Basic logger for backend diagnostics
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("zen_downloader")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")
templates = Jinja2Templates(directory="templates")

# Ensure downloads directory exists
downloads_dir = Path("downloads")
downloads_dir.mkdir(exist_ok=True)

class DownloadRequest(BaseModel):
    url: str


def get_user_message(stderr: Optional[str]) -> str:
    """Map yt-dlp stderr to a friendly message for the UI."""
    if not stderr:
        return "Unable to process this video right now. Please try again later."

    normalized = stderr.lower()

    if "sign in to confirm" in normalized or "age-restricted" in normalized:
        return "This video is age restricted. Please choose a different link."
    if "private video" in normalized:
        return "This video is private. Please use a public video URL."
    if "live stream" in normalized or "is live" in normalized:
        return "Live streams cannot be downloaded. Please wait until the stream ends."
    if "copyright" in normalized or "blocked" in normalized:
        return "This video is blocked or restricted in your region."

    return "Unable to process this video right now. Please try again later."

def is_valid_youtube_url(url: str) -> bool:
    """Validate if the URL is a valid YouTube URL"""
    youtube_patterns = [
        r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/',
        r'(https?://)?(www\.)?youtu\.be/',
        r'(https?://)?(www\.)?youtube\.com/watch\?v=',
        r'(https?://)?(www\.)?youtube\.com/embed/',
        r'(https?://)?(www\.)?youtube\.com/v/'
    ]
    
    for pattern in youtube_patterns:
        if re.match(pattern, url):
            return True
    return False

def sanitize_filename(filename: str) -> str:
    """Remove invalid characters from filename"""
    # Remove or replace invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Replace multiple spaces with single space
    filename = re.sub(r'\s+', ' ', filename)
    # Trim whitespace
    filename = filename.strip()
    # Limit length
    if len(filename) > 100:
        filename = filename[:100]
    return filename

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the main page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/download")
async def download_audio(download_request: DownloadRequest):
    """
    Download audio from YouTube URL and convert to MP3
    """
    try:
        url = download_request.url.strip()
        
        # Validate URL
        if not url:
            raise HTTPException(status_code=400, detail="URL is required")
        
        if not is_valid_youtube_url(url):
            raise HTTPException(status_code=400, detail="Please provide a valid YouTube URL")
        
        # Generate unique filename prefix
        unique_id = str(uuid.uuid4())[:8]
        output_template = f"downloads/{unique_id}_%(title)s.%(ext)s"
        
        # Prepare yt-dlp command
        cmd = [
            "yt-dlp",
            "--extract-audio",
            "--audio-format", "mp3",
            "--audio-quality", "0",  # Best quality
            "--output", output_template,
            "--no-playlist",
            "--embed-metadata",
            "--add-metadata",
            url
        ]
        
        # Execute yt-dlp
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,  # 5 minutes timeout
                check=True
            )
        except subprocess.TimeoutExpired:
            logger.error("yt-dlp timed out for url=%s", url)
            raise HTTPException(
                status_code=408,
                detail="Download timed out. The video might be too long or temporarily unavailable."
            )
        except subprocess.CalledProcessError as e:
            error_msg = (e.stderr or "").strip()
            logger.error("yt-dlp failed for url=%s error=%s", url, error_msg)
            raise HTTPException(status_code=400, detail=get_user_message(error_msg))
        
        # Find the downloaded file
        downloaded_files = list(downloads_dir.glob(f"{unique_id}_*.mp3"))
        
        if not downloaded_files:
            raise HTTPException(status_code=500, detail="File was not created successfully")
        
        downloaded_file = downloaded_files[0]
        
        # Extract title from filename (remove unique_id prefix and extension)
        title = downloaded_file.stem
        if title.startswith(f"{unique_id}_"):
            title = title[len(f"{unique_id}_"):]
        
        # Clean up title
        title = sanitize_filename(title)
        
        return {
            "status": "success",
            "title": title,
            "download_link": f"/downloads/{downloaded_file.name}",
            "filename": downloaded_file.name
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error while processing url=%s", download_request.url)
        raise HTTPException(status_code=500, detail="Unexpected server error. Please try again later.")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Zen Downloader"}

if __name__ == "__main__":
    print("🎧 Starting Zen Downloader...")
    print("🚀 Server will be available at: http://localhost:8000")
    print("📁 Downloads will be saved to: ./downloads/")
    print("\n⚠️  Make sure you have yt-dlp and ffmpeg installed!")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )