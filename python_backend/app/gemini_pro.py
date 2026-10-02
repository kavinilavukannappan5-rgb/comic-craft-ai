import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={"headers": {"User-Agent": "aistudio-build"}}
)

def generate_story(panels: list, character_name: str, setting: str, tone: str):
    """
    Milestone 2 - Activity 2.1: Generate comic story narration and character dialogue
    using Gemini Pro to expand each panel outline into full narrative and speech balloons.
    """
    panels_summary = "\n".join([
        f"Panel {p.get('panel_number')}: Title: {p.get('title')}. Scene: {p.get('scene_description')}"
        for p in panels
    ])

    prompt = f"""
You are ComicCraft's Lead Comic Writer.
Expand the following panel outlines into engaging comic narration, ambient caption boxes, and snappy character dialogues:

Character: {character_name}
Setting: {setting}
Tone: {tone}

Panel Outlines:
{panels_summary}

For each panel, write:
1. Caption: Atmospheric narrator description.
2. Dialogue: Character spoken dialogue or thoughts.
3. Sound Effect: Comic onomatopoeia (e.g. BAM!, WHOOSH!, CRACKLE!).

Return clear, formatted comic script text panel by panel.
"""

    try:
      response = client.models.generate_content(
          model="gemini-2.5-flash",
          contents=prompt,
          config=types.GenerateContentConfig(
              temperature=0.7,
          ),
      )
      return response.text
    except Exception as e:
      print(f"Error in generate_story: {e}")
      return f"The heroic chronicles of {character_name} in the perilous realm of {setting}."
