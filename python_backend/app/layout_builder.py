def build_comic_layout(panels: list, images: list, story_narration: str = ""):
    """
    Milestone 2 - Activity 2.1: Organize comic panels into layout structure.
    Matches each generated image with its corresponding panel story.
    Returns a list of structured dictionaries for rendering and export.
    """
    layout = []
    for idx, panel in enumerate(panels):
        img_path = images[idx] if idx < len(images) else "/static/panels/default.png"
        layout.append({
            "panel_number": panel.get("panel_number", idx + 1),
            "title": panel.get("title", f"Panel {idx + 1}"),
            "scene_description": panel.get("scene_description", ""),
            "image_prompt": panel.get("image_prompt", ""),
            "image_path": img_path,
            "caption": panel.get("caption", f"Panel {idx + 1} narration."),
            "dialogue": panel.get("dialogue", ""),
            "sound_effect": panel.get("sound_effect", "BAM!"),
        })
    return layout
