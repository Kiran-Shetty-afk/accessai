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
python -m uvicorn main:app --reload
```

Backend will start at:

```
http://localhost:8000
```

API Documentation:

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
