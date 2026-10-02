import { GoogleGenAI, Type } from "@google/genai";
import { ComicPanel, ComicStoryRequest } from "../src/types/comic.js";

// Initialize Gemini SDK with User-Agent header for AI Studio
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export interface GeneratedOutlinePanel {
  panel_number: number;
  title: string;
  scene_description: string;
  image_prompt: string;
  caption: string;
  dialogue: string;
  sound_effect: string;
  mood_color: string;
  camera_angle: string;
}

export interface GeneratedComicStory {
  comic_title: string;
  outline: GeneratedOutlinePanel[];
  full_story_narration: string;
}

/**
 * Milestone 2 - Activity 2.1: generate_outline() using Gemini Flash
 * Generates structured 3 to 5-panel comic outline with panel titles,
 * scene descriptions, image generation prompts, dialogues, and sound effects.
 */
export async function generateOutline(req: ComicStoryRequest): Promise<GeneratedComicStory> {
  const panelCount = req.num_panels || 5;

  const prompt = `
You are ComicCraft's Master Comic Creator & Storyboard Artist.
Create an exciting, immersive, cohesive ${panelCount}-panel comic book story outline based on the user's creative vision:

- Story Prompt: "${req.story_prompt}"
- Main Character Name: "${req.character_name}"
- Setting: "${req.setting}"
- Tone: "${req.story_tone}"
- Art Style: "${req.art_style}"

For each of the ${panelCount} panels, provide:
1. panel_number (1 to ${panelCount})
2. title: An evocative comic panel title (e.g., "Panel 1: The Whispering Woods", "Panel 2: Into the Shadows")
3. scene_description: Detailed visual scene setting the atmosphere, character emotion, lighting, and action.
4. image_prompt: A rich prompt tailored for generating the illustration in "${req.art_style}" style, describing character pose, background environment, color palette, comic ink lines, and dramatic lighting.
5. caption: Ambient narrative box text providing background context or atmospheric commentary.
6. dialogue: Direct spoken dialogue or thought balloon for the characters (e.g., "${req.character_name}: 'We don't have much time!'").
7. sound_effect: A dynamic comic onomatopoeia sound effect suitable for the panel (e.g., "CRACKLE!", "WHOOSH!", "BAM!", "TAP-TAP!").
8. mood_color: Hex color string representing the visual theme of the panel (e.g., "#d97706", "#2563eb", "#059669", "#7c3aed").
9. camera_angle: Cinematic comic angle (e.g., "Close-up", "Low-angle heroic shot", "Wide atmospheric panorama", "Dutch tilt action shot").

Also provide an overarching comic_title and full_story_narration summarizing the continuous comic saga.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert comic book author and layout storyboard artist. Return structured JSON exactly matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comic_title: { type: Type.STRING, description: "Dynamic comic book issue title" },
            full_story_narration: { type: Type.STRING, description: "Complete continuous prose story of the comic" },
            outline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  panel_number: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  scene_description: { type: Type.STRING },
                  image_prompt: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  dialogue: { type: Type.STRING },
                  sound_effect: { type: Type.STRING },
                  mood_color: { type: Type.STRING },
                  camera_angle: { type: Type.STRING },
                },
                required: ["panel_number", "title", "scene_description", "image_prompt", "caption", "dialogue", "sound_effect", "mood_color", "camera_angle"],
              },
            },
          },
          required: ["comic_title", "outline", "full_story_narration"],
        },
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text) as GeneratedComicStory;

    if (!data.outline || !Array.isArray(data.outline) || data.outline.length === 0) {
      throw new Error("Invalid outline structure returned by Gemini");
    }

    return data;
  } catch (error) {
    console.error("Gemini generateOutline error, using fallback generator:", error);
    return getFallbackStory(req, panelCount);
  }
}

/**
 * Milestone 2 - Activity 2.1: generate_image()
 * Generates comic illustration from prompt and art style.
 * Uses AI image generation or styled comic SVG vector illustration.
 */
export async function generateComicImage(
  imagePrompt: string,
  artStyle: string,
  panelTitle: string,
  moodColor: string = "#f59e0b",
  soundEffect: string = "BAM!"
): Promise<string> {
  // First, check if Gemini flash image is accessible, or use high quality styled SVG/Pollinations
  // We can query Pollinations API or synthesize a stunning stylized comic panel illustration
  try {
    const encodedPrompt = encodeURIComponent(
      `${imagePrompt}, comic book panel illustration, ${artStyle} style, clean ink lines, vibrant colors, comic art, high resolution, detailed cinematic composition, masterpiece`
    );
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

    // Test fast response with a HEAD or quick fetch check
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const testRes = await fetch(pollinationsUrl, { method: "HEAD", signal: controller.signal });
    clearTimeout(timeout);

    if (testRes.ok) {
      return pollinationsUrl;
    }
  } catch (e) {
    // Fall through to comic SVG renderer
    console.log("Remote image service unavailable or timed out, generating rich comic artwork SVG");
  }

  // Generate a beautiful, stylized Comic Vector SVG with Ben-Day dots, sound burst, dramatic angles
  return createStylizedComicSvg(panelTitle, imagePrompt, artStyle, moodColor, soundEffect);
}

/**
 * Creates an authentic comic book panel as a base64 SVG data URI
 * with speech burst, halftones, gradients, silhouettes, and dramatic graphic style.
 */
export function createStylizedComicSvg(
  title: string,
  prompt: string,
  artStyle: string,
  moodColor: string = "#e11d48",
  soundEffect: string = "POW!"
): string {
  const cleanTitle = escapeXml(title.slice(0, 45));
  const cleanPrompt = escapeXml(prompt.slice(0, 80) + (prompt.length > 80 ? "..." : ""));
  const cleanSound = escapeXml(soundEffect.slice(0, 12));

  // Determine palette accents based on art style
  let bgGradientStart = "#0f172a";
  let bgGradientEnd = moodColor;
  let lineArtColor = "#000000";

  if (artStyle.toLowerCase().includes("manga") || artStyle.toLowerCase().includes("anime")) {
    bgGradientStart = "#18181b";
    bgGradientEnd = "#3f3f46";
  } else if (artStyle.toLowerCase().includes("retro") || artStyle.toLowerCase().includes("pop")) {
    bgGradientStart = "#fef08a";
    bgGradientEnd = "#f43f5e";
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <!-- Comic Ben-Day Dot Pattern -->
    <pattern id="benday" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="2.5" fill="rgba(0,0,0,0.18)"/>
    </pattern>
    <pattern id="speedlines" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
    </pattern>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradientStart}"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="${bgGradientEnd}"/>
    </linearGradient>
    <linearGradient id="sunburstGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="comicShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="6" dy="6" stdDeviation="0" flood-color="#000000"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="600" fill="url(#bgGrad)"/>

  <!-- Radial Comic Sunburst Spoke Rays -->
  <g opacity="0.4">
    <polygon points="400,300 0,0 200,0" fill="url(#sunburstGrad)"/>
    <polygon points="400,300 400,0 600,0" fill="url(#sunburstGrad)"/>
    <polygon points="400,300 800,0 800,200" fill="url(#sunburstGrad)"/>
    <polygon points="400,300 800,400 800,600" fill="url(#sunburstGrad)"/>
    <polygon points="400,300 600,600 400,600" fill="url(#sunburstGrad)"/>
    <polygon points="400,300 200,600 0,600" fill="url(#sunburstGrad)"/>
    <polygon points="400,300 0,400 0,200" fill="url(#sunburstGrad)"/>
  </g>

  <!-- Ben-Day Dots Texture Layer -->
  <rect width="800" height="600" fill="url(#benday)"/>
  <rect width="800" height="600" fill="url(#speedlines)"/>

  <!-- Dramatic Mountain / City Scenery Silhouette -->
  <path d="M0 480 L120 410 L220 460 L380 370 L520 440 L680 390 L800 470 L800 600 L0 600 Z" fill="#090d16" opacity="0.95"/>
  <path d="M0 520 L160 480 L320 530 L500 470 L700 520 L800 490 L800 600 L0 600 Z" fill="#000000"/>

  <!-- Heroic Character Silhouette in dramatic comic stance -->
  <g transform="translate(330, 210)">
    <!-- Aura glow -->
    <circle cx="70" cy="110" r="100" fill="${moodColor}" opacity="0.25"/>
    <!-- Cloak / Cape flutter -->
    <path d="M30 90 Q -20 180 10 240 Q 60 210 65 140 Z" fill="#0f172a" stroke="#ffffff" stroke-width="2" opacity="0.9"/>
    <!-- Torso and shoulders -->
    <path d="M55 75 L85 75 L105 135 L95 200 L45 200 L35 135 Z" fill="#1e293b" stroke="#ffffff" stroke-width="2.5"/>
    <!-- Head / Mask -->
    <circle cx="70" cy="50" r="22" fill="#0f172a" stroke="#ffffff" stroke-width="2.5"/>
    <polygon points="62,48 78,48 70,30" fill="${moodColor}"/>
    <!-- Eyes dramatic glow -->
    <ellipse cx="64" cy="50" rx="3.5" ry="1.5" fill="#fef08a"/>
    <ellipse cx="76" cy="50" rx="3.5" ry="1.5" fill="#fef08a"/>
    <!-- Raised arm / Gesture -->
    <path d="M85 85 L125 60 L145 35" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
    <path d="M85 85 L125 60 L145 35" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>
    <!-- Spark / Energy Orb on Hand -->
    <circle cx="150" cy="30" r="18" fill="#facc15" filter="url(#comicShadow)"/>
    <polygon points="150,5 156,25 175,30 156,35 150,55 144,35 125,30 144,25" fill="#ffffff"/>
    <!-- Legs -->
    <path d="M50 200 L35 285 L60 290 L70 210 L85 285 L110 280 L90 200 Z" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
  </g>

  <!-- Comic Action Sound Burst ("BAM!", "WHOOSH!") -->
  <g transform="translate(620, 110)">
    <polygon points="0,-45 15,-20 45,-35 30,-5 60,10 25,20 40,50 10,35 -5,60 -20,30 -50,45 -35,15 -60,-10 -25,-15 -40,-45 -10,-30"
      fill="#facc15" stroke="#000000" stroke-width="4" filter="url(#comicShadow)"/>
    <text x="0" y="8" font-family="'Impact', 'Bangers', cursive, sans-serif" font-size="28" font-weight="900" fill="#dc2626" text-anchor="middle" stroke="#ffffff" stroke-width="1.5">
      ${cleanSound}
    </text>
  </g>

  <!-- Panel Style Stamp & Label Header -->
  <rect x="25" y="25" width="220" height="38" rx="4" fill="#000000" filter="url(#comicShadow)"/>
  <rect x="23" y="23" width="220" height="38" rx="4" fill="#fef08a" stroke="#000000" stroke-width="2"/>
  <text x="35" y="47" font-family="'Impact', sans-serif" font-size="14" font-weight="bold" fill="#000000" letter-spacing="1">
    ★ STYLE: ${escapeXml(artStyle.toUpperCase())}
  </text>

  <!-- Scene Prompt Overlay Pill at Bottom -->
  <rect x="30" y="525" width="740" height="48" rx="8" fill="rgba(0,0,0,0.85)" stroke="#ffffff" stroke-width="1.5"/>
  <text x="50" y="554" font-family="sans-serif" font-size="14" fill="#f8fafc" font-weight="500">
    <tspan fill="#f59e0b" font-weight="bold">SCENE: </tspan>${cleanPrompt}
  </text>

  <!-- Heavy Outer Comic Frame -->
  <rect x="4" y="4" width="792" height="592" fill="none" stroke="#000000" stroke-width="8"/>
</svg>`;

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function getFallbackStory(req: ComicStoryRequest, panelCount: number): GeneratedComicStory {
  const char = req.character_name || "The Hero";
  const setting = req.setting || "Mysterious Realm";
  const tone = req.story_tone || "Adventurous";
  const art = req.art_style || "Comic Book";

  const defaultPanels: GeneratedOutlinePanel[] = [
    {
      panel_number: 1,
      title: "Panel 1: The Call to Adventure",
      scene_description: `${char} stands at the boundary of ${setting}, clutching an ancient map under dramatic twilight skies.`,
      image_prompt: `Heroic shot of ${char} entering ${setting}, dynamic shadows, comic ink lines, ${art} art style, saturated colors.`,
      caption: `The legends were true. Somewhere beyond the ridge lay the truth ${char} had sought for years.`,
      dialogue: `${char}: "No turning back now. This is where it begins."`,
      sound_effect: "RUMBLE!",
      mood_color: "#2563eb",
      camera_angle: "Wide establishing shot",
    },
    {
      panel_number: 2,
      title: "Panel 2: Into the Unknown",
      scene_description: `Navigating twisting pathways and mysterious ancient ruins deep within ${setting}. Strange glowing glyphs illuminate the shadows.`,
      image_prompt: `Intriguing perspective of ${char} observing glowing runes in ${setting}, mysterious mist, intense comic lighting, ${art} style.`,
      caption: `Every step echoed with the whispers of forgotten guardians.`,
      dialogue: `${char}: "The runes... they're reacting to my presence!"`,
      sound_effect: "HUMMMM!",
      mood_color: "#7c3aed",
      camera_angle: "Medium shot with high contrast",
    },
    {
      panel_number: 3,
      title: "Panel 3: The Sudden Peril",
      scene_description: `An unexpected challenge shakes the ground as the terrain shifts and a mysterious magical gate springs to life.`,
      image_prompt: `Action packed panel, ground cracking open, energy radiating from ancient mechanism, ${char} reacting swiftly, ${art} aesthetic.`,
      caption: `Without warning, the trap was sprung!`,
      dialogue: `${char}: "Watch out! The seal has broken!"`,
      sound_effect: "CRACKLE-BOOM!",
      mood_color: "#dc2626",
      camera_angle: "Dutch tilt dynamic action angle",
    },
    {
      panel_number: 4,
      title: "Panel 4: The Turning Point",
      scene_description: `${char} summons courage, channeling newfound power to resolve the ancient trial in ${setting}.`,
      image_prompt: `Triumphant shot of ${char} focusing magical energy, cape fluttering, determined expression, vibrant colors, ${art} rendering.`,
      caption: `Drawing upon years of training, ${char} refused to falter.`,
      dialogue: `${char}: "I know the answer now! Balance is key!"`,
      sound_effect: "FLASH!",
      mood_color: "#d97706",
      camera_angle: "Low-angle heroic triumph",
    },
    {
      panel_number: 5,
      title: "Panel 5: The Dawn of a New Legend",
      scene_description: `${char} emerges victorious at sunrise, holding the glowing relic with the vast horizon stretching ahead.`,
      image_prompt: `Golden hour sunrise over ${setting}, ${char} standing atop a high vantage point, cinematic rim lighting, ${art} style.`,
      caption: `The quest in ${setting} was complete, but a greater universe of adventure awaited.`,
      dialogue: `${char}: "This is only the first chapter."`,
      sound_effect: "SHINE!",
      mood_color: "#059669",
      camera_angle: "Panoramic cinematic hero shot",
    },
  ];

  return {
    comic_title: `${char} and the Chronicles of ${setting}`,
    full_story_narration: `A ${tone.toLowerCase()} tale of determination and wonder following ${char} through the perils of ${setting}.`,
    outline: defaultPanels.slice(0, panelCount),
  };
}
