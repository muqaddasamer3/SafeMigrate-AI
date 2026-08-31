from pydantic import BaseModel, Field
from typing import Optional, List


class TextAnalyzeRequest(BaseModel):
    text: str = Field(..., description="Job offer text, message, or OCR output to analyze")


class RiskFlag(BaseModel):
    keyword: str
    category: str
    weight: int


class AnalyzeResponse(BaseModel):
    risk_score: int
    risk_level: str  # Low / Medium / High
    matched_flags: List[RiskFlag]
    explanation_en: str
    explanation_ur: str


class AgencyVerifyResponse(BaseModel):
    query: str
    matched_name: Optional[str] = None
    is_verified: bool
    match_confidence: float
    license_number: Optional[str] = None
    contact_info: Optional[str] = None
    city: Optional[str] = None
    message_en: str
    message_ur: str


class ScamReportRequest(BaseModel):
    reporter_name: Optional[str] = None
    agency_name: Optional[str] = None
    description: str
    contact_text: Optional[str] = None


class ScamReportResponse(BaseModel):
    id: int
    status: str
    message_en: str
    message_ur: str
