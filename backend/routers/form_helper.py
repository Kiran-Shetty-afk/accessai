import asyncio
import hashlib
import json
import os
import re
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter()

HF_URL = "https://router.huggingface.co/v1/chat/completions"
HF_HEADERS = {"Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"}
HF_MODEL = os.getenv("HF_TEXT_MODEL", "Qwen/Qwen2.5-72B-Instruct:novita")

DOCUMENT_KEYWORDS = (
    "id",
    "identity",
    "proof",
    "passport",
    "license",
    "certificate",
    "affidavit",
    "witness",
    "statement",
    "utility bill",
    "document",
    "record",
    "report",
    "bank statement",
    "income proof",
)

FIELD_HINTS = {
    "full name": ("Your legal name", "Use the same name that appears on your official documents."),
    "name": ("Your name", "Write your full name clearly."),
    "date of birth": ("Your birthday", "Use the date format requested by the form."),
    "address": ("Where you live", "Include the full address the form asks for."),
    "phone": ("Your phone number", "Add the number where the reviewer can reach you."),
    "email": ("Your email address", "Use an email address you check often."),
    "signature": ("Your signature", "Sign exactly where the form tells you to sign."),
    "date": ("The requested date", "Check whether the form wants today's date or an event date."),
    "income": ("Income details", "Have payslips, statements, or proof of income ready."),
    "guardian": ("Guardian or caregiver details", "Prepare the helper's contact details if the form asks for them."),
}


def compact_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def unique_items(items):
    seen = set()
    result = []
    for item in items:
        cleaned = compact_text(item).strip(" -")
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        result.append(cleaned)
    return result


