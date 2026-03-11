import os
import hashlib
import asyncio
import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

HF_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"
HF_HEADERS = {"Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"}

ALLOWED_AUDIO = {"audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp4"}


async def call_hf_whisper(audio_bytes: bytes) -> str:
    """Send raw audio bytes to Whisper on HuggingFace for transcription."""
    async with httpx.AsyncClient(timeout=120) as client:
        r = await client.post(HF_URL, headers=HF_HEADERS, content=audio_bytes)

    if r.status_code == 503:
        await asyncio.sleep(20)
        return await call_hf_whisper(audio_bytes)

    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"HuggingFace error: {r.text}")

    result = r.json()
    # Whisper returns: {"text": "the transcribed speech..."}
    return result.get("text", "")


@router.post("/voice", response_model=schemas.VoiceResponse)
async def voice(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Accepts an audio file and returns a text transcript using OpenAI Whisper.

    WHY THIS MATTERS FOR ACCESSIBILITY:
    - Users with motor disabilities or conditions like cerebral palsy may find
      typing extremely difficult or impossible.
    - This endpoint converts speech to text, letting users control the entire
      AccessAI app with just their voice.
    - Also helps Deaf users transcribe recorded audio/video content.
    - Works with any language Whisper supports (99+ languages).

    Frontend use: Record audio via MediaRecorder API → POST here → get transcript
    → optionally pipe into /api/simplify for plain-language version.
    """
    audio_bytes = await audio.read()
    if len(audio_bytes) > 25 * 1024 * 1024:  # 25 MB limit
        raise HTTPException(status_code=400, detail="Audio must be under 25 MB")

    # Step 1: Cache check
    cache_key = hashlib.sha256(audio_bytes).hexdigest()
    cached = db.query(models.APICache).filter(models.APICache.input_hash == cache_key).first()
    if cached:
        return schemas.VoiceResponse(transcript=cached.output_text, cached=True)

    # Step 2: Transcribe with Whisper
    transcript = await call_hf_whisper(audio_bytes)

    # Step 3: Cache
    db.add(models.APICache(
        input_hash=cache_key,
        endpoint="voice",
        output_text=transcript,
    ))
    db.commit()

    return schemas.VoiceResponse(transcript=transcript, cached=False)