import React, { useState } from "react";

function UploadResume() {
  const initialAnalysis = {
    word_count: 0,
    skills_found: [],
    missing_skills: [],
    resume_level: "",
    ai_feedback: ""
  };

  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(initialAnalysis);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setAnalysis(initialAnalysis);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setAnalysis(data);
        setMessage("Resume analyzed successfully");
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level === "Basic") return "red";
    if (level === "Intermediate") return "orange";
    if (level === "Strong") return "green";
    return "black";
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Smart Resume Analyzer</h2>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing resume..." : "Upload Resume"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {analysis && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f4f6f8",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "500px"
          }}
        >
          <h3>📄 Resume Analysis</h3>

          <p>Word Count: {analysis.word_count}</p>

          <p>
            <b>Resume Level:</b>{" "}
            <span style={{ color: getLevelColor(analysis.resume_level) }}>
              {analysis.resume_level || "N/A"}
            </span>
          </p>

          <p>Skills Found: {analysis.skills_found.length}</p>

          {/* ✅ SKILLS FOUND LIST */}
          <ul>
            {analysis.skills_found.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <p>Missing Skills: {analysis.missing_skills.length}</p>

          {/* ✅ MISSING SKILLS LIST */}
          {analysis.missing_skills.length > 0 ? (
            <ul>
              {analysis.missing_skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>🎉 No missing skills</p>
          )}

          {/* ✅ AI FEEDBACK */}
          {analysis.ai_feedback && (
            <div style={{ marginTop: "15px" }}>
              <h4>🤖 AI Feedback</h4>
              <p>{analysis.ai_feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadResume;
