import os
import hashlib
import base64
import asyncio
import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

HF_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
HF_HEADERS = {"Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"}

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


async def call_hf_describe(image_bytes: bytes) -> str:
    """Send image bytes to BLIP on HuggingFace for captioning."""
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(HF_URL, headers=HF_HEADERS, content=image_bytes)

    if r.status_code == 503:
        await asyncio.sleep(20)
        return await call_hf_describe(image_bytes)

    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"HuggingFace error: {r.text}")

    result = r.json()
    # BLIP returns: [{"generated_text": "a person in a wheelchair..."}]
    return result[0]["generated_text"]


@router.post("/describe", response_model=schemas.DescribeResponse)
async def describe(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Accepts an uploaded image and returns an AI-generated description.

    WHY THIS MATTERS FOR ACCESSIBILITY:
    - Blind and visually impaired users cannot see images on websites or in documents.
    - Screen readers can only read ALT text — which is often missing or unhelpful.
    - This endpoint generates a real, detailed caption for ANY image automatically.
    - The frontend can pipe this text straight into a text-to-speech engine.

    Example: Upload a photo → "A person in a wheelchair using a laptop computer
    at a wooden desk near a window."
    """
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, GIF allowed")

    image_bytes = await image.read()
    if len(image_bytes) > 5 * 1024 * 1024:  # 5 MB limit
        raise HTTPException(status_code=400, detail="Image must be under 5 MB")

    # Step 1: Check cache (hash of raw image bytes)
    cache_key = hashlib.sha256(image_bytes).hexdigest()
    cached = db.query(models.APICache).filter(models.APICache.input_hash == cache_key).first()
    if cached:
        return schemas.DescribeResponse(description=cached.output_text, cached=True)

    # Step 2: Call HuggingFace BLIP
    description = await call_hf_describe(image_bytes)

    # Step 3: Cache result
    db.add(models.APICache(
        input_hash=cache_key,
        endpoint="describe",
        output_text=description,
    ))
    db.commit()

    return schemas.DescribeResponse(description=description, cached=False)