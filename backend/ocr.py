from PIL import Image
import pytesseract
import io

# UNCOMMENT the line below ONLY if you get a "tesseract not found" error on Windows.
# Update the path if you installed Tesseract somewhere else.
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_from_image_bytes(image_bytes: bytes) -> str:
    """Takes raw image bytes (from an uploaded file) and returns extracted text."""
    image = Image.open(io.BytesIO(image_bytes))

    # Basic preprocessing: convert to grayscale for better OCR accuracy
    image = image.convert("L")

    text = pytesseract.image_to_string(image, lang="eng")
    return text.strip()
