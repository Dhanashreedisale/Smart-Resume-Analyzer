from PyPDF2 import PdfReader
from flask import Flask,request,jsonify
from flask_cors import CORS
import os

def extract_text_from_pdf(filepath):
    reader = PdfReader(filepath)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def analyze_resume(text):
    words = text.split()
    word_count = len(words)

    skills = []
    skill_keywords = ["python", "java", "react", "flask", "sql", "machine learning"]

    for skill in skill_keywords:
        if skill.lower() in text.lower():
            skills.append(skill)

    return {
        "word_count": word_count,
        "skills_found": skills
    }


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload_resume', methods=["POST"])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify ({"error":"No file part"}), 400
    
    file = request.files['resume']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    text=extract_text_from_pdf(filepath)
    analysis = analyze_resume(text)
    # For now, just return success
    return jsonify({
         "message": "Resume uploaded and analyzed successfully",
         "analysis": analysis
    })
if __name__ == "__main__":
    app.run(debug=True) 

