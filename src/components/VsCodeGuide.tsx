import React, { useState } from "react";
import { Code2, Terminal, FolderTree, Copy, Check, ExternalLink, Cpu, Play } from "lucide-react";
import { soundFX } from "../utils/soundEffects.js";

export const VsCodeGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    soundFX.playActionBurst();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: "1. Open in VS Code",
      description: "Clone or download the project and open the root folder in VS Code:",
      code: "code comiccraft",
    },
    {
      title: "2. Create and Activate Virtual Environment",
      description: "Isolate dependencies with a dedicated Python virtual environment:",
      code: `# For Windows (PowerShell):
python -m venv comiccraft-env
comiccraft-env\\Scripts\\activate

# For macOS / Linux:
python3 -m venv comiccraft-env
source comiccraft-env/bin/activate`,
    },
    {
      title: "3. Install Required Dependencies",
      description: "Install all libraries from requirements.txt (FastAPI, Uvicorn, Gemini GenAI, FPDF2, Pillow):",
      code: "pip install -r python_backend/requirements.txt",
    },
    {
      title: "4. Configure Environment Variables (.env)",
      description: "Create your .env file with your Google Gemini API key:",
      code: `GEMINI_API_KEY="your_gemini_api_key_here"
HF_API_KEY="optional_huggingface_key"
HOST=127.0.0.1
PORT=8000`,
    },
    {
      title: "5. Launch FastAPI Backend with Uvicorn",
      description: "Start the Uvicorn ASGI server with live hot-reloading:",
      code: "cd python_backend && uvicorn app.main:app --reload --port 8000",
    },
    {
      title: "6. Test in Browser and Swagger Docs",
      description: "Access the dynamic Jinja2 web application and interactive OpenAPI documentation:",
      code: `# Web App:
http://127.0.0.1:8000

# Interactive Swagger Documentation:
http://127.0.0.1:8000/docs`,
    },
  ];

  const directoryTree = `comiccraft/
├── python_backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app initialization & static mounts
│   │   ├── routes.py            # Route handlers: /, /generate, /generate-comic/json, /test-image
│   │   ├── gemini_flash.py      # Milestone 2.1: generate_outline() using Gemini Flash
│   │   ├── gemini_pro.py        # Milestone 2.1: generate_story() narration & dialogue
│   │   ├── image_generator.py   # Milestone 2.1: generate_image() comic panel creator
│   │   ├── layout_builder.py    # Milestone 2.1: build_comic_layout() sequence binder
│   │   └── exporters.py         # Milestone 2.1: save_pdf() FPDF multi-page compiler
│   ├── templates/
│   │   ├── index.html           # Milestone 4.1: Comic prompt & preferences form
│   │   ├── comic_preview.html   # Milestone 4.1: Sequential panel-by-panel viewer
│   │   └── export_success.html  # Milestone 4.1: PDF download confirmation page
│   ├── requirements.txt         # FastAPI, Uvicorn, google-genai, FPDF2, Pillow
│   └── README.md                # Full deployment & testing documentation
├── server.ts                    # Full-stack Express + Vite + Gemini backend
├── src/                         # Full React + Tailwind frontend with real-time studio
└── package.json`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block bg-yellow-300 border-2 border-slate-900 px-3 py-1 rounded-md font-bangers text-base tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] mb-2">
          ★ MILESTONE 5: LOCAL DEPLOYMENT & TESTING INSTRUCTIONS ★
        </div>
        <h2 className="text-4xl font-bangers tracking-wide text-slate-900">
          VS CODE SETUP & RUNNING INSTRUCTIONS
        </h2>
        <p className="font-comic text-slate-600 font-bold text-base max-w-2xl mx-auto">
          Complete step-by-step instructions to set up, install, run, and test ComicCraft locally
          with Python FastAPI and Google Gemini models.
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-6 mb-12">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a]"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bangers text-2xl text-slate-900 tracking-wide">
                {step.title}
              </h3>
              <button
                onClick={() => copyToClipboard(step.code, idx)}
                className="text-xs font-comic font-bold px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-700" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>

            <p className="font-comic text-sm text-slate-600 mb-3 font-bold">
              {step.description}
            </p>

            <div className="bg-slate-900 rounded-xl p-3.5 overflow-x-auto border-2 border-slate-900">
              <pre className="font-mono text-xs text-amber-300 whitespace-pre">
                {step.code}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Project Structure Breakdown */}
      <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#0f172a] mb-12">
        <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-900 pb-3">
          <FolderTree className="w-6 h-6 text-amber-600" />
          <h3 className="font-bangers text-2xl text-slate-900 tracking-wide">
            PROJECT ARCHITECTURE & FILE TREE
          </h3>
        </div>

        <p className="font-comic text-sm text-slate-600 mb-4 font-bold">
          All milestones from the specification (gemini_flash, gemini_pro, image_generator, layout_builder, exporters, routes) are fully built and generated in the codebase:
        </p>

        <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border-2 border-slate-900">
          <pre className="font-mono text-xs text-emerald-400 whitespace-pre">
            {directoryTree}
          </pre>
        </div>
      </div>

      {/* Testing Scenarios Guide */}
      <div className="bg-amber-50 border-4 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#0f172a]">
        <h3 className="font-bangers text-2xl text-slate-900 tracking-wide mb-4">
          🧪 VERIFYING THE 3 SPECIFICATION SCENARIOS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border-2 border-slate-900">
            <span className="font-bangers text-lg text-red-600 block mb-1">
              SCENARIO 1: ADVENTURE SAGA
            </span>
            <p className="text-xs font-comic text-slate-600">
              Prompt: "A brave fox exploring an enchanted forest". Hero: Reynard. Tone: Dramatic. Style: Anime.
              Verifies Gemini Flash 5-panel outline & diffusion panel rendering.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-slate-900">
            <span className="font-bangers text-lg text-blue-600 block mb-1">
              SCENARIO 2: LIGHT-HEARTED CARTOON
            </span>
            <p className="text-xs font-comic text-slate-600">
              Tone: Funny. Style: Classic Comic Book. Rerun generation.
              Verifies instructions adjust for humorous dialogue & retro Ben-Day halftones.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-slate-900">
            <span className="font-bangers text-lg text-emerald-600 block mb-1">
              SCENARIO 3: PDF EXPORT FLOW
            </span>
            <p className="text-xs font-comic text-slate-600">
              Click "Download Your Comic as PDF". Verifies layout binding, FPDF multi-page assembly with timestamped filename, and redirect to Export Success page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
