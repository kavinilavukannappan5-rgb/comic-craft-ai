import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Download, ArrowLeft, BookOpen, Share2, Sparkles } from "lucide-react";
import { ComicLayout } from "../types/comic.js";
import { soundFX } from "../utils/soundEffects.js";

interface ExportSuccessProps {
  comic: ComicLayout | null;
  onGoToStudio: () => void;
  onGoToPreview: () => void;
  onDownloadAgain: () => void;
}

export const ExportSuccess: React.FC<ExportSuccessProps> = ({
  comic,
  onGoToStudio,
  onGoToPreview,
  onDownloadAgain,
}) => {
  useEffect(() => {
    soundFX.playSuccessChime();

    // Trigger celebratory comic confetti blast
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#dc2626", "#f59e0b", "#10b981", "#3b82f6", "#facc15"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white border-4 border-slate-900 rounded-3xl p-8 sm:p-12 shadow-[12px_12px_0px_#0f172a] text-center relative overflow-hidden">
        {/* Halftone Top Border */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-300"></div>

        {/* Celebration Trophy Badge */}
        <div className="w-20 h-20 mx-auto bg-emerald-100 border-4 border-slate-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_#0f172a] mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>

        {/* Headline */}
        <div className="inline-block bg-yellow-300 border-2 border-slate-900 px-3 py-1 rounded-md font-bangers text-base tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] mb-3">
          ★ EXPORT COMPLETE • ISSUE READY ★
        </div>
        <h2 className="text-4xl sm:text-5xl font-bangers tracking-wider text-emerald-700 drop-shadow-[2px_2px_0px_#000] mb-3">
          COMIC EXPORTED SUCCESSFULLY!
        </h2>
        <p className="font-comic text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-bold mb-8">
          Your multi-panel AI comic strip has been assembled, bound into a professional layout,
          and downloaded to your device as a printable PDF.
        </p>

        {/* Comic Summary Card */}
        {comic && (
          <div className="bg-amber-50/70 border-3 border-slate-900 rounded-2xl p-5 mb-8 text-left max-w-lg mx-auto shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bangers text-lg text-slate-900">
                {comic.title}
              </span>
              <span className="bg-yellow-200 border border-slate-900 px-2 py-0.5 rounded font-comic text-xs font-bold">
                {comic.panels.length} Panels
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-comic text-slate-700">
              <div>
                <span className="font-bold">Hero:</span> {comic.character_name}
              </div>
              <div>
                <span className="font-bold">Style:</span> {comic.art_style}
              </div>
              <div>
                <span className="font-bold">Setting:</span> {comic.setting}
              </div>
              <div>
                <span className="font-bold">Tone:</span> {comic.story_tone}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] font-comic text-slate-500">
              File: <span className="font-mono font-bold text-slate-700">{comic.pdf_filename || "ComicCraft_Story.pdf"}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              soundFX.playActionBurst();
              onDownloadAgain();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white border-3 border-slate-900 rounded-xl font-bangers text-xl shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>DOWNLOAD PDF AGAIN</span>
          </button>

          <button
            onClick={() => {
              soundFX.playPageTurn();
              onGoToPreview();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border-3 border-slate-900 rounded-xl font-bangers text-xl shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>RETURN TO PREVIEW</span>
          </button>

          <button
            onClick={() => {
              soundFX.playActionBurst();
              onGoToStudio();
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-yellow-300 text-slate-950 border-3 border-slate-900 rounded-xl font-bangers text-xl shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-red-600" />
            <span>GO CREATE ANOTHER COMIC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
