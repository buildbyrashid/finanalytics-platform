import os
from pdf2image import convert_from_path
import pytesseract

UPLOAD_PATH = "D:/work-space/Microservices/FinAnalytics/uploads"

def process_pdf(file_key):
    file_path = f"{UPLOAD_PATH}/{file_key}"

    print(f"🔎 Processing PDF: {file_path}")

    pages = convert_from_path(file_path, dpi=200)

    extracted = []

    for page in pages:
        text = pytesseract.image_to_string(page)
        extracted.append(text)

    return extracted
