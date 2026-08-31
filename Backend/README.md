# SafeMigrate AI — Backend + Data (Member 2 Deliverable)

FastAPI backend covering everything listed under "Backend" and "Backend + Data Developer"
in the project pack: text scam analysis, screenshot OCR + analysis, agency verification,
and scam report storage.

## 1. Setup

```bash
cd safemigrate_backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

You also need the Tesseract OCR binary installed on your machine (separate from the
Python package):
- Ubuntu/Debian: `sudo apt-get install tesseract-ocr tesseract-ocr-urd`
- Windows: install from https://github.com/UB-Mannheim/tesseract/wiki
- Mac: `brew install tesseract`

## 2. Run

```bash
uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` for interactive Swagger UI (auto-generated —
great for your judges' technical demo).

A SQLite file `safemigrate.db` is created automatically on first run and seeded with
sample agencies from `data/verified_agencies.csv`.

## 3. Your job as Backend + Data Developer — what to do next

1. **Replace `data/verified_agencies.csv` with real data.** The 5 rows in there are
   placeholders so the API runs out of the box — they are NOT real Bureau of Emigration
   records. Go collect the real verified agency list and license numbers and swap this file
   (or write a small script to bulk-import it — the `init_db()` function in
   `app/database.py` already reads this CSV).
2. **Tune `data/scam_patterns.json`** as you and the AI/ML lead find more real scam examples —
   add keywords, adjust weights. This file IS your "scam_patterns" table from the project pack,
   kept as JSON for simplicity instead of a DB table (easy to justify to judges: "reference
   data doesn't need relational storage").
3. **Swap SQLite → PostgreSQL/Firebase** if your team wants that for the final submission —
   only `app/database.py` needs to change, the rest of the app is unaffected.
4. **Give Member 3 (frontend) the API docs** at `/docs` so they can wire up the React UI.

## 4. API Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/analyze-text` | Send pasted job-offer text → get risk score + explanation |
| POST | `/api/analyze-screenshot` | Upload screenshot image → OCR + risk analysis |
| GET | `/api/verify-agency?name=...` | Fuzzy-match agency name against verified DB |
| POST | `/api/report-scam` | Submit a community scam report |

### Example: analyze text
```bash
curl -X POST http://127.0.0.1:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Send upfront fee of 50000 urgent, guaranteed visa, whatsapp only"}'
```

Response:
```json
{
  "risk_score": 90,
  "risk_level": "High",
  "matched_flags": [
    {"keyword": "upfront fee", "category": "payment_pressure", "weight": 30},
    {"keyword": "urgent", "category": "urgency_pressure", "weight": 20},
    {"keyword": "guaranteed visa", "category": "unrealistic_offer", "weight": 25},
    {"keyword": "whatsapp only", "category": "suspicious_contact", "weight": 15}
  ],
  "explanation_en": "This message was flagged as High risk due to: ...",
  "explanation_ur": "Ye message High risk ke tor par flag hua kyunke: ..."
}
```

## 5. Deployment (matches Step 6 of the project pack)

Push this folder to its own GitHub repo (or a `/backend` subfolder), then deploy on
Render.com or Railway.app (both have a free tier, and both auto-detect FastAPI + `requirements.txt`
if you add a `Procfile` with: `web: uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
