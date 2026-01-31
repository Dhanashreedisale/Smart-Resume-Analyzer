import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error connecting to backend"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Smart Resume Analyzer</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
