from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from PyPDF2 import PdfReader

app = Flask(__name__)
CORS(app)

SKILLS = [
    "python", "java", "c++", "sql", "machine learning",
    "data science", "react", "flask", "django",
    "html", "css", "javascript"
]

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def extract_text_from_pdf(filepath):
    try:
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
        return text
    except:
        return ""

@app.route("/analyze", methods=["POST"])
def analyze_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not (file.filename.endswith(".txt") or file.filename.endswith(".pdf")):
        return jsonify({"error": "Only .txt or .pdf files allowed"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Extract text
    if file.filename.endswith(".txt"):
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
    else:  # PDF
        text = extract_text_from_pdf(filepath)

    text = text.lower()
    words = text.split()
    word_count = len(words)

    skills_found = [skill for skill in SKILLS if skill in text]
    missing_skills = list(set(SKILLS) - set(skills_found))

    # Resume strength
    if word_count < 300:
        resume_level = "Basic"
    elif word_count < 700:
        resume_level = "Intermediate"
    else:
        resume_level = "Strong"

    return jsonify({
        "word_count": word_count,
        "skills_found": skills_found,
        "missing_skills": missing_skills,
        "resume_level": resume_level
    })

if __name__ == "__main__":
    app.run(debug=True)
