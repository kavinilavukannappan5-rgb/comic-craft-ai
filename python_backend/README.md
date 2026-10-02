# ComicCraft - Comic Story Creator using Gemini Models

An end-to-end AI-powered web application that generates personalized multi-panel comic book stories and illustrations based on user prompts. Powered by Google Gemini AI models and image diffusion pipelines.

---

## 🛠️ Tech Stack
- **Backend**: FastAPI, Uvicorn, Pydantic
- **AI Models**: Google Gemini (via `@google/genai` / `google-genai`), Diffusers / Stable Diffusion
- **Templating**: Jinja2 (HTML5, Responsive CSS, Halftone styling)
- **PDF Compilation**: FPDF2 & Pillow

---

## 🚀 VS Code Setup & Local Execution Guide

### 1. Open in VS Code
Open the project directory in VS Code:
```bash
code comiccraft
```

### 2. Set Up Python Virtual Environment
Open the VS Code Terminal (`Ctrl+\`` or `Cmd+\``) and run:

**For Windows (PowerShell/CMD):**
```bash
python -m venv comiccraft-env
comiccraft-env\Scripts\activate
```

**For macOS / Linux:**
```bash
python3 -m venv comiccraft-env
source comiccraft-env/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
HF_API_KEY="your-huggingface-token-optional"
HOST=127.0.0.1
PORT=8000
```

### 5. Launch Development Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 6. Access Application
- **Web App**: Open your browser at [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 Testing the API Endpoints

### Scenario 1: Generate via Browser Form
1. Open `http://127.0.0.1:8000/`
2. Enter Story Prompt: `"A brave fox exploring an enchanted forest"`
3. Enter Character Name: `"Reynard"`
4. Select Setting: `Enchanted Forest`, Tone: `Dramatic`, Art Style: `Anime`
5. Click **Generate Comic Strip**.

### Scenario 2: Test JSON API (`/generate-comic/json`)
Run using curl or Postman:
```bash
curl -X POST "http://127.0.0.1:8000/generate-comic/json" \
     -H "Content-Type: application/json" \
     -d '{
       "story_prompt": "A brave fox exploring an enchanted forest",
       "character_name": "Reynard",
       "setting": "Enchanted Forest",
       "story_tone": "Dramatic",
       "art_style": "Anime",
       "num_panels": 5
     }'
```

### Scenario 3: Test Image Generation (`/test-image`)
```bash
curl -X POST "http://127.0.0.1:8000/test-image" \
     -H "Content-Type: application/json" \
     -d '{
       "prompt": "Heroic fox glowing in an enchanted forest",
       "art_style": "Anime"
     }'
```
