"""
BEOE Verified Agencies Scraper
------------------------------
Run this on YOUR OWN computer (not in a sandboxed environment), since beoe.gov.pk
blocks requests coming from data-center/cloud IPs.

Usage:
    pip install requests beautifulsoup4
    python scrape_beoe_agencies.py

Output: verified_agencies_real.csv  (same columns as the sample file, ready to
drop straight into safemigrate_backend/data/verified_agencies.csv)

NOTE: Always re-check the site's robots.txt / terms before scraping, and add a
delay between requests (already included below) to avoid hammering a government
server. If BEOE ever publishes an official downloadable/CSV export or an API,
prefer that over scraping.
"""

import csv
import time
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://beoe.gov.pk/list-of-oeps"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
}
OUTPUT_FILE = "verified_agencies_real.csv"
DELAY_SECONDS = 1.5  # be polite to a government server


def scrape_page(page_number: int):
    """
    Fetches one page of the OEP list and returns a list of dicts.
    NOTE: You WILL likely need to inspect the actual page HTML (right-click ->
    Inspect in your browser) and adjust the CSS selectors below — table/row
    structure on gov sites changes often and I can't verify it from here since
    the site is unreachable from my sandbox.
    """
    params = {"show": "active", "page": page_number}
    resp = requests.get(BASE_URL, headers=HEADERS, params=params, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    rows = []
    table = soup.find("table")
    if not table:
        return rows

    for tr in table.find_all("tr")[1:]:  # skip header row
        cells = [td.get_text(strip=True) for td in tr.find_all("td")]
        if not cells:
            continue
        # Adjust these indices once you've inspected the real column order
        rows.append({
            "name": cells[1] if len(cells) > 1 else "",
            "license_number": cells[2] if len(cells) > 2 else "",
            "contact_info": cells[3] if len(cells) > 3 else "",
            "city": cells[4] if len(cells) > 4 else "",
            "status": "active",
        })
    return rows


def main():
    all_rows = []
    page = 1
    while True:
        print(f"Scraping page {page}...")
        rows = scrape_page(page)
        if not rows:
            print("No more rows found — stopping.")
            break
        all_rows.extend(rows)
        page += 1
        time.sleep(DELAY_SECONDS)

        # Safety cap so a selector bug can't loop forever
        if page > 60:
            break

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "license_number", "contact_info", "city", "status"])
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"Done. Saved {len(all_rows)} agencies to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
