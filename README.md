# AccessAI

AI-powered accessibility platform built with a React frontend and a FastAPI backend.

[![License](https://img.shields.io/badge/license-MIT-green)](#license)
[![Python](https://img.shields.io/badge/python-3.12%2B-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-frontend-61dafb)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/backend-fastapi-009688)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/database-postgresql-336791)](https://www.postgresql.org/)
[![Hackathon](https://img.shields.io/badge/hackathon-NMIMS%202026-orange)]()

AccessAI is designed to make the web easier to use for people with disabilities. It combines computer vision, speech tools, and language models to help users read, navigate, describe images, and communicate more easily.

Achievement: 4th Place at the NMIMS Tech Hackathon on Disability Inclusion.

## Demo

Watch the project demo:

[![AccessAI Demo](https://img.youtube.com/vi/K3-UwKsswkE/0.jpg)](https://youtu.be/K3-UwKsswkE)

## Why AccessAI

More than 1.3 billion people globally live with disabilities, and many digital products still create unnecessary barriers. AccessAI focuses on practical accessibility tools that can run in a normal browser and work with existing websites and content.

## Features

### Sign Language Recognition

- Detects supported hand signs from webcam input
- Uses MediaPipe landmarks and TensorFlow-based inference
- Converts signs into text and speech
- Supports both browser-side inference and backend WebSocket inference

### Sign Call

- Starts a live video call between two users
- Shares detected sign captions during the call
- Uses WebRTC with PeerJS for browser-to-browser calling
- Works best for same-network or normal consumer internet testing

### Voice Navigation

- Lets users control the site with voice commands
- Supports commands such as `scroll down`, `go back`, `read page`, and page navigation
- Designed for hands-free interaction

### Cognitive Text Simplifier

- Rewrites complex text into simpler language
- Supports grade-based simplification
- Useful for dyslexia, cognitive disabilities, and low literacy scenarios

Example:

```text
Original:
The government implemented a comprehensive environmental sustainability initiative.

Simplified:
The government started a plan to protect the environment.
```

### Image Description

- Generates AI descriptions for uploaded images
- Supports hover-based image descriptions in the frontend
- Helps visually impaired users understand images and visual content

Example output:

```text
A person in a wheelchair working on a laptop.
```

### Accessibility Profiles

- Saves accessibility preferences such as contrast, font size, and speech settings
- Includes reusable profile presets for different user needs

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- TensorFlow.js
- PeerJS

### Backend

- FastAPI
- PostgreSQL
- SQLAlchemy
- WebSockets

### AI and ML

- TensorFlow
- MediaPipe
- Hugging Face Inference Providers

## Project Structure
# AccessAI 🚀

**AI-Powered Accessibility Platform**

[![License](https://img.shields.io/badge/license-MIT-green)](#license)
[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-frontend-61dafb)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/backend-fastapi-009688)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/database-postgresql-336791)](https://www.postgresql.org/)
[![Hackathon](https://img.shields.io/badge/hackathon-NMIMS%202026-orange)]()

AccessAI is an **AI-powered accessibility platform** designed to make websites easier to use for people with disabilities.
It integrates **computer vision, speech processing, and natural language AI** to help users interact with digital content more easily.

🏆 **Achievement:** 4th Place – NMIMS Tech Hackathon on Disability Inclusion

---

# 🌍 Why AccessAI?

Over **1.3 billion people globally live with disabilities**, and many digital platforms are not accessible.

AccessAI provides AI-driven tools that help users:

* Understand complex content
* Navigate websites using voice
* Interpret sign language
* Understand images through AI descriptions

Our goal is to make the **web more inclusive and accessible**.

---
## 🎥 Project Demo

Watch the AccessAI demo video:

[![AccessAI Demo](https://img.youtube.com/vi/K3-UwKsswkE/0.jpg)](https://youtu.be/K3-UwKsswkE)

# ✨ Features

## 🤟 Sign Language Recognition

Real-time sign language detection using webcam input.

* Hand landmark detection via **MediaPipe**
* Gesture recognition with **TensorFlow**
* Converts sign language → text → speech

---

## 🧠 Cognitive Text Simplifier

Simplifies complex text into easy-to-read language.

Example:

```text
Original:
The government implemented a comprehensive environmental sustainability initiative.

Simplified:
The government started a plan to protect the environment.
```

Helps users with:

* Dyslexia
* Cognitive disabilities
* Low literacy levels

---

## 🖼 Image Description

Automatically generates descriptions for images.

Example output:

```text
"A person in a wheelchair working on a laptop."
```

Helps visually impaired users understand visual content.

---

## 🎙 Voice Navigation

Users can control the interface using voice commands.

Example commands:

```text
accessai/
|-- backend/
|-- frontend/
`-- extension/
```

## Prerequisites

- Python 3.12 or newer recommended
- Node.js 20 or newer recommended
- PostgreSQL running locally
- A Hugging Face API token for text, vision, and voice features

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Kiran-Shetty-afk/accessai.git
cd accessai
```

### 2. Backend setup

Open a terminal in `backend`:

```powershell
cd backend
scroll down
go back
read page
increase text
```

Designed for users with **motor disabilities**.

---

# 🏗 System Architecture

```mermaid
flowchart LR

User[User Browser]
Frontend[React Frontend]
Backend[FastAPI Backend]
Database[(PostgreSQL)]
AI[HuggingFace AI APIs]
Vision[MediaPipe]
Model[TensorFlow Sign Model]

User --> Frontend
Frontend --> Backend
Backend --> Database
Backend --> AI
Frontend --> Vision
Vision --> Model
Model --> Backend
```

---

# ⚙️ Tech Stack

### Frontend

* React
* Vite
* TailwindCSS

### Backend

* FastAPI
* Python
* WebSockets

### AI / Machine Learning

* TensorFlow
* MediaPipe
* HuggingFace Models

### Database

* PostgreSQL

---

# 📂 Project Structure

```
accessai
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── api
│   │   └── context
│
├── backend
│   ├── routers
│   ├── models
│   ├── ml
│   ├── database.py
│   └── main.py
│
└── docs
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Kiran-Shetty-afk/accessai.git
cd accessai
```

---

# 🔧 Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
```

Create `backend/.env` with values like:

```dotenv
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/accessai
HF_API_TOKEN=hf_your_token_here
HF_TEXT_MODEL=Qwen/Qwen2.5-72B-Instruct:novita
HF_VISION_MODEL=CohereLabs/aya-vision-32b:cohere
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Start the backend:

```powershell
python -m uvicorn main:app --reload
```

Backend URLs:

- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`

### 3. Frontend setup

Open a second terminal in `frontend`:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

The frontend uses:

- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_WS_URL=ws://localhost:8000`

### 4. Run the full app

1. Start PostgreSQL
2. Start the backend
3. Start the frontend
4. Open the Vite URL shown in the frontend terminal

## Testing

### Backend smoke test

From `backend`:
Backend will start at:

```
http://localhost:8000
```

API Documentation:

```powershell
venv\Scripts\activate
python smoke_test.py
```

This checks:

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

### Manual API testing

Open:

- `http://127.0.0.1:8000/docs`

### Frontend testing

Once both servers are running, test these pages:

- `/`
- `/profiles`
- `/sign`
- `/voice`
- `/simplify`
- `/image`
- `/call`

## Sign Call on Two Laptops

To test `Sign Call` across two devices:

1. Start the frontend with a reachable LAN host:

```powershell
npm run dev -- --host
```

2. Open the LAN URL from laptop A and laptop B
3. Open `/call` on both laptops
4. Copy the call ID from one laptop
5. Paste it on the other laptop and start the call
6. Allow camera and microphone access on both browsers

Important notes:

- `localhost` only works on the same machine
- both laptops need internet access because PeerJS uses the public broker at `0.peerjs.com`
- some networks may require a TURN server for reliable WebRTC behavior

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/preferences`

### Core APIs

- `POST /api/simplify`
- `POST /api/describe`
- `POST /api/describe/url`
- `POST /api/voice`
- `POST /api/sign/predict`
- `WS /ws/sign`

## Notes

- `GET /` on the backend returning `404` is expected
- image hover descriptions use `/api/describe/url`
- sign detection uses both browser-side processing and `/ws/sign`
- `backend/.env` is intentionally ignored and should not be committed
- frontend builds may show a Vite chunk-size warning; it is non-blocking

## Future Improvements

- Multi-language accessibility support
- Larger sign-language dataset
- Browser extension improvements
- Mobile experience improvements
- More robust WebRTC calling with TURN support

## License

MIT License

## Vision

Technology should empower everyone, regardless of ability. AccessAI aims to build a more inclusive internet using practical AI accessibility tools.
```
http://localhost:8000/docs
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---


# 🔗 Example API

### Simplify Text

**Request**

```
POST /api/simplify
```

```json
{
"text": "The government implemented a comprehensive environmental sustainability initiative.",
"grade_level": 5
}
```

**Response**

```json
{
"simplified": "The government started a plan to protect the environment.",
"word_count_before": 9,
"word_count_after": 8,
"cached": false
}
```

---

# 🧠 AI Models Used

| Feature             | Model                   |
| ------------------- | ----------------------- |
| Text Simplification | FLAN-T5                 |
| Image Captioning    | BLIP                    |
| Speech Recognition  | Whisper                 |
| Sign Language       | Custom TensorFlow model |

---

# 📈 Future Improvements

* Support for multiple languages
* Larger sign language dataset
* Browser extension for universal accessibility
* Mobile app version
* Real-time translation

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---



# ❤️ Vision

> Technology should empower everyone, regardless of ability.

AccessAI aims to build a **more inclusive internet** using AI.
