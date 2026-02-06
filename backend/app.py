from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from PyPDF2 import PdfReader
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

SKILLS = [
    "python", "java", "c++", "sql", "machine learning",
    "data science", "react", "flask", "django",
    "html", "css", "javascript"
]

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def extract_text_from_pdf(filepath):
    try:
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + " "
        return text
    except:
        return ""


def get_ai_resume_feedback(resume_text):
    prompt = f"""
    You are a professional ATS resume reviewer.

    Analyze the resume below and give:
    1. Overall resume strength
    2. 3 improvements
    3. ATS optimization tips
    4. Missing sections if any

    Resume:
    {resume_text[:3500]}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text if response.text else ""


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    print("✅ /analyze endpoint hit")

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith((".txt", ".pdf")):
        return jsonify({"error": "Only .txt or .pdf files allowed"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # 🔹 Extract text
    if file.filename.endswith(".txt"):
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        text = extract_text_from_pdf(filepath)

    print("🧠 Text extracted, length:", len(text))

    # 🔹 Text processing
    text = text.lower()
    words = text.split()
    word_count = len(words)

    skills_found = [skill for skill in SKILLS if skill in text]
    missing_skills = list(set(SKILLS) - set(skills_found))

    # 🔹 Resume strength
    if word_count < 300:
        resume_level = "Basic"
    elif word_count < 700:
        resume_level = "Intermediate"
    else:
        resume_level = "Strong"

    # 🔹 AI feedback
    ai_feedback = get_ai_resume_feedback(text)
    print("🤖 AI feedback generated")

    # 🔹 SINGLE return
    return jsonify({
        "word_count": word_count,
        "skills_found": skills_found,
        "missing_skills": missing_skills,
        "resume_level": resume_level,
        "ai_feedback": ai_feedback
    })


if __name__ == "__main__":
    app.run(debug=True)
