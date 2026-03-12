"""
ML integration layer — called by both /api/sign/predict and /ws/sign.
The actual model file (sign_model.h5) is delivered by the ML team member.
"""
import numpy as np

_model = None


def get_model():
    """Lazy-load the Keras model (only loads once on first prediction)."""
    global _model
    if _model is None:
        try:
            import tensorflow as tf
            _model = tf.keras.models.load_model("models/sign_model.h5")
        except Exception as e:
            raise RuntimeError(
                f"Could not load sign_model.h5. "
                f"Make sure the ML team has placed it in the models/ folder. Error: {e}"
            )
    return _model


def predict(landmarks: list) -> dict:
    """
    Run inference on 63 hand landmark floats.

    Args:
        landmarks: List of 63 floats (21 keypoints × x,y,z)

    Returns:
        { "sign": "hello", "confidence": 0.97 }
    """
    from ml.sign_labels import LABELS

    arr = np.array(landmarks, dtype=np.float32).reshape(1, 63)
    probs = get_model().predict(arr, verbose=0)[0]

    idx = int(np.argmax(probs))
    confidence = round(float(probs[idx]), 3)

    return {
        "sign": LABELS[idx],
        "confidence": confidence,
    }