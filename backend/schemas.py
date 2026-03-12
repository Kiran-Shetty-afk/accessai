from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any


# ── Auth ──────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str  # Plain text — hashed in auth.py before storing

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    preferences: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class PreferencesRequest(BaseModel):
    # Any key-value pairs — e.g. font_size, contrast, voice_speed
    preferences: Dict[str, Any]


# ── Simplify ──────────────────────────────────────────────────────────────────
class SimplifyRequest(BaseModel):
    text: str           # Max 5000 chars
    grade_level: int = 5  # 3 = elementary, 5 = middle, 8 = high school

class SimplifyResponse(BaseModel):
    simplified: str
    word_count_before: int
    word_count_after: int
    cached: bool


# ── Describe ──────────────────────────────────────────────────────────────────
class DescribeResponse(BaseModel):
    description: str
    cached: bool


# ── Voice ─────────────────────────────────────────────────────────────────────
class VoiceResponse(BaseModel):
    transcript: str
    cached: bool


# ── Sign ──────────────────────────────────────────────────────────────────────
class SignPredictRequest(BaseModel):
    landmarks: list  # 63 floats — 21 keypoints × (x, y, z)

class SignPredictResponse(BaseModel):
    sign: str
    confidence: float