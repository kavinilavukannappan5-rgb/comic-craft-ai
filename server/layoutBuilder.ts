import { ComicLayout, ComicPanel, ComicStoryRequest } from "../src/types/comic.js";
import { GeneratedComicStory } from "./geminiService.js";

/**
 * Milestone 2 - Activity 2.1: build_comic_layout()
 * Organizes generated images and comic panel storylines into a cohesive layout
 * with timestamped identifiers, metadata, and sequential flow.
 */
export function buildComicLayout(
  req: ComicStoryRequest,
  storyData: GeneratedComicStory,
  panelImages: string[]
): ComicLayout {
  const timestamp = new Date();
  const id = `comic_${Date.now()}`;
  const dateFormatted = timestamp.toISOString().split("T")[0];

  const panels: ComicPanel[] = storyData.outline.map((panel, idx) => {
    return {
      panel_number: panel.panel_number || idx + 1,
      title: panel.title || `Panel ${idx + 1}`,
      scene_description: panel.scene_description || "",
      image_prompt: panel.image_prompt || "",
      image_url: panelImages[idx] || "",
      caption: panel.caption || "",
      dialogue: panel.dialogue || "",
      sound_effect: panel.sound_effect || "BAM!",
      mood_color: panel.mood_color || "#f59e0b",
      camera_angle: panel.camera_angle || "Medium shot",
    };
  });

  const sanitizedTitle = (storyData.comic_title || `${req.character_name}'s Saga`)
    .replace(/[^a-zA-Z0-9_\- ]/g, "")
    .trim()
    .replace(/\s+/g, "_");

  const pdfFilename = `ComicCraft_${sanitizedTitle}_${dateFormatted}.pdf`;

  return {
    id,
    title: storyData.comic_title || `${req.character_name}: The Journey Begins`,
    story_prompt: req.story_prompt,
    character_name: req.character_name,
    setting: req.setting,
    story_tone: req.story_tone,
    art_style: req.art_style,
    created_at: timestamp.toISOString(),
    panels,
    full_story_narration: storyData.full_story_narration,
    pdf_filename: pdfFilename,
    pdf_url: `/api/export-pdf/${id}`,
  };
}
