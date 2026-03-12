from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


@router.post("/register", response_model=schemas.TokenResponse)
def register(body: schemas.RegisterRequest, db: Session = Depends(get_db)):
    """
    Create a new user account.
    WHY: Lets users save their accessibility preferences (font size, contrast, etc.)
    so they don't have to set them every visit.
    """
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=body.email,
        hashed_password=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.TokenResponse)
def login(body: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email + password, receive a JWT.
    The frontend stores this token and sends it with every protected request.
    """
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserResponse)
def me(current_user: models.User = Depends(get_current_user)):
    """
    Returns logged-in user's profile.
    WHY: Frontend uses this on load to restore saved accessibility preferences.
    """
    return current_user


@router.put("/preferences", response_model=schemas.UserResponse)
def update_preferences(
    body: schemas.PreferencesRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Save accessibility preferences to the database.
    WHY: Users with disabilities often have specific needs (large text, high contrast,
    slow TTS speed). This persists their settings across sessions and devices.
    Example body: { "preferences": { "font_size": "xl", "contrast": "high" } }
    """
    current_user.preferences = body.preferences
    db.commit()
    db.refresh(current_user)
    return current_user