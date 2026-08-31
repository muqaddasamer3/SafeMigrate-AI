"""
SafeMigrate AI - Risk Engine
Rule-based scam-pattern detection + risk scoring.
"""

import csv
import os
import re
from difflib import SequenceMatcher

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")


def load_scam_patterns():
    patterns = []
    path = os.path.join(DATA_DIR, "scam_patterns.csv")
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            patterns.append({
                "pattern_id": row["pattern_id"],
                "phrase": row["phrase"].lower().strip(),
                "category": row["category"],
                "risk_weight": float(row["risk_weight"]),
            })
    return patterns


def load_verified_agencies():
    agencies = []
    path = os.path.join(DATA_DIR, "verified_agencies.csv")
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            agencies.append(row)
    return agencies


SCAM_PATTERNS = load_scam_patterns()
VERIFIED_AGENCIES = load_verified_agencies()


def clean_text(text):
    text = text.lower()
    text = re.sub(r"\s+", " ", text).strip()
    return text


def detect_red_flags(text):
    cleaned = clean_text(text)
    matches = []
    for pattern in SCAM_PATTERNS:
        if pattern["phrase"] in cleaned:
            matches.append({
                "phrase": pattern["phrase"],
                "category": pattern["category"],
                "risk_weight": pattern["risk_weight"],
            })

    salary_match = re.search(r"(\$|usd|dollars?)\s?([\d,]{4,})", cleaned)
    if salary_match:
        matches.append({
            "phrase": salary_match.group(0),
            "category": "unrealistic_salary",
            "risk_weight": 0.5,
        })

    return matches


def calculate_risk_score(matches):
    if not matches:
        return 0, "Low"

    total_weight = sum(m["risk_weight"] for m in matches)
    score = min(100, round(total_weight * 35))

    if score < 30:
        label = "Low"
    elif score < 65:
        label = "Medium"
    else:
        label = "High"

    return score, label


def similar(a, b):
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def check_agency(name):
    if not name:
        return None

    best_match = None
    best_score = 0.0
    for agency in VERIFIED_AGENCIES:
        score = similar(name, agency["agency_name"])
        if score > best_score:
            best_score = score
            best_match = agency

    if best_match and best_score >= 0.6:
        return {
            "matched": True,
            "confidence": round(best_score, 2),
            "agency_name": best_match["agency_name"],
            "license_number": best_match["license_number"],
            "status": best_match["status"],
            "contact_info": best_match["contact_info"],
            "city": best_match["city"],
        }

    return {"matched": False, "confidence": round(best_score, 2)}


def analyze_text(text):
    matches = detect_red_flags(text)
    score, label = calculate_risk_score(matches)

    reasons_en = [f"Detected: '{m['phrase']}' ({m['category'].replace('_', ' ')})" for m in matches]
    reasons_ur = [f"'{m['phrase']}' ({m['category'].replace('_', ' ')}) detect hua" for m in matches]

    if label == "Low":
        message_en = "This Looks Safe"
        message_ur = "Ye theek lagta hai"
    elif label == "Medium":
        message_en = "Caution - Some Warning Signs Found"
        message_ur = "Khabardar - Kuch warning signs milay hain"
    else:
        message_en = "Warning - High Risk of Scam"
        message_ur = "Warning - Zyada Scam Ka Khadsha Hai"

    return {
        "risk_score": score,
        "risk_label": label,
        "message_en": message_en,
        "message_ur": message_ur,
        "red_flags": matches,
        "reasons_en": reasons_en,
        "reasons_ur": reasons_ur,
        "next_steps_en": [
            "Independently verify the agency with the Bureau of Emigration.",
            "Never send money or documents before verification is complete.",
            "Report this offer if you believe it is a scam.",
        ],
        "next_steps_ur": [
            "Bureau of Emigration se agency ko khud verify karein.",
            "Verification se pehle paise ya documents na bhejein.",
            "Agar scam lagta hai to report karein.",
        ],
    }
