export interface ComicPanel {
  panel_number: number;
  title: string;
  scene_description: string;
  image_prompt: string;
  image_url: string;
  caption: string;
  dialogue: string;
  sound_effect?: string;
  mood_color?: string;
  camera_angle?: string;
}

export interface ComicStoryRequest {
  story_prompt: string;
  character_name: string;
  setting: string;
  story_tone: string;
  art_style: string;
  num_panels?: number;
}

export interface ComicLayout {
  id: string;
  title: string;
  story_prompt: string;
  character_name: string;
  setting: string;
  story_tone: string;
  art_style: string;
  created_at: string;
  panels: ComicPanel[];
  full_story_narration?: string;
  pdf_filename?: string;
  pdf_url?: string;
}

export interface PresetStory {
  title: string;
  prompt: string;
  character_name: string;
  setting: string;
  tone: string;
  art_style: string;
  num_panels: number;
  description: string;
}
