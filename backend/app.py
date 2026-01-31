from flask import Flask,request,jsonify
from flask_cors import CORS
import os

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
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # For now, just return success
    return jsonify({"message": f"Resume {file.filename} uploaded successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True) 

