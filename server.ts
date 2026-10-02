import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { generateOutline, generateComicImage } from "./server/geminiService.js";
import { buildComicLayout } from "./server/layoutBuilder.js";
import { ComicLayout, ComicStoryRequest } from "./src/types/comic.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// In-memory store for generated comics to serve PDF / export routes
const comicStore = new Map<string, ComicLayout>();

// Middleware to parse URL-encoded form data and JSON payloads
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(express.json({ limit: "15mb" }));

// Static directory for uploaded/generated assets
app.use("/static", express.static(path.join(__dirname, "public")));

/**
 * Pre-defined creative scenarios & presets for instant user inspiration
 */
const PRESETS = [
  {
    title: "The Brave Fox & Enchanted Forest",
    prompt: "A brave little fox named Reynard ventures deep into an ancient, whispering glowing enchanted forest to retrieve the lost Sun Stone.",
    character_name: "Reynard",
    setting: "Enchanted Whispering Forest",
    tone: "Dramatic & Mystical",
    art_style: "Anime & Manga",
    num_panels: 5,
    description: "Scenario 1 from project brief: A brave fox exploring an enchanted forest with vivid anime comic aesthetics.",
  },
  {
    title: "Barnaby's Bumbling Bakery Heist",
    prompt: "A mischievous detective raccoon tries to prevent a rival pastry chef from stealing the top-secret golden croissant recipe.",
    character_name: "Detective Barnaby",
    setting: "Vintage Parisian Bakery",
    tone: "Funny & Light-hearted",
    art_style: "Classic Golden Age Comic",
    num_panels: 5,
    description: "Scenario 2 from project brief: Light-hearted, funny cartoon feel with retro comic book ink and Ben-Day halftones.",
  },
  {
    title: "Neon Cyberpunk Delivery Heist",
    prompt: "In a rain-drenched neon metropolis, an android courier discovers their courier package contains the AI key to the city's power grid.",
    character_name: "Nova-7",
    setting: "Neo-Shinjuku Cyberpunk City",
    tone: "Action-Packed Noir",
    art_style: "Dark Graphic Novel",
    num_panels: 5,
    description: "High-contrast shadows, neon reflections, and high-speed hoverbike chases.",
  },
  {
    title: "Starlight Academy: The Zero-G Trial",
    prompt: "An eager cadet astronaut accidentally activates an ancient cosmic anomaly during an exam in orbit around Jupiter.",
    character_name: "Cadet Maya",
    setting: "Orbital Space Station",
    tone: "Epic Sci-Fi Adventure",
    art_style: "16-Bit Pixel Art Comic",
    num_panels: 4,
    description: "Retro pixel art comic panels with starry nebulas and retro gaming sound effects.",
  },
];

app.get("/api/presets", (_req: Request, res: Response) => {
  res.json({ presets: PRESETS });
});

/**
 * Milestone 3 - Activity 3.1: Core routes in routes.py
 *
 * Route: POST /generate and POST /api/generate
 * Handles form submissions or JSON requests, executes the complete AI pipeline:
 * 1. generate_outline() using Gemini Flash
 * 2. generate_story() (integrated narrative & dialogue)
 * 3. generate_image() for each panel
 * 4. build_comic_layout() to bind titles, illustrations, dialogues, and sound effects
 */
async function handleGenerate(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const storyRequest: ComicStoryRequest = {
      story_prompt: body.story_prompt || body.prompt || "A hero sets forth on a daring quest across mythical lands.",
      character_name: body.character_name || "Hero",
      setting: body.setting || "Ancient Forest",
      story_tone: body.story_tone || body.tone || "Dramatic",
      art_style: body.art_style || "Comic Book",
      num_panels: Number(body.num_panels) || 5,
    };

    console.log(`[ComicCraft] Starting comic generation for "${storyRequest.character_name}" in "${storyRequest.setting}" (${storyRequest.art_style})...`);

    // 1. Generate outline with Gemini Flash
    const storyData = await generateOutline(storyRequest);
    console.log(`[ComicCraft] Generated outline with ${storyData.outline.length} panels for "${storyData.comic_title}"`);

    // 2. Generate illustrations for each panel
    const panelImages: string[] = [];
    for (const panel of storyData.outline) {
      console.log(`[ComicCraft] Generating image for panel ${panel.panel_number}: ${panel.title}`);
      const imageUrl = await generateComicImage(
        panel.image_prompt,
        storyRequest.art_style,
        panel.title,
        panel.mood_color,
        panel.sound_effect
      );
      panelImages.push(imageUrl);
    }

    // 3. Assemble complete comic layout
    const layout = buildComicLayout(storyRequest, storyData, panelImages);
    comicStore.set(layout.id, layout);

    // If client requested JSON response or accepts JSON
    if (req.headers.accept?.includes("application/json") || req.path.includes("/api/") || req.path.includes("/json")) {
      return res.json({
        success: true,
        comic: layout,
        pdf_url: layout.pdf_url,
        message: "Comic created successfully!",
      });
    }

    // Form submission redirect to preview with comic ID
    return res.redirect(`/comic-preview?id=${layout.id}`);
  } catch (error: any) {
    console.error("[ComicCraft] Error during generation:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate comic",
    });
  }
}

