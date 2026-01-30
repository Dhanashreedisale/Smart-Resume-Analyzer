from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/test", methods=["GET"])
def test_api():
    return jsonify({
        "message": "Hello from Flask backend 👋"
    })

if __name__ == "__main__":
    app.run(debug=True)