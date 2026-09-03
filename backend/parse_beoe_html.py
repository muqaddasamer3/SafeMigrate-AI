"""
SafeMigrate AI - BEOE HTML Parser
Parses saved HTML files from beoe.gov.pk/list-of-oeps into verified_agencies.csv format.

Usage:
    python Backend/parse_beoe_html.py                          # default: data/beoe_pages/
    python Backend/parse_beoe_html.py --input path/to/html/    # custom input directory
    python Backend/parse_beoe_html.py --dry-run                # preview without writing
"""

import argparse
import csv
import os
import re
import sys
from datetime import datetime

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("ERROR: beautifulsoup4 is not installed.")
    print("Run:  pip install beautifulsoup4")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DEFAULT_INPUT_DIR = os.path.join(PROJECT_ROOT, "data", "beoe_pages")
OUTPUT_CSV = os.path.join(PROJECT_ROOT, "data", "verified_agencies.csv")

# ---------------------------------------------------------------------------
# Column mapping configuration
# ---------------------------------------------------------------------------
# Maps normalised BEOE header fragments (lowercase, stripped) to our CSV
# column names.  Order matters - first match wins, so more specific patterns
# come before generic ones.
HEADER_PATTERNS = [
    # (substring to look for in lowered header, our CSV column)
    # More specific patterns MUST come before generic ones
    ("licence no", "license_number"),
    ("license no", "license_number"),
    ("licence number", "license_number"),
    ("license number", "license_number"),
    ("lic#", "license_number"),
    ("s.no", "_sr"),
    ("s#", "_sr"),
    ("sr.", "_sr"),
    # Proprietor/owner MUST come before generic 'name' pattern
    ("proprietor", "proprietor"),
    ("owner", "proprietor"),
    # Agency name patterns (after proprietor to avoid false match)
    ("name of oep", "agency_name"),
    ("licence title", "agency_name"),
    ("license title", "agency_name"),
    ("agency name", "agency_name"),
    ("oep name", "agency_name"),
    ("title", "agency_name"),
    ("name", "agency_name"),
    ("status", "status"),
    ("expiry", "expiry_date"),
    ("valid", "expiry_date"),
    ("address", "address"),
    ("contact", "contact_info"),
    ("phone", "contact_info"),
    ("tel", "contact_info"),
    ("mobile", "contact_info"),
    ("city", "city"),
    ("district", "city"),
    ("region", "city"),
    ("email", "email"),
    ("e-mail", "email"),
]

