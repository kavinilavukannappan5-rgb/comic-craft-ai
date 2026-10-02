import React, { useState } from "react";
import { Terminal, Play, Image as ImageIcon, CheckCircle, RefreshCw, Copy, Check } from "lucide-react";
import { soundFX } from "../utils/soundEffects.js";

export const ApiPlayground: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<"comic_json" | "test_image">("comic_json");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [testImageUrl, setTestImageUrl] = useState<string | null>(null);

  // Form states for test-image
  const [imagePrompt, setImagePrompt] = useState(
    "A brave red fox wearing a heroic cloak in an enchanted glowing forest with mystical sunbeams"
  );
  const [imageArtStyle, setImageArtStyle] = useState("Anime & Manga");

  // Form states for comic json
  const [comicJsonPayload, setComicJsonPayload] = useState(
    JSON.stringify(
      {
        story_prompt: "A brave fox exploring an enchanted forest in search of the glowing Sun Stone.",
        character_name: "Reynard",
        setting: "Enchanted Whispering Forest",
        story_tone: "Dramatic",
        art_style: "Anime",
        num_panels: 3,
      },
      null,
      2
    )
  );

  const handleTestImage = async () => {
    soundFX.playActionBurst();
    setLoading(true);
    setResponseJson(null);
    setTestImageUrl(null);

    try {
      const res = await fetch("/api/test-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          art_style: imageArtStyle,
          title: "API Test Panel",
        }),
      });
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
      if (data.image_url) {
        setTestImageUrl(data.image_url);
        soundFX.playSuccessChime();
      }
    } catch (e: any) {
      setResponseJson(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleTestComicJson = async () => {
    soundFX.playActionBurst();
    setLoading(true);
    setResponseJson(null);

    try {
      const parsed = JSON.parse(comicJsonPayload);
      const res = await fetch("/api/generate-comic/json", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
      soundFX.playSuccessChime();
    } catch (e: any) {
      setResponseJson(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block bg-yellow-300 border-2 border-slate-900 px-3 py-1 rounded-md font-bangers text-base tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] mb-2">
          ★ MILESTONE 3: ROUTES.PY & FASTAPI API SPECIFICATION ★
        </div>
        <h2 className="text-4xl font-bangers tracking-wide text-slate-900">
          DEVELOPER API PLAYGROUND
        </h2>
        <p className="font-comic text-slate-600 font-bold text-base max-w-xl mx-auto">
          Test the exact backend endpoints specified in the ComicCraft architecture document:
          <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded ml-1">/generate-comic/json</code> and
          <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded ml-1">/test-image</code>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setActiveEndpoint("comic_json");
            soundFX.playPageTurn();
          }}
          className={`px-5 py-2.5 rounded-xl border-3 border-slate-900 font-bangers text-lg transition-all ${
            activeEndpoint === "comic_json"
              ? "bg-amber-400 text-slate-950 shadow-[4px_4px_0px_#0f172a] -translate-y-0.5"
              : "bg-white text-slate-700 hover:bg-amber-50"
          }`}
        >
          POST /generate-comic/json
        </button>

        <button
          onClick={() => {
            setActiveEndpoint("test_image");
            soundFX.playPageTurn();
          }}
          className={`px-5 py-2.5 rounded-xl border-3 border-slate-900 font-bangers text-lg transition-all ${
            activeEndpoint === "test_image"
              ? "bg-amber-400 text-slate-950 shadow-[4px_4px_0px_#0f172a] -translate-y-0.5"
              : "bg-white text-slate-700 hover:bg-amber-50"
          }`}
        >
          POST /test-image
        </button>
      </div>

      {/* Endpoint Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a]">
          <div className="flex items-center justify-between mb-4 border-b-2 border-slate-900 pb-3">
            <span className="font-bangers text-xl text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-600" />
              REQUEST PAYLOAD
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded border border-emerald-400 font-mono">
              POST
            </span>
          </div>

          {activeEndpoint === "comic_json" ? (
            <div className="space-y-4">
              <p className="text-xs font-comic text-slate-600 font-bold">
                Edit the raw JSON payload to simulate automated API client requests:
              </p>
              <textarea
                value={comicJsonPayload}
                onChange={(e) => setComicJsonPayload(e.target.value)}
                rows={12}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-amber-300 rounded-xl border-2 border-slate-900 focus:outline-none"
              />
              <button
                onClick={handleTestComicJson}
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bangers text-xl rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>SEND TO /generate-comic/json</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-comic font-bold text-slate-700 mb-1">
                  Image Prompt:
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 font-comic text-sm border-2 border-slate-900 rounded-xl bg-amber-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-comic font-bold text-slate-700 mb-1">
                  Art Style:
                </label>
                <select
                  value={imageArtStyle}
                  onChange={(e) => setImageArtStyle(e.target.value)}
                  className="w-full p-2.5 font-comic text-sm border-2 border-slate-900 rounded-xl bg-amber-50/50"
                >
                  <option value="Anime & Manga">Anime & Manga</option>
                  <option value="Classic Golden Age Comic">Classic Golden Age Comic</option>
                  <option value="16-Bit Pixel Art Comic">16-Bit Pixel Art Comic</option>
                  <option value="Dark Graphic Novel">Dark Graphic Novel</option>
                  <option value="Retro Pop Art Halftone">Retro Pop Art Halftone</option>
                </select>
              </div>

              <button
                onClick={handleTestImage}
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bangers text-xl rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#0f172a] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
                <span>TEST /test-image GENERATOR</span>
              </button>
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b-2 border-slate-900 pb-3">
            <span className="font-bangers text-xl text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              API RESPONSE
            </span>
            {responseJson && (
              <button
                onClick={() => handleCopy(responseJson)}
                className="text-xs font-comic font-bold flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy JSON"}</span>
              </button>
            )}
          </div>

          {/* Test Image preview if available */}
          {testImageUrl && (
            <div className="mb-4 bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-900 p-2 text-center">
              <img
                src={testImageUrl}
                alt="Test image output"
                className="max-h-56 mx-auto rounded-lg object-contain"
              />
            </div>
          )}

          {/* Response JSON viewer */}
          <div className="flex-1 bg-slate-900 p-4 rounded-xl border-2 border-slate-900 overflow-auto max-h-[380px]">
            {loading ? (
              <div className="text-center py-16 text-amber-300 font-comic flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Processing AI Pipeline request...</span>
              </div>
            ) : responseJson ? (
              <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                {responseJson}
              </pre>
            ) : (
              <div className="text-center py-16 text-slate-500 font-comic text-xs">
                Send a request to see the live server response payload here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
