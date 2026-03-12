# AccessAI

AccessAI is an accessibility-focused web app with a React frontend and a FastAPI backend.

It includes:
- Sign language detection
- Voice navigation
- Text simplification
- Image description

## Project Structure

```text
accessai/
├── backend/
├── frontend/
└── extension/
```

## Prerequisites

- Python 3.12+ recommended
- Node.js 20+ recommended
- PostgreSQL running locally

## Backend Setup

Open a terminal in [backend](/D:/Projects/accessai/backend).

1. Activate the virtual environment:

```powershell
venv\Scripts\activate
```

If `venv` does not exist yet:

```powershell
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Create `backend/.env` with values like:

```dotenv
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/accessai
HF_API_TOKEN=hf_your_token_here
HF_TEXT_MODEL=Qwen/Qwen2.5-72B-Instruct:novita
HF_VISION_MODEL=CohereLabs/aya-vision-32b:cohere
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

4. Start the backend:

```powershell
python -m uvicorn main:app --reload
```

Backend URLs:
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`

## Frontend Setup

Open a second terminal in [frontend](/D:/Projects/accessai/frontend).

1. Create the frontend env file:

```powershell
Copy-Item .env.example .env
```

2. Install dependencies:

```powershell
npm install
```

3. Start the frontend:

```powershell
npm run dev
```

The frontend will use:
- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_WS_URL=ws://localhost:8000`

## How To Run The Full App

1. Start PostgreSQL
2. Start the backend from [backend](/D:/Projects/accessai/backend)
3. Start the frontend from [frontend](/D:/Projects/accessai/frontend)
4. Open the Vite URL shown in the frontend terminal

## How To Test

### Backend Smoke Test

From [backend](/D:/Projects/accessai/backend):

```powershell
python smoke_test.py
```

This verifies:
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/preferences`
- `POST /api/sign/predict`
- `POST /api/simplify`
- `POST /api/describe`
- `POST /api/describe/url`
- `POST /api/voice`

### Manual API Testing

Open:
- `http://127.0.0.1:8000/docs`

### Frontend Testing

Once both servers are running, test these pages from the UI:
- Home
- Sign Language
- Voice Navigator
- Simplifier
- Image Describer

## Notes

- `GET /` on the backend is expected to return `404`; use `/health` or `/docs`
- Image hover descriptions use the backend route `/api/describe/url`
- Sign detection uses both browser-side processing and the backend WebSocket at `/ws/sign`
- `backend/.env` is intentionally ignored and should not be committed

## Useful Commands

Backend:

```powershell
cd D:\Projects\accessai\backend
venv\Scripts\activate
python -m uvicorn main:app --reload
```

Frontend:

```powershell
cd D:\Projects\accessai\frontend
npm install
npm run dev
```

Smoke test:

```powershell
cd D:\Projects\accessai\backend
venv\Scripts\activate
python smoke_test.py
```
