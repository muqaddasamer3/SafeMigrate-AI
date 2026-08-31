from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, insert_scam_report
from app.risk_engine import analyze_text
from app.ocr_service import extract_text_from_image_bytes
from app.agency_matcher import verify_agency
from app.schemas import (
    TextAnalyzeRequest,
    AnalyzeResponse,
    AgencyVerifyResponse,
    ScamReportRequest,
    ScamReportResponse,
)

app = FastAPI(
    title="SafeMigrate AI - Backend",
    description="AI-powered scam detection & agency verification API for overseas job seekers.",
    version="1.0.0",
)

# Allow the React frontend (Member 3's work) to call this API during dev/demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your deployed frontend URL before final submission
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def health_check():
    return {"status": "ok", "service": "SafeMigrate AI backend"}


@app.post("/api/analyze-text", response_model=AnalyzeResponse)
def analyze_text_endpoint(payload: TextAnalyzeRequest):
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="text field cannot be empty")
    result = analyze_text(payload.text)
    return result


@app.post("/api/analyze-screenshot", response_model=AnalyzeResponse)
async def analyze_screenshot_endpoint(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    image_bytes = await file.read()
    extracted_text = extract_text_from_image_bytes(image_bytes)

    if not extracted_text:
        raise HTTPException(status_code=422, detail="Could not extract any text from the image")

    result = analyze_text(extracted_text)
    result["extracted_text"] = extracted_text  # extra field, useful for debugging/demo
    return result


@app.get("/api/verify-agency", response_model=AgencyVerifyResponse)
def verify_agency_endpoint(name: str = Query(..., min_length=2)):
    match = verify_agency(name)

    if match["is_verified"]:
        message_en = f"'{match['matched_name']}' is a verified agency (License: {match['license_number']})."
        message_ur = f"'{match['matched_name']}' aik verified agency hai (License: {match['license_number']})."
    else:
        message_en = "No verified agency matched this name. Proceed with caution and verify independently."
        message_ur = "Is naam se koi verified agency nahi mili. Ehtiyaat barten aur khud verify karein."

    return {
        "query": name,
        **match,
        "message_en": message_en,
        "message_ur": message_ur,
    }


@app.post("/api/report-scam", response_model=ScamReportResponse)
def report_scam_endpoint(payload: ScamReportRequest):
    if not payload.description or not payload.description.strip():
        raise HTTPException(status_code=400, detail="description field cannot be empty")

    report_id = insert_scam_report(
        payload.reporter_name, payload.agency_name, payload.description, payload.contact_text
    )

    return {
        "id": report_id,
        "status": "received",
        "message_en": "Thank you, your report has been submitted and will help protect others.",
        "message_ur": "Shukriya, aapki report submit ho gayi hai aur doosron ko mehfooz rakhne mein madad karegi.",
    }
