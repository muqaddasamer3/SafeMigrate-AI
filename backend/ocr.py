from PIL import Image
import pytesseract
import io

# Tesseract ka exact install path (Windows par ye default location hai)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_from_image_bytes(image_bytes: bytes) -> str:
    """Takes raw image bytes (from an uploaded file) and returns extracted text."""
    image = Image.open(io.BytesIO(image_bytes))

    # Basic preprocessing: convert to grayscale for better OCR accuracy
    image = image.convert("L")

    text = pytesseract.image_to_string(image, lang="eng")
    return text.strip()


# Quick test block — isay file ke bilkul aakhir mein rehne do
if __name__ == "__main__":
    with open("test_image.png", "rb") as f:
        image_bytes = f.read()
    result = extract_text_from_image_bytes(image_bytes)
    print("----- EXTRACTED TEXT -----")
    print(result)
