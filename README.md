# SafeMigrate AI

AI-powered overseas recruitment fraud detection & agency verification platform.
(Alibaba Hackathon Project - Grade 1 Submission)

SafeMigrate AI helps Pakistani job seekers and their families check whether a job
offer, recruitment agency, or WhatsApp message is genuine or a scam - by combining
AI-based scam-pattern detection with cross-verification against government-verified
agency records.

## Project Structure
- backend/    FastAPI backend - APIs for text/image analysis, agency lookup
- frontend/   React (CDN, no build step) - user interface (Urdu/English)
- data/       verified_agencies dataset, scam_patterns dataset
- docs/       Project pack, form answers, delivery plan

## Core Features (MVP)
- Text-based scam check
- Explainable risk scoring (Low/Medium/High)
- Verified agency lookup
- Bilingual results (Urdu/English)
- Community scam reporting

## How to Run
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate
4. pip install -r requirements.txt
5. uvicorn main:app --reload
6. Open frontend/index.html in your browser

## Team
- Member 1: AI/ML Lead + Project Lead
- Member 2: Backend + Data Developer
- Member 3: Frontend/UI + Presentation Lead

## Compliance Note
Risk assessment is advisory only, not legal verification. Users should always
independently confirm with the Bureau of Emigration.
