from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional

from app.gemini_flash import generate_outline
from app.gemini_pro import generate_story
from app.image_generator import generate_image
from app.layout_builder import build_comic_layout
from app.exporters import save_pdf

router = APIRouter()
templates = Jinja2Templates(directory="templates")

class PromptRequest(BaseModel):
    story_prompt: str
    character_name: str = "Hero"
    setting: str = "Forest"
    story_tone: str = "Dramatic"
    art_style: str = "Comic Book"
    num_panels: Optional[int] = 5

class TestImageRequest(BaseModel):
    prompt: str
    art_style: Optional[str] = "Comic Book"

@router.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    """Loads the homepage form."""
    return templates.TemplateResponse("index.html", {"request": request})

@router.post("/generate", response_class=HTMLResponse)
async def generate_comic_form(
    request: Request,
    story_prompt: str = Form(...),
    character_name: str = Form(...),
    setting: str = Form(...),
    story_tone: str = Form(...),
    art_style: str = Form(...),
):
    """
    Milestone 3 - Activity 3.1: Form-based comic generation route.
    Triggers complete AI pipeline and renders comic_preview.html.
    """
    try:
        # 1. Generate Outline
        panels = generate_outline(story_prompt, character_name, setting, story_tone, art_style)

        # 2. Generate Story Narration
        story_text = generate_story(panels, character_name, setting, story_tone)

        # 3. Generate Panel Images
        images = []
        for p in panels:
            img = generate_image(p.get("image_prompt", story_prompt), art_style, p.get("panel_number", 1))
            images.append(img)

        # 4. Build Layout
        layout = build_comic_layout(panels, images, story_text)

        # 5. Compile PDF
        pdf_path = save_pdf(layout, f"{character_name}_{setting}")

        return templates.TemplateResponse("comic_preview.html", {
            "request": request,
            "layout": layout,
            "character_name": character_name,
            "setting": setting,
            "story_tone": story_tone,
            "art_style": art_style,
            "story_prompt": story_prompt,
            "pdf_path": pdf_path,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-comic/json")
async def generate_comic_json(req: PromptRequest):
    """
    Milestone 3 - Activity 3.1: JSON API route for programmatic comic creation.
    Returns layout data and generated PDF path.
    """
    try:
        panels = generate_outline(req.story_prompt, req.character_name, req.setting, req.story_tone, req.art_style, req.num_panels or 5)
        story_text = generate_story(panels, req.character_name, req.setting, req.story_tone)
        images = [generate_image(p.get("image_prompt", req.story_prompt), req.art_style, p.get("panel_number", 1)) for p in panels]
        layout = build_comic_layout(panels, images, story_text)
        pdf_path = save_pdf(layout, f"{req.character_name}_{req.setting}")

        return JSONResponse({
            "status": "success",
            "layout": layout,
            "pdf_path": pdf_path,
            "narration": story_text,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-image")
async def test_image_route(req: TestImageRequest):
    """
    Milestone 3 - Activity 3.1: Developer utility route to test image generation directly.
    """
    try:
        image_path = generate_image(req.prompt, req.art_style or "Comic Book", 1)
        return {"status": "success", "prompt": req.prompt, "image_path": image_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/export-success", response_class=HTMLResponse)
async def export_success(request: Request, pdf_path: Optional[str] = None):
    """
    Milestone 3 - Activity 3.1: Displays export success confirmation page.
    """
    return templates.TemplateResponse("export_success.html", {
        "request": request,
        "pdf_path": pdf_path or "/static/exports/comic.pdf",
    })
