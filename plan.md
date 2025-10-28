# Zen Downloader — Personal Audio Extractor

Documentation for a personal audio download Web App with minimalist interface, Minimalist Cyberpunk/Tech‑Chic style.

## 1. Project Goal

- Build a Web App for personal audio downloads (personal use only).
- Minimalist experience: paste link → download.
- Clean, attractive UI with Minimalist Cyberpunk/Tech‑Chic vibe.

## 2. Tech Stack

| Component | Technology | Reason |
| --- | --- | --- |
| Frontend | HTML5, CSS3 (Vanilla/Tailwind), JavaScript | Create the "vibe" interface, handle AJAX requests. |
| Backend | Python (FastAPI) | Handle server logic, integrate with CLI tools. |
| Utilities | yt-dlp (CLI), ffmpeg (Audio Processing) | Powerful and reliable tools for audio extraction and conversion. |

## 3. Backend Requirements (Python — FastAPI)

- Create an API endpoint to handle download requests.
- Endpoint: `POST /api/download`
- Input: Accepts JSON containing video URL, example:

```json
{
	"url": "https://www.youtube.com/watch?v=..."
}
```
```json
{
	"url": "https://www.youtube.com/watch?v=..."
}
```

### Processing Logic

1. URL Validation: Check if the URL format is valid.
2. Execute yt-dlp via subprocess:
	 - Required: extract audio (`-x`), convert to MP3 (`--audio-format mp3`).
	 - Save file to temporary directory on server.
3. Return JSON response:
	 - Success: `status: "success"` and `download_link` pointing to downloaded file.
	 - Failure: `status: "error"` and `message` describing the error.

Example yt-dlp command reference:

```bash
yt-dlp -x --audio-format mp3 "<VIDEO_URL>"
```

### Response

- Success:

```json
{
	"status": "success",
	"title": "<song title>",
	"download_link": "/downloads/<file>.mp3"
}
```

- Failure:

```json
{
	"status": "error",
	"message": "Specific error reason"
}
```

## 4. Frontend Requirements (HTML, CSS, JavaScript)

### 4.1. HTML Structure (Minimalist Core)

- Main container: center all content.
- Header: Title "ZEN DOWNLOADER" (monospace/tech‑chic font).
- Input Form:
	- `<input type="text" id="video-url">`
	- `<button id="submit-btn">EXTRACT VIBE</button>`
- Status Area `#status`: display status messages.

HTML template reference:

```html
<main class="container">
	<h1>ZEN DOWNLOADER</h1>
	<div class="form">
		<input type="text" id="video-url" placeholder="Paste YouTube URL here" />
		<button id="submit-btn">EXTRACT VIBE</button>
	</div>
	<div id="status"></div>
	<div id="result"></div>
	<!-- result: display download link when successful -->
  
	<!-- Optional: small footer with personal use note -->
	<footer class="note">For personal use only.</footer>
  
	<!-- backdrops / gradients can be set with CSS -->
	<div class="backdrop"></div>
	<div class="backdrop overlay"></div>
	<div id="particles"></div>
  
	<script src="app.js"></script>
</main>
```

### 4.2. Interface & Vibe CSS (Aesthetic Requirements)

#### A. Background and Motion Effects (The Vibe)

- Dark Mode: Deep black background across the entire page.
- Background Animation: CSS `@keyframes` create continuous, smooth gradient movement (very subtle) on `body`.
- Gradient colors suggestion: `#0a0014` (purple-black), `#000a14` (blue-black), `#1a052b` (charcoal-purple).
- Speed: slow, 20–30 seconds/cycle.
- Font: apply monospace or tech‑chic font to all text.

#### B. Neon Glow Effects (The Focus)

- Input & Button: `box-shadow` with neon colors (cyan `#00ffff` or pink `#ff00aa`) to simulate glow.
- Hover Button: Brighter glow + subtle scale effect `transform: scale(1.05)` with smooth `transition`.
- Status Text: Status text uses vivid neon colors (synchronized with palette).

Quick CSS suggestions:

```css
body {
	background: linear-gradient(135deg, #0a0014, #000a14, #1a052b);
	background-size: 400% 400%;
	animation: zenShift 25s ease-in-out infinite;
	color: #d7eaff;
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

@keyframes zenShift {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

input#video-url, button#submit-btn {
	background: rgba(10, 10, 20, 0.6);
	border: 1px solid rgba(0, 255, 255, 0.25);
	box-shadow: 0 0 12px rgba(0, 255, 255, 0.25), inset 0 0 8px rgba(0, 255, 255, 0.1);
	color: #e7faff;
}

button#submit-btn:hover {
	transform: scale(1.05);
	box-shadow: 0 0 18px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.25);
}

#status.success { color: #00ffff; }
#status.error { color: #ff00aa; }
```

### 4.3. JavaScript (Interaction Logic)

- Listen for click events from `#submit-btn`.
- Get value from `#video-url` and send `POST` to `/api/download`.
- Update `#status` throughout the process (example: "Analyzing and processing...").
- Completion:
	- If successful: display song title and create download link `<a href="...">`.
	- If error: display error message with neon red color.

Pseudo-code:

```js
const btn = document.getElementById('submit-btn');
const input = document.getElementById('video-url');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');

btn.addEventListener('click', async () => {
	const url = input.value.trim();
	if (!url) {
		statusEl.textContent = 'Please paste a valid URL.';
		statusEl.className = 'error';
		return;
	}
	statusEl.textContent = 'Analyzing and processing...';
	statusEl.className = '';
	resultEl.innerHTML = '';

	try {
		const res = await fetch('/api/download', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url })
		});
		const data = await res.json();
		if (data.status === 'success') {
			statusEl.textContent = 'Complete!';
			statusEl.className = 'success';
			const a = document.createElement('a');
			a.href = data.download_link;
			a.textContent = `Download: ${data.title || 'audio.mp3'}`;
			resultEl.appendChild(a);
		} else {
			statusEl.textContent = data.message || 'An error occurred.';
			statusEl.className = 'error';
		}
	} catch (e) {
		statusEl.textContent = 'Network or server error.';
		statusEl.className = 'error';
	}
});
```

---