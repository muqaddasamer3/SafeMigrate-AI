import csv, re

CITY_MAP = {
    "RWP": "Rawalpindi", "LHR": "Lahore", "KAR": "Karachi",
    "PEW": "Peshawar", "PSH": "Peshawar", "QTA": "Quetta",
    "MLK": "Malakand", "MUL": "Multan", "SKT": "Sialkot",
    "DGK": "D.G. Khan", "SUK": "Sukkur", "ABT": "Abbottabad",
    "GRT": "Gujrat", "GRW": "Gujranwala", "ISB": "Islamabad",
    "FSD": "Faisalabad",
}

path = "data/verified_agencies.csv"
rows = []
with open(path, encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        raw = row["license_number"]
        m = re.match(r"\s*(\d+)\s*/\s*([A-Za-z]{2,5})", raw)
        if m:
            number, code = m.group(1), m.group(2).upper()
            row["license_number"] = f"{number} / {code}"
            row["city"] = CITY_MAP.get(code, row.get("city", ""))
        rows.append(row)

with open(path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Cleaned {len(rows)} rows.")

