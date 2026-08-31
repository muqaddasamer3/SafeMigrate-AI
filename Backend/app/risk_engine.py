import json
import os
import re
from app.schemas import RiskFlag

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATTERNS_PATH = os.path.join(BASE_DIR, "data", "scam_patterns.json")

with open(PATTERNS_PATH, encoding="utf-8") as f:
    SCAM_PATTERNS = json.load(f)


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()
    return text


def analyze_text(raw_text: str):
    text = clean_text(raw_text)
    matched_flags = []
    total_score = 0

    for category, data in SCAM_PATTERNS.items():
        weight = data["weight"]
        for keyword in data["keywords"]:
            if keyword.lower() in text:
                matched_flags.append(RiskFlag(keyword=keyword, category=category, weight=weight))
                total_score += weight

    # extra heuristic: large numeric salary claims (e.g. "500000" or "5,00,000")
    if re.search(r"\b\d{6,}\b", text) or re.search(r"\d{1,3}(,\d{2,3}){2,}", text):
        matched_flags.append(RiskFlag(keyword="unusually large salary figure", category="unrealistic_salary", weight=15))
        total_score += 15

    total_score = min(total_score, 100)  # cap at 100

    if total_score >= 60:
        level = "High"
    elif total_score >= 30:
        level = "Medium"
    else:
        level = "Low"

    explanation_en, explanation_ur = _build_explanations(matched_flags, level)

    return {
        "risk_score": total_score,
        "risk_level": level,
        "matched_flags": matched_flags,
        "explanation_en": explanation_en,
        "explanation_ur": explanation_ur,
    }


def _build_explanations(flags, level):
    if not flags:
        return (
            "No known scam indicators were detected in this text. This does not guarantee "
            "the offer is genuine — always verify the agency independently.",
            "Is text mein koi jaani-pehchani scam nishani nahi mili. Iska matlab ye nahi ke offer "
            "yakeenan sahi hai — agency ko khud b verify zaroor karein.",
        )

    categories = sorted(set(f.category for f in flags))
    readable = {
        "payment_pressure": "requests for upfront payment or advance fees",
        "urgency_pressure": "pressure to act urgently or decide immediately",
        "unrealistic_offer": "unrealistic guarantees (e.g. guaranteed visa/job)",
        "document_risk": "requests for sensitive documents or codes",
        "suspicious_contact": "suspicious or informal-only contact channels",
        "unrealistic_salary": "unrealistic or exaggerated salary claims",
    }
    ur_readable = {
        "payment_pressure": "pehle se fee ya payment ka mutalba",
        "urgency_pressure": "jaldi faisla lene ka dabao",
        "unrealistic_offer": "ghair-haqeeqi guarantee (jaise guaranteed visa/job)",
        "document_risk": "hassas documents ya codes maangna",
        "suspicious_contact": "sirf ghair-rasmi contact tareeqa",
        "unrealistic_salary": "ghair-haqeeqi ya barhi hui salary ka dawa",
    }

    en_list = ", ".join(readable.get(c, c) for c in categories)
    ur_list = "، ".join(ur_readable.get(c, c) for c in categories)

    explanation_en = f"This message was flagged as {level} risk due to: {en_list}."
    explanation_ur = f"Ye message {level} risk ke tor par flag hua kyunke: {ur_list}."
    return explanation_en, explanation_ur
