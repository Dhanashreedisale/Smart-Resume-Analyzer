import React, { useState } from "react";

function UploadResume() {
  const [analysis, setAnalysis] = useState(null)
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("resume", file); // 'file' = selected file from input

  try {
    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log(data); // 🔹 for debugging

    if (data.error) {
      setMessage(data.error);
      setAnalysis(null);
    } else {
      setMessage(data.message || "Resume analyzed successfully");
      setAnalysis(data); // 🔹 store the JSON from backend
    }
  } catch (err) {
    console.error(err);
    setMessage("Upload failed");
    setAnalysis(null);
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
  <div style={{
      border: "1px solid #ccc",
      padding: "20px",
      marginTop: "20px",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
    <h3>Resume Analysis</h3>
    <p><b>Word Count:</b> {analysis.word_count}</p>
    <p><b>Skills Found:</b> {analysis.skills_found.join(", ") || "None"}</p>
    <p><b>Missing Skills:</b> {analysis.missing_skills.join(", ") || "None"}</p>
    <p><b>Resume Level:</b> {analysis.resume_level}</p>
  </div>
)}


      <p>{message}</p>
    </div>
  );
}

export default UploadResume; //
