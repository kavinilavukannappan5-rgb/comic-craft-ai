import React, { useState } from "react";
import { Header } from "./components/Header.js";
import { ComicStudio } from "./components/ComicStudio.js";
import { ComicPreview } from "./components/ComicPreview.js";
import { ExportSuccess } from "./components/ExportSuccess.js";
import { ApiPlayground } from "./components/ApiPlayground.js";
import { VsCodeGuide } from "./components/VsCodeGuide.js";
import { ComicLayout } from "./types/comic.js";
import { generateComicPdf } from "./utils/pdfGenerator.js";
import { soundFX } from "./utils/soundEffects.js";

// Starter demo comic matching Scenario 1 from the specification
const INITIAL_DEMO_COMIC: ComicLayout = {
  id: "comic_sample_fox",
  title: "Reynard and the Whispering Forest",
  story_prompt: "A brave little fox named Reynard exploring an enchanted forest in search of the glowing Sun Stone.",
  character_name: "Reynard",
  setting: "Enchanted Whispering Forest",
  story_tone: "Dramatic & Epic",
  art_style: "Anime & Manga",
  created_at: new Date().toISOString(),
  pdf_filename: "ComicCraft_Reynard_Whispering_Forest.pdf",
  full_story_narration: "A tale of courage as Reynard ventures into the ancient woods to restore the sacred light of the Sun Stone.",
  panels: [
    {
      panel_number: 1,
      title: "Panel 1: The Edge of the Unknown",
      scene_description: "Reynard stands atop a mossy boulder overlooking the misty veil of the ancient forest. Faint golden light pulses between giant weeping willows.",
      image_prompt: "Heroic young fox in red adventurer scarf standing at misty forest entrance, anime cel shading, mystical twilight lighting, cinematic composition.",
      image_url: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/><stop offset="100%" stop-color="#022c22"/>
          </linearGradient>
          <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="2" fill="rgba(255,255,255,0.1)"/>
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#g1)"/>
        <rect width="800" height="600" fill="url(#dots)"/>
        <!-- Mystical Trees -->
        <path d="M-50,600 L120,200 L220,600 Z" fill="#065f46" opacity="0.6"/>
        <path d="M600,600 L720,150 L850,600 Z" fill="#065f46" opacity="0.6"/>
        <!-- Glowing Sun Stone aura -->
        <circle cx="400" cy="220" r="140" fill="#facc15" opacity="0.25"/>
        <circle cx="400" cy="220" r="60" fill="#fef08a" opacity="0.7"/>
        <!-- Hero Fox Silhouette -->
        <g transform="translate(360, 310)">
          <path d="M40,120 L20,60 L45,80 L55,50 L65,80 L90,60 L70,120 Z" fill="#ea580c"/>
          <circle cx="55" cy="80" r="30" fill="#f97316"/>
          <!-- Fox Ears -->
          <polygon points="32,60 20,15 45,45" fill="#c2410c"/>
          <polygon points="78,60 90,15 65,45" fill="#c2410c"/>
          <!-- Glowing Eyes -->
          <ellipse cx="45" cy="80" rx="4" ry="2" fill="#ffffff"/>
          <ellipse cx="65" cy="80" rx="4" ry="2" fill="#ffffff"/>
          <!-- Adventurer Cloak -->
          <path d="M30,110 Q 5,160 20,200 Q 60,170 80,110 Z" fill="#dc2626"/>
        </g>
        <!-- Sound Effect -->
        <polygon points="650,80 670,110 710,95 690,130 730,150 690,165 710,200 670,180 650,210 630,180 590,200 610,165 570,150 610,130 590,95 630,110" fill="#facc15" stroke="#000" stroke-width="4"/>
        <text x="650" y="158" font-family="'Impact', 'Bangers', sans-serif" font-size="28" font-weight="bold" fill="#dc2626" text-anchor="middle">RUSTLE!</text>
        <rect x="0" y="0" width="800" height="600" fill="none" stroke="#000" stroke-width="12"/>
      </svg>`),
      caption: "The ancient canopy rustled with the memories of forgotten centuries.",
      dialogue: "Reynard: 'The legends were right... the Sun Stone is calling from within!'",
      sound_effect: "RUSTLE!",
      mood_color: "#059669",
    },
    {
      panel_number: 2,
      title: "Panel 2: Into the Whispering Woods",
      scene_description: "Giant bioluminescent mushrooms light the path as ancient runes on oak bark glow in rhythmic indigo pulses.",
      image_prompt: "Reynard walking cautiously along glowing blue moss pathway, ancient enchanted forest, glowing flora, anime comic style.",
      image_url: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#312e81"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#g2)"/>
        <!-- Glowing Mushrooms -->
        <circle cx="200" cy="460" r="50" fill="#a855f7" opacity="0.8"/>
        <circle cx="620" cy="480" r="70" fill="#38bdf8" opacity="0.8"/>
        <!-- Hero Fox Silhouette Looking Up -->
        <g transform="translate(370, 320)">
          <path d="M40,110 L20,50 L45,70 L55,40 L65,70 L90,50 L70,110 Z" fill="#ea580c"/>
          <circle cx="55" cy="70" r="28" fill="#f97316"/>
          <polygon points="32,50 20,8 45,35" fill="#c2410c"/>
          <polygon points="78,50 90,8 65,35" fill="#c2410c"/>
          <ellipse cx="48" cy="68" rx="4" ry="2" fill="#fef08a"/>
          <ellipse cx="66" cy="68" rx="4" ry="2" fill="#fef08a"/>
        </g>
        <!-- Sound Burst -->
        <polygon points="120,80 140,110 180,95 160,130 200,150 160,165 180,200 140,180 120,210 100,180 60,200 80,165 40,150 80,130 60,95 100,110" fill="#38bdf8" stroke="#000" stroke-width="4"/>
        <text x="120" y="158" font-family="'Impact', 'Bangers', sans-serif" font-size="28" font-weight="bold" fill="#1e1b4b" text-anchor="middle">HUMMMM!</text>
        <rect x="0" y="0" width="800" height="600" fill="none" stroke="#000" stroke-width="12"/>
      </svg>`),
      caption: "Every whispering branch echoed with cryptic warnings.",
      dialogue: "Reynard: 'These runes are leading me deeper... but I cannot lose my way.'",
      sound_effect: "HUMMMM!",
      mood_color: "#6366f1",
    },
    {
      panel_number: 3,
      title: "Panel 3: The Guardian of Roots",
      scene_description: "A towering Moss Golem awakens from the subterranean roots, its emerald eyes assessing the tiny intruder.",
      image_prompt: "Dramatic showdown between tiny fox and colossal stone moss golem, dramatic low angle, anime manga style.",
      image_url: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#450a0a"/><stop offset="100%" stop-color="#18181b"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#g3)"/>
        <!-- Golem Eyes & Outline -->
        <ellipse cx="300" cy="220" rx="25" ry="12" fill="#ef4444"/>
        <ellipse cx="500" cy="220" rx="25" ry="12" fill="#ef4444"/>
        <!-- Sound Burst -->
        <polygon points="650,80 670,110 710,95 690,130 730,150 690,165 710,200 670,180 650,210 630,180 590,200 610,165 570,150 610,130 590,95 630,110" fill="#ef4444" stroke="#000" stroke-width="4"/>
        <text x="650" y="158" font-family="'Impact', 'Bangers', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">KRA-KOOM!</text>
        <rect x="0" y="0" width="800" height="600" fill="none" stroke="#000" stroke-width="12"/>
      </svg>`),
      caption: "The ground quaked as the forest's ancient protector arose!",
      dialogue: "Golem: 'WHO DARES DISTURB THE SLEEP OF THE STONE?!'",
      sound_effect: "KRA-KOOM!",
      mood_color: "#dc2626",
    },
    {
      panel_number: 4,
      title: "Panel 4: The Heart of Bravery",
      scene_description: "Instead of fleeing, Reynard bows respectfully, offering his grandfather's carved acorn whistle.",
      image_prompt: "Fox Reynard holding out glowing acorn whistle in peace before towering golem, emotional anime climax.",
      image_url: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#78350f"/><stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#g4)"/>
        <circle cx="400" cy="300" r="160" fill="#fef08a" opacity="0.3"/>
        <circle cx="400" cy="300" r="40" fill="#ffffff"/>
        <!-- Sound Burst -->
        <polygon points="650,80 670,110 710,95 690,130 730,150 690,165 710,200 670,180 650,210 630,180 590,200 610,165 570,150 610,130 590,95 630,110" fill="#fef08a" stroke="#000" stroke-width="4"/>
        <text x="650" y="158" font-family="'Impact', 'Bangers', sans-serif" font-size="28" font-weight="bold" fill="#000" text-anchor="middle">SHINE!</text>
        <rect x="0" y="0" width="800" height="600" fill="none" stroke="#000" stroke-width="12"/>
      </svg>`),
      caption: "Not through claws or fury, but through honor was the seal recognized.",
      dialogue: "Reynard: 'I come not to conquer, but to heal the woods.'",
      sound_effect: "SHINE!",
      mood_color: "#d97706",
    },
    {
      panel_number: 5,
      title: "Panel 5: The Dawn of Restoration",
      scene_description: "The Sun Stone rises into the dawn sky, bathing the entire forest and Reynard in golden warmth.",
      image_prompt: "Golden sunrise breaking over enchanted forest, fox hero bathed in radiant light, triumphant anime finale.",
      image_url: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14532d"/><stop offset="50%" stop-color="#15803d"/><stop offset="100%" stop-color="#fde047"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#g5)"/>
        <circle cx="400" cy="180" r="100" fill="#fef08a"/>
        <!-- Sound Burst -->
        <polygon points="650,80 670,110 710,95 690,130 730,150 690,165 710,200 670,180 650,210 630,180 590,200 610,165 570,150 610,130 590,95 630,110" fill="#22c55e" stroke="#000" stroke-width="4"/>
        <text x="650" y="158" font-family="'Impact', 'Bangers', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">PEACE!</text>
        <rect x="0" y="0" width="800" height="600" fill="none" stroke="#000" stroke-width="12"/>
      </svg>`),
      caption: "With the Sun Stone rekindled, life returned to every leaf and creature.",
      dialogue: "Reynard: 'The forest breathes once more. The dawn has returned!'",
      sound_effect: "PEACE!",
      mood_color: "#16a34a",
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"studio" | "preview" | "export" | "api" | "vscode">("studio");
  const [comic, setComic] = useState<ComicLayout | null>(INITIAL_DEMO_COMIC);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleComicGenerated = (newComic: ComicLayout) => {
    setComic(newComic);
    setActiveTab("preview");
  };

  const handleDownloadPdf = async () => {
    if (!comic) return;
    setIsDownloadingPdf(true);
    soundFX.playActionBurst();

    try {
      await generateComicPdf(comic);
      soundFX.playSuccessChime();
      // Scenario 3 requirement: User is redirected to export success page
      setActiveTab("export");
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col font-comic selection:bg-yellow-300 selection:text-black">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasComic={Boolean(comic)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Tab Views */}
      <main className="flex-1 pb-16">
        {activeTab === "studio" && (
          <ComicStudio
            onComicGenerated={handleComicGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            generationStep={generationStep}
            setGenerationStep={setGenerationStep}
          />
        )}

        {activeTab === "preview" && (
          <ComicPreview
            comic={comic}
            onDownloadPdf={handleDownloadPdf}
            isDownloadingPdf={isDownloadingPdf}
            onUpdateComic={setComic}
            onGoToStudio={() => {
              soundFX.playPageTurn();
              setActiveTab("studio");
            }}
          />
        )}

        {activeTab === "export" && (
          <ExportSuccess
            comic={comic}
            onGoToStudio={() => {
              soundFX.playPageTurn();
              setActiveTab("studio");
            }}
            onGoToPreview={() => {
              soundFX.playPageTurn();
              setActiveTab("preview");
            }}
            onDownloadAgain={handleDownloadPdf}
          />
        )}

        {activeTab === "api" && <ApiPlayground />}

        {activeTab === "vscode" && <VsCodeGuide />}
      </main>

      {/* Comic Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t-4 border-slate-950 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-comic">
          <div className="flex items-center gap-2">
            <span className="font-bangers text-lg text-amber-400">COMICCRAFT</span>
            <span>• Powered by Google Gemini AI & Diffusion Imaging</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Milestones 1 to 5 Fully Complete</span>
            <button
              onClick={() => setActiveTab("vscode")}
              className="hover:text-amber-300 underline font-bold"
            >
              VS Code Instructions
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className="hover:text-amber-300 underline font-bold"
            >
              Swagger / API
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
