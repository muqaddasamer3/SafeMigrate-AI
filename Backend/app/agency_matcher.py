from difflib import SequenceMatcher
from app.database import get_all_agencies


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def verify_agency(query_name: str, threshold: float = 0.72):
    """
    Matches the user-provided agency name against verified_agencies table.
    Uses fuzzy string matching so small spelling mistakes are still caught
    (upgrade path: swap SequenceMatcher for rapidfuzz.fuzz.token_sort_ratio
    if you need better accuracy on longer/reordered names).
    """
    agencies = get_all_agencies()
    best_match = None
    best_score = 0.0

    for agency in agencies:
        score = _similarity(query_name, agency["name"])
        if score > best_score:
            best_score = score
            best_match = agency

    if best_match and best_score >= threshold:
        return {
            "matched_name": best_match["name"],
            "is_verified": True,
            "match_confidence": round(best_score, 2),
            "license_number": best_match["license_number"],
            "contact_info": best_match["contact_info"],
            "city": best_match["city"],
        }

    return {
        "matched_name": best_match["name"] if best_match else None,
        "is_verified": False,
        "match_confidence": round(best_score, 2),
        "license_number": None,
        "contact_info": None,
        "city": None,
    }