# Fields required in the final CSV
CSV_COLUMNS = ["agency_id", "agency_name", "license_number", "status", "contact_info", "city"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def normalise(text):
    """Lowercase, collapse whitespace, strip punctuation edges."""
    text = re.sub(r"\s+", " ", text).strip().lower()
    text = text.strip(":.-# ")
    return text


def map_header(raw_header):
    """Return the CSV column name for a given raw header text, or None."""
    h = normalise(raw_header)
    for pattern, col in HEADER_PATTERNS:
        if pattern in h:
            return col
    return None


def find_data_table(soup):
    """
    Heuristic: find the <table> most likely to contain agency data.
    Strategy: pick the table with the most <tr> rows that has a <th> header row.
    Falls back to the largest table overall.
    """
    tables = soup.find_all("table")
    if not tables:
        return None, []

    best_table = None
    best_score = -1

    for table in tables:
        rows = table.find_all("tr")
        has_header = bool(table.find_all("th"))
        score = len(rows) * 2 + (10 if has_header else 0)
        if score > best_score:
            best_score = score
            best_table = table

    if best_table is None:
        return None, []

    return best_table, best_table.find_all("tr")


def extract_headers_and_rows(table, rows):
    """
    Return (mapped_headers dict {col_index: csv_col_name}, data_rows list).
    Handles both <th>-based and first-<tr>-based headers.
    """
    if not rows:
        return {}, []

    # Determine header row
    header_row = None
    data_start = 0
    first_ths = rows[0].find_all("th")
    if first_ths:
        header_row = first_ths
        data_start = 1
    else:
        # Assume first row is header even if using <td>
        header_row = rows[0].find_all(["td", "th"])
        data_start = 1

    if not header_row:
        return {}, []

    # Build column-index -> csv-column mapping
    col_map = {}
    for idx, cell in enumerate(header_row):
        mapped = map_header(cell.get_text())
        if mapped:
            col_map[idx] = mapped

    # Parse data rows
    parsed_rows = []
    for row in rows[data_start:]:
        cells = row.find_all(["td", "th"])
        if not cells:
            continue
        record = {}
        for idx, cell in enumerate(cells):
            if idx in col_map:
                record[col_map[idx]] = cell.get_text(strip=True)
        # Skip rows that are clearly empty / separators
        if any(v for v in record.values() if v):
            parsed_rows.append(record)

    return col_map, parsed_rows


def clean_phone(raw):
    """Keep digits and dashes, collapse to a reasonable phone string."""
    cleaned = re.sub(r"[^\d\-\+\s]", "", raw).strip()
    cleaned = re.sub(r"\s+", "-", cleaned)
    return cleaned


def clean_status(raw):
    """Normalise status values."""
    r = raw.strip().lower()
    if r in ("active", "valid", "approved", "running"):
        return "Active"
    if r in ("suspended", "cancelled", "revoked", "expired", "invalid", "closed", "blacklisted"):
        return "Suspended"
    return raw.strip().title() if raw.strip() else "Unknown"


def generate_agency_id(index):
    return "AG{:03d}".format(index)


# ---------------------------------------------------------------------------
# Main parse logic
# ---------------------------------------------------------------------------
def parse_html_file(filepath):
    """Parse a single HTML file and return a list of agency dicts."""
    with open(filepath, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f, "html.parser")

    table, rows = find_data_table(soup)
    if table is None:
        print("  [SKIP] No <table> found in {}".format(os.path.basename(filepath)))
        return []

    col_map, parsed_rows = extract_headers_and_rows(table, rows)
    if not col_map:
        print("  [SKIP] Could not map any headers in {}".format(os.path.basename(filepath)))
        return []

    print("  [OK]   {}: {} rows, mapped columns: {}".format(
        os.path.basename(filepath), len(parsed_rows), list(set(col_map.values()))))

    agencies = []
    for rec in parsed_rows:
        lic = rec.get("license_number", "").strip()
        name = rec.get("agency_name", "").strip()
        if not lic and not name:
            continue

        agency = {
            "agency_name": name,
            "license_number": lic,
            "status": clean_status(rec.get("status", "")),
            "contact_info": clean_phone(rec.get("contact_info", "")),
            "city": rec.get("city", "").strip(),
        }
        agencies.append(agency)

    return agencies


def run(input_dir, dry_run):
    # Collect HTML files
    if not os.path.isdir(input_dir):
        print("ERROR: Input directory does not exist: {}".format(input_dir))
        sys.exit(1)

    html_files = sorted(
        f for f in os.listdir(input_dir)
        if f.lower().endswith((".html", ".htm"))
    )

    if not html_files:
        print("No HTML files found in {}".format(input_dir))
        sys.exit(0)

    print("Found {} HTML file(s) in {}\n".format(len(html_files), input_dir))

    # Parse all files
    all_agencies = []
    for fname in html_files:
        path = os.path.join(input_dir, fname)
        agencies = parse_html_file(path)
        all_agencies.extend(agencies)

    print("\nTotal raw agencies extracted: {}".format(len(all_agencies)))

    # Deduplicate by license_number (keep first occurrence)
    seen_keys = set()
    unique_agencies = []
    for ag in all_agencies:
        key = ag["license_number"].strip().upper()
        if not key:
            # Fall back to name-based dedup
            key = ag["agency_name"].strip().upper()
        if key and key in seen_keys:
            continue
        if key:
            seen_keys.add(key)
        unique_agencies.append(ag)

    # Sort by license_number for stable output
    unique_agencies.sort(key=lambda a: a.get("license_number", ""))

    # Assign sequential agency_id
    for idx, ag in enumerate(unique_agencies, start=1):
        ag["agency_id"] = generate_agency_id(idx)

    print("Total unique agencies after dedup: {}".format(len(unique_agencies)))

    # Show preview
    print("\n--- Preview (first 10 rows) ---")
    print(",".join(CSV_COLUMNS))
    for ag in unique_agencies[:10]:
        print(",".join(ag.get(c, "") for c in CSV_COLUMNS))
    if len(unique_agencies) > 10:
        print("... and {} more rows".format(len(unique_agencies) - 10))
    print("--- End preview ---\n")

    if dry_run:
        print("[DRY RUN] No files were written.")
        return

    # Backup existing CSV
    if os.path.isfile(OUTPUT_CSV):
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = "verified_agencies_backup_{}.csv".format(ts)
        backup_path = os.path.join(os.path.dirname(OUTPUT_CSV), backup_name)
        with open(OUTPUT_CSV, "r", encoding="utf-8") as src:
            with open(backup_path, "w", encoding="utf-8", newline="") as dst:
                dst.write(src.read())
        print("Backed up existing CSV to: {}".format(backup_path))

    # Write output
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for ag in unique_agencies:
            writer.writerow({c: ag.get(c, "") for c in CSV_COLUMNS})

    print("Wrote {} agencies to: {}".format(len(unique_agencies), OUTPUT_CSV))


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Parse saved BEOE HTML pages into verified_agencies.csv"
    )
    parser.add_argument(
        "--input", "-i",
        default=DEFAULT_INPUT_DIR,
        help="Directory containing saved HTML files (default: {})".format(DEFAULT_INPUT_DIR),
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Preview extracted data without writing to CSV",
    )
    args = parser.parse_args()
    run(args.input, args.dry_run)


if __name__ == "__main__":
    main()
