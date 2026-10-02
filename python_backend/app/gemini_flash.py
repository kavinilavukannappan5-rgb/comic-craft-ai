import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Initialize Google GenAI client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={"headers": {"User-Agent": "aistudio-build"}}
)

def generate_outline(story_prompt: str, character_name: str, setting: str, tone: str, art_style: str, num_panels: int = 5):
    """
    Milestone 2 - Activity 2.1: Generate structured 5-panel comic outline using Gemini Flash.
    Returns a list of panel dictionaries with panel_number, title, scene_description, and image_prompt.
    """
    prompt = f"""
You are ComicCraft's Storyboard Director.
Generate a structured {num_panels}-panel comic outline for:
- Story: {story_prompt}
- Character: {character_name}
- Setting: {setting}
- Tone: {tone}
- Art Style: {art_style}

Format output as valid JSON with a 'panels' array containing {num_panels} items.
Each item must have:
- panel_number: integer (1 to {num_panels})
- title: evocative panel title
- scene_description: visual scene setup and atmospheric details
- image_prompt: prompt for comic illustration in {art_style} style, detailing character, background, lighting, and composition.
"""

    try:
      response = client.models.generate_content(
          model="gemini-2.5-flash",
          contents=prompt,
          config=types.GenerateContentConfig(
              response_mime_type="application/json",
              temperature=0.8,
          ),
      )
      data = json.loads(response.text)
      if isinstance(data, dict) and "panels" in data:
          return data["panels"]
      elif isinstance(data, list):
          return data
      return data
    except Exception as e:
      print(f"Error in generate_outline: {e}")
      # Fallback deterministic panels
      return [
          {
              "panel_number": i + 1,
              "title": f"Panel {i+1}: {character_name}'s Journey",
              "scene_description": f"{character_name} in {setting}, navigating {tone.lower()} events.",
              "image_prompt": f"Dramatic comic panel of {character_name} in {setting}, {art_style} style, dynamic lighting, masterpiece."
          }
          for i in range(num_panels)
      ]