app.post("/generate", handleGenerate);
app.post("/api/generate", handleGenerate);

/**
 * Route: POST /generate-comic/json and /api/generate-comic/json
 * Exact endpoint matching Milestone 3 specification for API clients and automated tests.
 */
app.post("/generate-comic/json", handleGenerate);
app.post("/api/generate-comic/json", handleGenerate);

/**
 * Route: POST /test-image and /api/test-image
 * Dedicated developer utility route to test image generation from direct prompt.
 */
app.post("/test-image", async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt || req.body.image_prompt || "A heroic fox in an enchanted glowing forest";
    const artStyle = req.body.art_style || "Comic Book";
    const title = req.body.title || "Test Comic Panel";

    const imageUrl = await generateComicImage(prompt, artStyle, title);
    res.json({
      success: true,
      image_prompt: prompt,
      art_style: artStyle,
      image_url: imageUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/test-image", async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt || req.body.image_prompt || "A heroic fox in an enchanted glowing forest";
    const artStyle = req.body.art_style || "Comic Book";
    const title = req.body.title || "Test Comic Panel";

    const imageUrl = await generateComicImage(prompt, artStyle, title);
    res.json({
      success: true,
      image_prompt: prompt,
      art_style: artStyle,
      image_url: imageUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Route: POST /api/regenerate-panel
 * Allows users to regenerate or update an individual panel's artwork or dialogue
 */
app.post("/api/regenerate-panel", async (req: Request, res: Response) => {
  try {
    const { comic_id, panel_number, custom_prompt, art_style, sound_effect, mood_color } = req.body;
    const comic = comicStore.get(comic_id);

    if (!comic) {
      return res.status(404).json({ success: false, error: "Comic not found" });
    }

    const panelIndex = comic.panels.findIndex((p) => p.panel_number === Number(panel_number));
    if (panelIndex === -1) {
      return res.status(404).json({ success: false, error: "Panel not found" });
    }

    const panel = comic.panels[panelIndex];
    const promptToUse = custom_prompt || panel.image_prompt;
    const styleToUse = art_style || comic.art_style;

    const newImageUrl = await generateComicImage(
      promptToUse,
      styleToUse,
      panel.title,
      mood_color || panel.mood_color,
      sound_effect || panel.sound_effect
    );

    panel.image_url = newImageUrl;
    if (custom_prompt) panel.image_prompt = custom_prompt;
    if (sound_effect) panel.sound_effect = sound_effect;

    comicStore.set(comic.id, comic);

    res.json({
      success: true,
      panel,
      comic,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Route: GET /api/comic/:id
 * Fetches comic layout data by ID
 */
app.get("/api/comic/:id", (req: Request, res: Response) => {
  const comic = comicStore.get(req.params.id);
  if (!comic) {
    return res.status(404).json({ success: false, error: "Comic not found" });
  }
  res.json({ success: true, comic });
});

/**
 * Route: GET /export-success and /api/export-success
 * Displays/returns confirmation after comic PDF export
 */
app.get("/export-success", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Comic exported successfully! Ready for printing and sharing.",
  });
});

app.get("/api/export-success", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Comic exported successfully! Ready for printing and sharing.",
  });
});

/**
 * Health check endpoint
 */
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "ComicCraft",
    gemini_key_configured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Mount Vite middleware in development, or serve built assets in production
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ComicCraft] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
