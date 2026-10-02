import React, { useState } from "react";
import { Sparkles, Wand2, Compass, Palette, Film, RefreshCw, Zap, CheckCircle2 } from "lucide-react";
import { ComicLayout, ComicStoryRequest, PresetStory } from "../types/comic.js";
import { soundFX } from "../utils/soundEffects.js";

interface ComicStudioProps {
  onComicGenerated: (comic: ComicLayout) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
  generationStep: string;
  setGenerationStep: (step: string) => void;
}

const SETTINGS = [
  { id: "Enchanted Whispering Forest", label: "Enchanted Forest", icon: "🌲", desc: "Mystical glowing flora and ancient spirits" },
  { id: "Neo-Tokyo Cyberpunk City", label: "Cyberpunk Metropolis", icon: "🏙️", desc: "Rain-drenched neon streets & flying cars" },
  { id: "Ancient Sun Temple Ruins", label: "Ancient Ruins", icon: "🏛️", desc: "Crumbling stone pillars & secret glyphs" },
  { id: "Orbital Deep Space Station", label: "Space Station", icon: "🚀", desc: "Zero-G corridors and nebula vistas" },
  { id: "Vintage Parisian Bakery", label: "Vintage Bakery", icon: "🥐", desc: "Pastry aroma, flour clouds & cartoon fun" },
  { id: "Metropolis Superhero Rooftops", label: "Hero Metropolis", icon: "⚡", desc: "Soaring skyscrapers and lightning clouds" },
];

const TONES = [
  { id: "Dramatic & Epic", label: "Dramatic", icon: "⚔️", desc: "High stakes, tension, heroic destiny" },
  { id: "Funny & Light-hearted", label: "Funny", icon: "😂", desc: "Humorous antics, cartoon slapstick, snappy banter" },
  { id: "Poetic & Mysterious", label: "Poetic", icon: "✨", desc: "Philosophical contemplation, eerie beauty" },
  { id: "Action-Packed", label: "Action-Packed", icon: "💥", desc: "Fast-paced combat, explosions, high speed" },
  { id: "Dark Noir Graphic", label: "Dark Noir", icon: "🕵️", desc: "Deep shadows, grim detective mystery" },
];

const ART_STYLES = [
  { id: "Anime & Manga", label: "Anime / Manga", icon: "🎌", desc: "Expressive eyes, cel shading, speed lines" },
  { id: "Classic Golden Age Comic", label: "Classic Comic", icon: "🦸", desc: "Thick ink lines, bold primary colors, Ben-Day dots" },
  { id: "16-Bit Pixel Art Comic", label: "Pixel Art", icon: "👾", desc: "Retro arcade aesthetic, pixel grid panels" },
  { id: "Dark Graphic Novel", label: "Dark Graphic Novel", icon: "🦇", desc: "High-contrast chiaroscuro, heavy black inks" },
  { id: "Retro Pop Art Halftone", label: "Pop Art", icon: "🟡", desc: "Warhol halftone dots, punchy neon contrast" },
];

const PRESETS: PresetStory[] = [
  {
    title: "Scenario 1: The Brave Fox",
    prompt: "A brave little fox named Reynard exploring an ancient enchanted forest in search of the glowing Sun Stone to save his village.",
    character_name: "Reynard the Fox",
    setting: "Enchanted Whispering Forest",
    tone: "Dramatic & Epic",
    art_style: "Anime & Manga",
    num_panels: 5,
    description: "Personalized dramatic quest through mystical woods with anime aesthetic.",
  },
  {
    title: "Scenario 2: Bakery Mystery",
    prompt: "Barnaby, a comical raccoon detective, attempts to catch a rival pastry thief inside a vintage bakery before the morning rush!",
    character_name: "Detective Barnaby",
    setting: "Vintage Parisian Bakery",
    tone: "Funny & Light-hearted",
    art_style: "Classic Golden Age Comic",
    num_panels: 5,
    description: "Humorous slapstick cartoon feel with classic vintage comic book inks.",
  },
  {
    title: "Neon Courier Run",
    prompt: "A cyborg courier named Kael navigates neon rooftops trying to deliver a rogue AI core while hunted by security drones.",
    character_name: "Kael-09",
    setting: "Neo-Tokyo Cyberpunk City",
    tone: "Action-Packed",
    art_style: "Dark Graphic Novel",
    num_panels: 4,
    description: "High-speed cybernetic rooftop chase with dark gritty visuals.",
  },
];

