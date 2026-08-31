import sqlite3
import csv
import os
from contextlib import contextmanager

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "safemigrate.db")
AGENCIES_CSV = os.path.join(BASE_DIR, "data", "verified_agencies.csv")


def init_db():
    """Create tables (Table 1: verified_agencies, Table 2: scam_reports) and seed sample data."""
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS verified_agencies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                license_number TEXT,
                contact_info TEXT,
                city TEXT,
                status TEXT DEFAULT 'active'
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS scam_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reporter_name TEXT,
                agency_name TEXT,
                description TEXT NOT NULL,
                contact_text TEXT,
                submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

        # Seed agencies only if table is empty
        cur.execute("SELECT COUNT(*) FROM verified_agencies")
        if cur.fetchone()[0] == 0 and os.path.exists(AGENCIES_CSV):
            with open(AGENCIES_CSV, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                rows = [
                    (r["name"], r["license_number"], r["contact_info"], r["city"], r["status"])
                    for r in reader
                ]
            cur.executemany(
                "INSERT INTO verified_agencies (name, license_number, contact_info, city, status) "
                "VALUES (?, ?, ?, ?, ?)",
                rows,
            )
            conn.commit()


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def get_all_agencies():
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM verified_agencies WHERE status = 'active'")
        return [dict(row) for row in cur.fetchall()]


def insert_scam_report(reporter_name, agency_name, description, contact_text):
    with get_conn() as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO scam_reports (reporter_name, agency_name, description, contact_text) "
            "VALUES (?, ?, ?, ?)",
            (reporter_name, agency_name, description, contact_text),
        )
        conn.commit()
        return cur.lastrowid
