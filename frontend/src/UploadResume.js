import React, { useState } from "react";

function UploadResume() {
  const [analysis, setAnalysis] = useState(null)
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
  };
  
  const handleUpload = async (e)=>{
    e.preventDefault();
    if (!file) return;
  setLoading(true);
  setAnalysis(null);
  


  const formData = new FormData();
  formData.append("resume", file); // 'file' = selected file from input

  try {
    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setAnalysis(data);
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

    {/* 👇 FORM STARTS HERE */}
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={handleFileChange}
      />

      <br /><br />
     

      <button type="submit"
       onclick ={handleUpload}disabled={loading}>
        {loading ? "Analyzing resume..." : "Upload Resume"}
      </button>
    </form>
    {/* 👆 FORM ENDS HERE */}

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
  }}>
    <h3>📄 Resume Analysis</h3>

    <p><b>Word Count:</b> {analysis.word_count}</p>

    <p>
      <b>Resume Level:</b>{" "}
      <span style={{ color: getLevelColor(analysis.resume_level) }}>
        {analysis.resume_level}
      </span>
    </p>

    <p>
      <b>Skills Found:</b>{" "}
      {analysis.skills_found.length > 0
        ? analysis.skills_found.join(", ")
        : "None"}
    </p>

    <p>
      <b>Missing Skills:</b>{" "}
      {analysis.missing_skills.length > 0
        ? analysis.missing_skills.join(", ")
        : "None"}
    </p>
  </div>
)}



      <p>{message}</p>
    </div>
  );
}

export default UploadResume; //