def extract_json_object(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()
    match = re.search(r"\{.*\}", cleaned, re.S)
    return match.group(0) if match else cleaned


def fallback_form_help(text: str, context: Optional[str] = None):
    clean = text.strip()
    flat = compact_text(clean)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", flat) if s.strip()]
    lines = [compact_text(line) for line in clean.splitlines() if compact_text(line)]
    lower = flat.lower()

    summary_parts = sentences[:2] or lines[:2]
    summary = " ".join(summary_parts).strip()
    if not summary:
        summary = "This form asks for personal details and supporting information before it can be reviewed."
    if context:
        summary = f"{summary} Context to keep in mind: {compact_text(context)}"

    fields = []
    for line in lines:
        if ":" not in line:
            continue
        label, detail = line.split(":", 1)
        field_name = compact_text(label).strip(" -*")
        if len(field_name) < 2 or len(field_name) > 40 or len(field_name.split()) > 6:
            continue
        explanation, what_to_prepare = FIELD_HINTS.get(
            field_name.lower(),
            (
                f"This section is asking for {field_name.lower()}.",
                detail.strip() or "Prepare the information or document mentioned beside this field.",
            ),
        )
        fields.append(
            {
                "field": field_name.title(),
                "explanation": explanation,
                "what_to_prepare": what_to_prepare,
            }
        )

    if not fields:
        for keyword, (explanation, what_to_prepare) in FIELD_HINTS.items():
            if keyword in lower:
                fields.append(
                    {
                        "field": keyword.title(),
                        "explanation": explanation,
                        "what_to_prepare": what_to_prepare,
                    }
                )
        if not fields:
            fields = [
                {
                    "field": "Personal Details",
                    "explanation": "The form will likely ask for your basic identifying information.",
                    "what_to_prepare": "Keep names, dates, contact details, and any reference numbers nearby.",
                }
            ]

    documents = []
    for part in lines + re.split(r"[.;]", flat):
        piece = compact_text(part)
        if any(keyword in piece.lower() for keyword in DOCUMENT_KEYWORDS):
            documents.append(piece)
    documents = unique_items(documents)
    if not documents:
        documents = [
            "Check whether the form asks for proof of identity, address, income, or signed statements.",
        ]

    steps = []
    if fields:
        steps.append("Read the whole form once before you start filling anything in.")
        steps.append(f"Complete the {fields[0]['field']} section carefully and match your documents exactly.")
    if len(fields) > 1:
        steps.append("Work through the remaining sections one by one so you do not miss any required details.")
    if documents:
        steps.append("Gather the supporting documents before you submit the form.")
    steps.append("Review all answers, sign where needed, and submit before any deadline.")
    steps = unique_items(steps)

    warnings = []
    if any(word in lower for word in ("must", "required", "mandatory", "need to")):
        warnings.append("Some parts of this form appear to be required, so blank sections may delay approval.")
    if any(word in lower for word in ("deadline", "due", "within", "before")):
        warnings.append("Check the submission deadline carefully.")
    if any(word in lower for word in ("signature", "sign", "signed")):
        warnings.append("Make sure every required signature is completed.")
    if any(word in lower for word in ("witness", "notary", "notarised", "notarized")):
        warnings.append("This form may need witness or notary support before submission.")
    warnings = unique_items(warnings)
    if not warnings:
        warnings = ["Review the instructions twice so you do not miss a required field or document."]

    return {
        "summary": summary,
        "steps": steps[:5],
        "fields": fields[:6],
        "documents": documents[:6],
        "warnings": warnings[:4],
    }


def normalize_form_help(data, fallback):
    fields = []
    for item in data.get("fields", []):
        if not isinstance(item, dict):
            continue
        field = compact_text(str(item.get("field", "")))
        explanation = compact_text(str(item.get("explanation", "")))
        what_to_prepare = compact_text(str(item.get("what_to_prepare", "")))
        if not field:
            continue
        fields.append(
            {
                "field": field,
                "explanation": explanation or "This field needs a clear answer.",
                "what_to_prepare": what_to_prepare or "Prepare the information requested by the form.",
            }
        )

    merged = {
        "summary": compact_text(str(data.get("summary", ""))) or fallback["summary"],
        "steps": unique_items([str(item) for item in data.get("steps", [])]) or fallback["steps"],
        "fields": fields or fallback["fields"],
        "documents": unique_items([str(item) for item in data.get("documents", [])]) or fallback["documents"],
        "warnings": unique_items([str(item) for item in data.get("warnings", [])]) or fallback["warnings"],
    }
    return merged


async def call_hf_form_helper(text: str, context: Optional[str] = None):
    payload = {
        "model": HF_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You explain difficult forms in plain language. Return strict JSON only "
                    "with keys summary, steps, fields, documents, warnings. "
                    "steps/documents/warnings must be arrays of short strings. "
                    "fields must be an array of objects with field, explanation, what_to_prepare."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Explain this form so a disabled user can understand what it asks for.\n\n"
                    f"Context: {context or 'No extra context provided.'}\n\n"
                    f"Form text:\n{text}"
                ),
            },
        ],
        "max_tokens": 900,
        "temperature": 0.2,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(HF_URL, headers=HF_HEADERS, json=payload)

    if response.status_code == 503:
        await asyncio.sleep(20)
        return await call_hf_form_helper(text, context)

    if response.status_code != 200:
        detail = response.text[:300].replace("\n", " ")
        raise HTTPException(status_code=502, detail=f"HuggingFace error: {detail}")

    body = response.json()
    message = body["choices"][0]["message"]
    content = (message.get("content") or message.get("reasoning_content") or "").strip()
    return json.loads(extract_json_object(content))


@router.post("/form-helper", response_model=schemas.FormHelperResponse)
async def form_helper(body: schemas.FormHelperRequest, db: Session = Depends(get_db)):
    if len(body.text) > 7000:
        raise HTTPException(status_code=400, detail="Form text exceeds 7000 character limit")

    cache_key = hashlib.sha256(
        f"form_helper:{body.context or ''}:{body.text}".encode()
    ).hexdigest()
    cached = db.query(models.APICache).filter(models.APICache.input_hash == cache_key).first()
    if cached:
        cached_payload = json.loads(cached.output_text)
        return schemas.FormHelperResponse(**cached_payload, cached=True)

    fallback = fallback_form_help(body.text, body.context)
    payload = fallback

    if os.getenv("HF_API_TOKEN"):
        try:
            ai_payload = await call_hf_form_helper(body.text, body.context)
            payload = normalize_form_help(ai_payload, fallback)
        except Exception:
            payload = fallback

    db.add(
        models.APICache(
            input_hash=cache_key,
            endpoint="form_helper",
            output_text=json.dumps(payload),
        )
    )
    db.commit()

    return schemas.FormHelperResponse(**payload, cached=False)
