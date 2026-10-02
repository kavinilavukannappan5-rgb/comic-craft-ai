import React from "react";
import { Sparkles, BookOpen, Download, Terminal, Code2, Volume2, VolumeX } from "lucide-react";
import { soundFX } from "../utils/soundEffects.js";

interface HeaderProps {
  activeTab: "studio" | "preview" | "export" | "api" | "vscode";
  setActiveTab: (tab: "studio" | "preview" | "export" | "api" | "vscode") => void;
  hasComic: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasComic,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playActionBurst();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 p-2.5 rounded-xl border-3 border-slate-900 shadow-[3px_3px_0px_#0f172a] transform -rotate-2">
            <Sparkles className="w-7 h-7 text-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-bangers tracking-wider text-red-600 drop-shadow-[2px_2px_0px_#000]">
                COMICCRAFT
              </h1>
              <span className="bg-yellow-300 text-slate-950 font-bold text-xs uppercase px-2 py-0.5 rounded-md border-2 border-slate-900 font-comic">
                AI ISSUE #1
              </span>
            </div>
            <p className="text-xs text-slate-600 font-comic font-bold tracking-tight">
              Personalized Comic Story & Illustration Creator • Gemini 3.8
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveTab("studio");
              soundFX.playPageTurn();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-comic font-bold text-sm transition-all border-2 border-slate-900 ${
              activeTab === "studio"
                ? "bg-amber-400 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                : "bg-white text-slate-700 hover:bg-amber-50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Comic Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("preview");
              soundFX.playPageTurn();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-comic font-bold text-sm transition-all border-2 border-slate-900 ${
              activeTab === "preview"
                ? "bg-amber-400 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                : "bg-white text-slate-700 hover:bg-amber-50"
            } ${!hasComic ? "opacity-60" : ""}`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Comic Preview</span>
            {hasComic && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-0.5"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("export");
              soundFX.playPageTurn();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-comic font-bold text-sm transition-all border-2 border-slate-900 ${
              activeTab === "export"
                ? "bg-amber-400 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                : "bg-white text-slate-700 hover:bg-amber-50"
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>PDF Export</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("api");
              soundFX.playPageTurn();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-comic font-bold text-sm transition-all border-2 border-slate-900 ${
              activeTab === "api"
                ? "bg-amber-400 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                : "bg-white text-slate-700 hover:bg-amber-50"
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-600" />
            <span>API Playground</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("vscode");
              soundFX.playPageTurn();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-comic font-bold text-sm transition-all border-2 border-slate-900 ${
              activeTab === "vscode"
                ? "bg-amber-400 text-slate-950 shadow-[3px_3px_0px_#0f172a] -translate-y-0.5"
                : "bg-white text-slate-700 hover:bg-amber-50"
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>VS Code Guide</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute comic sound effects" : "Enable comic sound effects"}
            className="p-2 rounded-lg border-2 border-slate-900 bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-slate-900" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
