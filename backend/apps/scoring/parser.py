import os
import re
import unicodedata

import pdfplumber
from docx import Document


def normalize_text(text: str) -> str:
    text = text.lower()
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_text_from_pdf(path: str) -> str:
    parts = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                parts.append(page_text)
    text = '\n'.join(parts)
    if not text.strip():
        raise ValueError('Impossible d\'extraire le texte du PDF. Le CV est peut-être scanné (image).')
    return normalize_text(text)


def extract_text_from_docx(path: str) -> str:
    doc = Document(path)
    parts = [p.text for p in doc.paragraphs if p.text.strip()]
    text = '\n'.join(parts)
    if not text.strip():
        raise ValueError('Le fichier DOCX ne contient pas de texte extractible.')
    return normalize_text(text)


def extract_text_from_cv(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    if ext in ('.docx', '.doc'):
        return extract_text_from_docx(file_path)
    raise ValueError(f'Format de fichier non supporté : {ext}')