export const ComicStudio: React.FC<ComicStudioProps> = ({
  onComicGenerated,
  isGenerating,
  setIsGenerating,
  generationStep,
  setGenerationStep,
}) => {
  const [storyPrompt, setStoryPrompt] = useState(
    "A brave fox named Reynard exploring an enchanted glowing forest in search of the ancient Sun Stone."
  );
  const [characterName, setCharacterName] = useState("Reynard");
  const [setting, setSetting] = useState("Enchanted Whispering Forest");
  const [storyTone, setStoryTone] = useState("Dramatic & Epic");
  const [artStyle, setArtStyle] = useState("Anime & Manga");
  const [numPanels, setNumPanels] = useState<number>(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const applyPreset = (preset: PresetStory) => {
    soundFX.playActionBurst();
    setStoryPrompt(preset.prompt);
    setCharacterName(preset.character_name);
    setSetting(preset.setting);
    setStoryTone(preset.tone);
    setArtStyle(preset.art_style);
    setNumPanels(preset.num_panels);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyPrompt.trim()) return;

    soundFX.playActionBurst();
    setIsGenerating(true);
    setErrorMessage(null);

    const payload: ComicStoryRequest = {
      story_prompt: storyPrompt,
      character_name: characterName,
      setting: setting,
      story_tone: storyTone,
      art_style: artStyle,
      num_panels: numPanels,
    };

    try {
      // Step 1: Outline Generation
      setGenerationStep("Milestone 2.1: Calling Gemini Flash to structure panel outline & scene prompts...");
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStep("Milestone 2.1: Expanding narration, speech dialogues, and sound effects...");
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStep("Milestone 2.1: Generating vivid comic illustrations for each panel...");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with HTTP ${response.status}`);
      }

      setGenerationStep("Milestone 2.1: Assembling final comic layout and binding PDF metadata...");
      const data = await response.json();

      if (data.comic) {
        soundFX.playSuccessChime();
        onComicGenerated(data.comic);
      } else {
        throw new Error(data.error || "No comic returned from server");
      }
    } catch (err: any) {
      console.error("Comic generation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred while generating comic.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="text-center mb-8 relative">
        <div className="inline-block bg-yellow-300 border-3 border-slate-900 px-4 py-1 rounded-full font-bangers text-lg tracking-wider text-slate-900 shadow-[3px_3px_0px_#0f172a] mb-3 transform -rotate-1">
          ★ MILESTONE 1 - 4 • AI COMIC ENGINE ★
        </div>
        <h2 className="text-4xl sm:text-5xl font-bangers tracking-wide text-slate-900 drop-shadow-[2px_2px_0px_#fde047]">
          CREATE YOUR CUSTOM COMIC STORY
        </h2>
        <p className="text-slate-600 font-comic text-base sm:text-lg max-w-2xl mx-auto mt-2 font-bold">
          Input your hero, setting, tone, and art style. Google Gemini constructs panel outlines,
          punchy dialogues, sound effects, and vibrant comic art ready for PDF export!
        </p>
      </div>

      {/* Quick Inspiration Presets */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-600" />
          <h3 className="font-bangers text-xl text-slate-800 tracking-wide">
            PROJECT SCENARIOS & INSPIRATION PRESETS:
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left bg-white p-3.5 rounded-xl border-3 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bangers text-base text-red-600 group-hover:text-amber-600 transition-colors">
                  {preset.title}
                </span>
                <span className="bg-amber-100 text-slate-800 text-xs font-bold px-2 py-0.5 rounded border border-slate-900 font-comic">
                  {preset.art_style.split(" ")[0]}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-comic line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Creation Form Card */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 sm:p-8 relative overflow-hidden">
        {/* Halftone decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300"></div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-3 border-red-600 rounded-xl text-red-800 font-comic font-bold text-sm">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Story Prompt */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="font-bangers text-xl text-slate-900 tracking-wide flex items-center gap-2">
                <Film className="w-5 h-5 text-red-600" />
                1. STORY PROMPT
              </span>
              <span className="text-xs font-comic text-slate-500 font-bold">
                Detailed scenario for Gemini AI
              </span>
            </label>
            <textarea
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              rows={3}
              placeholder="Describe your comic story premise, hero's goal, twists, and atmosphere..."
              className="w-full p-3.5 bg-amber-50/50 border-3 border-slate-900 rounded-xl font-comic text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all resize-y shadow-inner"
              required
            />
          </div>

          {/* Character & Panel Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bangers text-xl text-slate-900 tracking-wide mb-2 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                2. MAIN CHARACTER NAME
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="e.g. Reynard, Barnaby, Nova-7"
                className="w-full p-3 bg-amber-50/50 border-3 border-slate-900 rounded-xl font-comic font-bold text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block font-bangers text-xl text-slate-900 tracking-wide mb-2 flex items-center gap-2">
                <Film className="w-5 h-5 text-blue-600" />
                3. PANEL COUNT
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 4, 5].map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => {
                      setNumPanels(count);
                      soundFX.playActionBurst();
                    }}
                    className={`py-3 rounded-xl border-3 border-slate-900 font-bangers text-lg transition-all ${
                      numPanels === count
                        ? "bg-amber-400 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                        : "bg-slate-50 text-slate-700 hover:bg-amber-100"
                    }`}
                  >
                    {count} PANELS
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Setting Selection */}
          <div>
            <label className="block font-bangers text-xl text-slate-900 tracking-wide mb-2 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              4. CHOOSE SETTING
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SETTINGS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setSetting(item.id);
                    soundFX.playActionBurst();
                  }}
                  className={`p-3 rounded-xl border-3 border-slate-900 text-left transition-all ${
                    setting === item.id
                      ? "bg-yellow-200 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                      : "bg-white text-slate-700 hover:bg-amber-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-comic font-bold text-sm text-slate-900 leading-tight">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 font-comic mt-0.5 leading-snug">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Story Tone */}
          <div>
            <label className="block font-bangers text-xl text-slate-900 tracking-wide mb-2 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-600" />
              5. STORY TONE & MOOD
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TONES.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setStoryTone(item.id);
                    soundFX.playActionBurst();
                  }}
                  className={`p-2.5 rounded-xl border-3 border-slate-900 text-center transition-all ${
                    storyTone === item.id
                      ? "bg-amber-300 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                      : "bg-white text-slate-700 hover:bg-amber-50"
                  }`}
                >
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="font-comic font-bold text-xs text-slate-900">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Art Style */}
          <div>
            <label className="block font-bangers text-xl text-slate-900 tracking-wide mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              6. ART STYLE (DIFFUSION & ILLUSTRATION)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {ART_STYLES.map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => {
                    setArtStyle(style.id);
                    soundFX.playActionBurst();
                  }}
                  className={`p-3 rounded-xl border-3 border-slate-900 text-left transition-all ${
                    artStyle === style.id
                      ? "bg-gradient-to-br from-amber-300 to-yellow-200 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                      : "bg-white text-slate-700 hover:bg-amber-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <div className="font-comic font-bold text-sm text-slate-900">{style.label}</div>
                  <div className="text-[11px] text-slate-500 font-comic mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-4 px-6 rounded-xl border-4 border-slate-900 font-bangers text-2xl tracking-wider uppercase transition-all flex items-center justify-center gap-3 ${
                isGenerating
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-400 text-white shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0f172a] active:translate-y-1 active:shadow-[2px_2px_0px_#0f172a]"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin text-slate-700" />
                  <span>CREATING COMIC SAGA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <span>⚡ GENERATE {numPanels}-PANEL COMIC STRIP ⚡</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Generation Progress Card */}
        {isGenerating && (
          <div className="mt-8 p-6 bg-amber-50 border-3 border-slate-900 rounded-xl shadow-[4px_4px_0px_#0f172a] animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-red-600 animate-ping"></div>
              <h4 className="font-bangers text-xl text-slate-900 tracking-wide">
                GENERATION PIPELINE IN ACTION:
              </h4>
            </div>

            <p className="text-sm font-comic font-bold text-amber-900 mb-4 bg-amber-200/80 p-3 rounded-lg border-2 border-amber-400">
              ⏳ {generationStep || "Initializing Gemini 3.8 Model pipeline..."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-comic">
              <div className="p-2.5 bg-white rounded-lg border-2 border-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1. Gemini Flash Outline</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border-2 border-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>2. Dialogue & Narration</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border-2 border-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>3. Comic Art Generator</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border-2 border-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>4. Layout & PDF Binding</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
