from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import csv
import os
from datetime import datetime

from risk_engine import analyze_text, check_agency
from classifier import classify_text
from ocr import extract_text_from_image_bytes

app = FastAPI(title="SafeMigrate AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPORTS_FILE = os.path.join(BASE_DIR, "data", "scam_reports.csv")


class TextCheckRequest(BaseModel):
    text: str


class ScamReportRequest(BaseModel):
    agency_name: Optional[str] = ""
    description: str


@app.get("/")
def root():
    return {"status": "SafeMigrate AI API is running"}


@app.post("/check-text")
def check_text(payload: TextCheckRequest):
    result = analyze_text(payload.text)

    ml_label, ml_confidence = classify_text(payload.text)
    result["ml_prediction"] = {"label": ml_label, "confidence": ml_confidence}

    return result


@app.post("/check-image")
async def check_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    extracted_text = extract_text_from_image_bytes(image_bytes)

    if not extracted_text:
        return {
            "extracted_text": "",
            "error": "No text could be extracted from this image. Try a clearer screenshot.",
        }

    result = analyze_text(extracted_text)
    ml_label, ml_confidence = classify_text(extracted_text)
    result["ml_prediction"] = {"label": ml_label, "confidence": ml_confidence}
    result["extracted_text"] = extracted_text

    return result


@app.get("/check-agency")
def check_agency_endpoint(name: str):
    result = check_agency(name)
    return result


@app.post("/report-scam")
def report_scam(payload: ScamReportRequest):
    file_exists = os.path.isfile(REPORTS_FILE)
    with open(REPORTS_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["report_id", "agency_name", "description", "date_reported", "status"])
        report_id = f"RPT{int(datetime.now().timestamp())}"
        writer.writerow([report_id, payload.agency_name, payload.description,
                          datetime.now().isoformat(), "Under Review"])
    return {"status": "success", "message": "Report submitted for review."}
