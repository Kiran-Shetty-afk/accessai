import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base
from routers import simplify, describe, voice, sign, auth as auth_router

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AccessAI API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "https://your-vercel-app.vercel.app"),
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
app.include_router(simplify.router, prefix="/api", tags=["Simplify"])
app.include_router(describe.router, prefix="/api", tags=["Describe"])
app.include_router(voice.router, prefix="/api", tags=["Voice"])
app.include_router(sign.router, prefix="/api", tags=["Sign"])

# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    """Wake up Render from sleep + confirm API is running."""
    return {"status": "ok"}

# ── WebSocket for real-time sign detection ────────────────────────────────────
@app.websocket("/ws/sign")
async def ws_sign(websocket: WebSocket):
    """
    Receives hand landmark data from the frontend camera feed
    and returns the predicted sign + confidence score in real time.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            # data = { "landmarks": [63 floats] }
            from ml.sign_model import predict
            result = predict(data["landmarks"])
            await websocket.send_json(result)
    except WebSocketDisconnect:
        pass