import io
from PIL import Image
import pytesseract


def extract_text_from_image_bytes(image_bytes: bytes) -> str:
    """
    Extract text from a screenshot (job offer / WhatsApp message screenshot).
    Requires the tesseract binary to be installed on the host system:
      Ubuntu/Debian: sudo apt-get install tesseract-ocr
      Windows: install from https://github.com/UB-Mannheim/tesseract/wiki
    For Urdu screenshots, also install: sudo apt-get install tesseract-ocr-urd
    """
    image = Image.open(io.BytesIO(image_bytes))

    # Try English first; fall back to English+Urdu if available for bilingual screenshots
    try:
        text = pytesseract.image_to_string(image, lang="eng+urd")
    except pytesseract.TesseractError:
        text = pytesseract.image_to_string(image, lang="eng")

    return text.strip()
