import React, { useState } from "react";
import {
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  Columns3,
  BookOpen,
  Volume2,
  Edit3,
  Check,
  Eye,
  MessageSquare
} from "lucide-react";
import { ComicLayout, ComicPanel } from "../types/comic.js";
import { soundFX } from "../utils/soundEffects.js";

interface ComicPreviewProps {
  comic: ComicLayout | null;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  onUpdateComic: (updated: ComicLayout) => void;
  onGoToStudio: () => void;
}

export const ComicPreview: React.FC<ComicPreviewProps> = ({
  comic,
  onDownloadPdf,
  isDownloadingPdf,
  onUpdateComic,
  onGoToStudio,
}) => {
  const [viewMode, setViewMode] = useState<"strip" | "grid" | "reader">("strip");
  const [activeReaderIndex, setActiveReaderIndex] = useState<number>(0);
  const [editingPanelNumber, setEditingPanelNumber] = useState<number | null>(null);
  const [editedDialogue, setEditedDialogue] = useState<string>("");
  const [regeneratingPanelNum, setRegeneratingPanelNum] = useState<number | null>(null);

  if (!comic || !comic.panels || comic.panels.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border-4 border-slate-900 rounded-2xl p-10 shadow-[8px_8px_0px_#0f172a] max-w-lg mx-auto">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="font-bangers text-3xl text-slate-900 mb-2">NO COMIC GENERATED YET</h3>
          <p className="font-comic text-slate-600 mb-6 font-bold">
            Head over to the Comic Studio to craft your hero, choose a setting, and generate a 5-panel comic saga!
          </p>
          <button
            onClick={onGoToStudio}
            className="px-6 py-3 bg-amber-400 hover:bg-yellow-400 border-3 border-slate-900 rounded-xl font-bangers text-xl text-slate-950 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            ⚡ OPEN COMIC STUDIO ⚡
          </button>
        </div>
      </div>
    );
  }

  const handleStartEditDialogue = (panel: ComicPanel) => {
    setEditingPanelNumber(panel.panel_number);
    setEditedDialogue(panel.dialogue);
  };

  const handleSaveDialogue = (panelNumber: number) => {
    soundFX.playActionBurst();
    const updatedPanels = comic.panels.map((p) =>
      p.panel_number === panelNumber ? { ...p, dialogue: editedDialogue } : p
    );
    onUpdateComic({ ...comic, panels: updatedPanels });
    setEditingPanelNumber(null);
  };

  const handleRegeneratePanelImage = async (panel: ComicPanel) => {
    setRegeneratingPanelNum(panel.panel_number);
    soundFX.playActionBurst();
    try {
      const res = await fetch("/api/regenerate-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comic_id: comic.id,
          panel_number: panel.panel_number,
          custom_prompt: panel.image_prompt,
          art_style: comic.art_style,
          sound_effect: panel.sound_effect,
          mood_color: panel.mood_color,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comic) {
          onUpdateComic(data.comic);
          soundFX.playSuccessChime();
        }
      }
    } catch (e) {
      console.error("Failed to regenerate panel image:", e);
    } finally {
      setRegeneratingPanelNum(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Comic Header Banner */}
      <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#0f172a] mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block bg-yellow-300 border-2 border-slate-900 px-3 py-0.5 rounded-md font-bangers text-sm text-slate-900 shadow-[2px_2px_0px_#0f172a] mb-2">
              ★ OFFICIAL PREVIEW • {comic.panels.length} PANELS ★
            </div>
            <h2 className="text-3xl sm:text-4xl font-bangers tracking-wide text-red-600 drop-shadow-[2px_2px_0px_#000]">
              {comic.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-comic font-bold text-slate-700">
              <span className="bg-amber-100 px-2.5 py-1 rounded-full border border-slate-900">
                🦊 Hero: {comic.character_name}
              </span>
              <span className="bg-emerald-100 px-2.5 py-1 rounded-full border border-slate-900">
                🌲 Setting: {comic.setting}
              </span>
              <span className="bg-purple-100 px-2.5 py-1 rounded-full border border-slate-900">
                🎭 Tone: {comic.story_tone}
              </span>
              <span className="bg-blue-100 px-2.5 py-1 rounded-full border border-slate-900">
                🎨 Style: {comic.art_style}
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border-2 border-slate-900">
              <button
                onClick={() => {
                  setViewMode("strip");
                  soundFX.playPageTurn();
                }}
                className={`p-2 rounded-lg font-comic font-bold text-xs flex items-center gap-1 transition-all ${
                  viewMode === "strip"
                    ? "bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                    : "text-slate-600 hover:text-slate-950"
                }`}
                title="Continuous Comic Strip"
              >
                <Columns3 className="w-4 h-4" />
                <span className="hidden sm:inline">Strip</span>
              </button>

              <button
                onClick={() => {
                  setViewMode("grid");
                  soundFX.playPageTurn();
                }}
                className={`p-2 rounded-lg font-comic font-bold text-xs flex items-center gap-1 transition-all ${
                  viewMode === "grid"
                    ? "bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                    : "text-slate-600 hover:text-slate-950"
                }`}
                title="Grid Layout"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => {
                  setViewMode("reader");
                  soundFX.playPageTurn();
                }}
                className={`p-2 rounded-lg font-comic font-bold text-xs flex items-center gap-1 transition-all ${
                  viewMode === "reader"
                    ? "bg-amber-400 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                    : "text-slate-600 hover:text-slate-950"
                }`}
                title="Single Page Flip Reader"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Reader</span>
              </button>
            </div>

            {/* Prominent Scenario 3 Download Button */}
            <button
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              className={`px-5 py-3 rounded-xl border-3 border-slate-900 font-bangers text-xl tracking-wider uppercase transition-all flex items-center gap-2 ${
                isDownloadingPdf
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0f172a] active:translate-y-0.5"
              }`}
            >
              {isDownloadingPdf ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>BINDING PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>DOWNLOAD YOUR COMIC AS PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Story prompt quote box */}
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border-2 border-amber-300 text-sm font-comic text-slate-700 italic">
          <span className="font-bold not-italic text-amber-900">Premise: </span>
          "{comic.story_prompt}"
        </div>
      </div>

      {/* ===================== VIEW MODE: SINGLE PAGE READER ===================== */}
      {viewMode === "reader" && (
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] overflow-hidden">
            {/* Header */}
            <div className="bg-amber-300 p-4 border-b-3 border-slate-900 flex items-center justify-between">
              <span className="font-bangers text-2xl text-slate-900">
                {comic.panels[activeReaderIndex].title}
              </span>
              <span className="bg-white px-3 py-1 rounded-full border-2 border-slate-900 font-bangers text-sm">
                PANEL {activeReaderIndex + 1} OF {comic.panels.length}
              </span>
            </div>

            {/* Panel Image */}
            <div className="relative bg-slate-950 aspect-[4/3] flex items-center justify-center border-b-3 border-slate-900 overflow-hidden">
              <img
                src={comic.panels[activeReaderIndex].image_url}
                alt={comic.panels[activeReaderIndex].title}
                className="w-full h-full object-cover"
              />

              {comic.panels[activeReaderIndex].sound_effect && (
                <div
                  onClick={() => soundFX.playActionBurst()}
                  className="absolute top-4 right-4 bg-red-600 text-white font-bangers text-2xl px-4 py-1.5 border-3 border-black shadow-[4px_4px_0px_#000] transform rotate-6 cursor-pointer hover:scale-110 transition-transform"
                >
                  {comic.panels[activeReaderIndex].sound_effect}
                </div>
              )}
            </div>

            {/* Panel Narrative Body */}
            <div className="p-6 space-y-4">
              {/* Scene Description (Italics as required) */}
              <p className="font-comic italic text-slate-700 text-base border-l-4 border-amber-400 pl-3">
                Scene: {comic.panels[activeReaderIndex].scene_description}
              </p>

              {/* Dialogue Bubble */}
              {comic.panels[activeReaderIndex].dialogue && (
                <div className="bg-yellow-50 p-4 rounded-xl border-2 border-slate-900 relative">
                  <div className="font-comic font-bold text-slate-900 text-base flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{comic.panels[activeReaderIndex].dialogue}</span>
                  </div>
                </div>
              )}

              {/* Narration Caption */}
              {comic.panels[activeReaderIndex].caption && (
                <div className="bg-amber-100/70 p-3 rounded-lg border border-amber-300 font-comic text-sm text-slate-800">
                  <span className="font-bold text-amber-900">📜 Narration: </span>
                  {comic.panels[activeReaderIndex].caption}
                </div>
              )}

              {/* Prompt Reference */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 text-xs font-comic text-slate-500">
                <span className="font-bold text-slate-700">Artistic Prompt Reference: </span>
                {comic.panels[activeReaderIndex].image_prompt}
              </div>
            </div>

            {/* Pagination controls */}
            <div className="bg-slate-50 p-4 border-t-3 border-slate-900 flex items-center justify-between">
              <button
                disabled={activeReaderIndex === 0}
                onClick={() => {
                  setActiveReaderIndex((prev) => Math.max(0, prev - 1));
                  soundFX.playPageTurn();
                }}
                className="px-4 py-2 bg-white disabled:opacity-40 border-2 border-slate-900 rounded-lg font-bangers text-lg hover:bg-amber-100 transition-colors"
              >
                ◀ PREVIOUS PANEL
              </button>

              <div className="flex gap-1.5">
                {comic.panels.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveReaderIndex(idx);
                      soundFX.playPageTurn();
                    }}
                    className={`w-8 h-8 rounded-full border-2 border-slate-900 font-bangers text-sm flex items-center justify-center transition-all ${
                      activeReaderIndex === idx ? "bg-amber-400 shadow-[2px_2px_0px_#000]" : "bg-white"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={activeReaderIndex === comic.panels.length - 1}
                onClick={() => {
                  setActiveReaderIndex((prev) => Math.min(comic.panels.length - 1, prev + 1));
                  soundFX.playPageTurn();
                }}
                className="px-4 py-2 bg-white disabled:opacity-40 border-2 border-slate-900 rounded-lg font-bangers text-lg hover:bg-amber-100 transition-colors"
              >
                NEXT PANEL ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW MODE: CONTINUOUS STRIP OR GRID ===================== */}
      {viewMode !== "reader" && (
        <div
          className={`gap-8 ${
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col space-y-8"
          }`}
        >
          {comic.panels.map((panel, idx) => (
            <div
              key={panel.panel_number || idx}
              className="bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] overflow-hidden group hover:shadow-[10px_10px_0px_#0f172a] transition-all"
            >
              {/* Panel Header */}
              <div className="bg-amber-300 p-3 sm:p-4 border-b-3 border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bangers text-xl sm:text-2xl text-slate-900 tracking-wide">
                    {panel.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-3 py-1 rounded-full border-2 border-slate-900 font-bangers text-xs sm:text-sm text-slate-900">
                    PANEL {panel.panel_number} OF {comic.panels.length}
                  </span>
                  <button
                    onClick={() => soundFX.playActionBurst()}
                    title="Play comic sound burst"
                    className="p-1 bg-yellow-100 hover:bg-yellow-200 border-2 border-slate-900 rounded-md transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
              </div>

              {/* Panel Comic Artwork Frame */}
              <div className="relative bg-slate-950 aspect-[4/3] flex items-center justify-center border-b-3 border-slate-900 overflow-hidden">
                <img
                  src={panel.image_url}
                  alt={panel.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Onomatopoeia Sound Burst Badge ("BAM!", "WHOOSH!") */}
                {panel.sound_effect && (
                  <div
                    onClick={() => soundFX.playActionBurst()}
                    className="absolute top-4 right-4 bg-red-600 text-white font-bangers text-xl sm:text-2xl px-3.5 py-1.5 border-3 border-black shadow-[4px_4px_0px_#000] transform rotate-6 hover:rotate-12 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {panel.sound_effect}
                  </div>
                )}

                {/* Regenerate Panel Action Overlay */}
                <button
                  onClick={() => handleRegeneratePanelImage(panel)}
                  disabled={regeneratingPanelNum === panel.panel_number}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-900 text-xs font-comic font-bold px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all"
                  title="Regenerate this panel's illustration"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      regeneratingPanelNum === panel.panel_number ? "animate-spin text-amber-600" : ""
                    }`}
                  />
                  <span>Regenerate Art</span>
                </button>
              </div>

              {/* Panel Content (Scene description, Dialogue, Caption, Prompt Reference) */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* 1. Scene Description in Italics (Exact Milestone 4 requirement) */}
                <div className="border-l-4 border-amber-400 pl-3.5 py-0.5">
                  <p className="font-comic italic text-slate-700 text-sm sm:text-base leading-relaxed">
                    <span className="font-bold not-italic text-amber-900">Scene Description: </span>
                    {panel.scene_description}
                  </p>
                </div>

                {/* 2. Dialogue Balloon */}
                {editingPanelNumber === panel.panel_number ? (
                  <div className="p-3 bg-amber-50 rounded-xl border-2 border-slate-900 space-y-2">
                    <label className="text-xs font-bold font-comic text-slate-700">
                      Edit Character Dialogue:
                    </label>
                    <input
                      type="text"
                      value={editedDialogue}
                      onChange={(e) => setEditedDialogue(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-slate-900 rounded-lg font-comic text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingPanelNumber(null)}
                        className="px-3 py-1 text-xs font-comic font-bold bg-slate-200 rounded border border-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveDialogue(panel.panel_number)}
                        className="px-3 py-1 text-xs font-comic font-bold bg-amber-400 text-slate-950 rounded border border-slate-900 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  panel.dialogue && (
                    <div className="bg-yellow-50/90 p-4 rounded-2xl border-2 border-slate-900 relative shadow-sm group/bubble">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-comic font-bold text-slate-900 text-base leading-snug flex items-start gap-2">
                          <MessageSquare className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>💬 {panel.dialogue}</span>
                        </div>
                        <button
                          onClick={() => handleStartEditDialogue(panel)}
                          className="opacity-0 group-hover/bubble:opacity-100 p-1 text-slate-500 hover:text-slate-900 transition-opacity"
                          title="Edit dialogue"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* 3. Ambient Narration Caption Box */}
                {panel.caption && (
                  <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-300 font-comic text-xs sm:text-sm text-slate-800 leading-normal">
                    <span className="font-bold text-amber-900">📜 Caption & Narration: </span>
                    {panel.caption}
                  </div>
                )}

                {/* 4. Image Prompt Reference (Exact Milestone 4 requirement) */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-300 text-[11px] font-comic text-slate-500">
                  <span className="font-bold text-slate-700">Artistic Prompt Reference: </span>
                  <span className="italic">{panel.image_prompt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Floating Export Bar */}
      <div className="mt-12 p-6 bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h4 className="font-bangers text-2xl text-slate-900">SATISFIED WITH THIS SAGA?</h4>
          <p className="font-comic text-sm text-slate-600 font-bold">
            Compile this full multi-panel strip into a clean, printable PDF with cover & narration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToStudio}
            className="px-5 py-3 rounded-xl border-3 border-slate-900 font-bangers text-lg bg-amber-100 hover:bg-amber-200 text-slate-900 shadow-[3px_3px_0px_#0f172a] transition-all"
          >
            🔄 CREATE ANOTHER
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-6 py-3 rounded-xl border-3 border-slate-900 font-bangers text-xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>DOWNLOAD YOUR COMIC AS PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
