import os
import re
import requests
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

STATIC_PANELS_DIR = Path("static/panels")
STATIC_PANELS_DIR.mkdir(parents=True, exist_ok=True)

def sanitize_filename(text: str) -> str:
    """Sanitizes text for safe file saving."""
    clean = re.sub(r'[^a-zA-Z0-9_-]', '_', text.strip())
    return clean[:40]

def generate_image(image_prompt: str, art_style: str = "Comic Book", panel_number: int = 1) -> str:
    """
    Milestone 2 - Activity 2.1: Generate comic illustrations from prompts.
    Saves image into static/panels/ and returns relative path.
    """
    safe_name = sanitize_filename(image_prompt)
    filename = f"panel_{panel_number}_{safe_name}.png"
    filepath = STATIC_PANELS_DIR / filename

    # Attempt to fetch high quality image via API or create high-resolution comic canvas
    try:
        enhanced_prompt = f"{image_prompt}, {art_style} style, comic panel, detailed ink lines, vibrant color, sharp focus"
        api_url = f"https://image.pollinations.ai/prompt/{requests.utils.quote(enhanced_prompt)}?width=768&height=512&nologo=true"
        resp = requests.get(api_url, timeout=10)
        if resp.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(resp.content)
            return f"/static/panels/{filename}"
    except Exception as e:
        print(f"Online image generation error: {e}. Generating local comic panel canvas.")

    # Create stylized local comic image if offline
    img = Image.new("RGB", (768, 512), color=(24, 24, 37))
    draw = ImageDraw.Draw(img)

    # Draw comic borders & halftones
    draw.rectangle([(16, 16), (752, 496)], outline=(245, 158, 11), width=6)
    draw.rectangle([(24, 24), (744, 488)], outline=(0, 0, 0), width=4)

    # Draw comic header badge
    draw.rectangle([(30, 30), (320, 80)], fill=(254, 240, 138), outline=(0, 0, 0), width=3)
    draw.text((45, 45), f"PANEL {panel_number}: {art_style.upper()}", fill=(0, 0, 0))

    # Draw prompt description banner
    draw.rectangle([(30, 420), (738, 480)], fill=(0, 0, 0, 200))
    draw.text((45, 435), f"Prompt: {image_prompt[:70]}...", fill=(255, 255, 255))

    img.save(filepath)
    return f"/static/panels/{filename}"
