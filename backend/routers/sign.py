from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()


@router.post("/sign/predict", response_model=schemas.SignPredictResponse)
def sign_predict(body: schemas.SignPredictRequest, db: Session = Depends(get_db)):
    """
    HTTP fallback for sign language prediction (use WebSocket /ws/sign for real-time).

    WHY THIS MATTERS FOR ACCESSIBILITY:
    - Deaf and hard-of-hearing users communicate via sign language.
    - This endpoint accepts 21 hand keypoints (x,y,z) extracted by MediaPipe
      from the user's webcam and returns the detected ASL sign.
    - Enables non-signing users to understand Deaf users in real time.
    - The WebSocket version (/ws/sign) handles continuous camera feeds.
    - This HTTP version is a fallback for single-frame predictions or testing.

    Input: 63 floats = 21 hand landmarks × (x, y, z coordinates)
    Output: { "sign": "hello", "confidence": 0.97 }
    """
    if len(body.landmarks) != 63:
        raise HTTPException(
            status_code=400,
            detail=f"Expected 63 landmark values, got {len(body.landmarks)}"
        )

    try:
        from ml.sign_model import predict
        result = predict(body.landmarks)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Sign model not loaded: {str(e)}")

    # Log prediction for future model retraining
    db.add(models.SignLog(
        detected_sign=result["sign"],
        confidence=result["confidence"],
        landmark_json=body.landmarks,
    ))
    db.commit()

    return schemas.SignPredictResponse(**result)