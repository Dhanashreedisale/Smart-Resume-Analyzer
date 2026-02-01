import React, { useState } from "react";

function UploadResume() {
  const [analysis, setAnalysis] = useState(null)
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload_resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMessage(data.message);
      setAnalysis(data.analysis);
    } catch (err) {
      setMessage("Upload failed!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Your Resume</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>

  {analysis && (
    <div style={{ marginTop: "20px" }}>
    <h3>Resume Analysis</h3>
    <p><b>Word Count:</b> {analysis.word_count}</p>
    <p><b>Skills Found:</b> {analysis.skills_found.join(", ") || "None"}</p>
  </div>
)}

      <p>{message}</p>
    </div>
  );
}

export default UploadResume; //
