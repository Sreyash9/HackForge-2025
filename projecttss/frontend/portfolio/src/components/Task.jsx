import React, { useState } from "react";

function Task({ taskId, title, description, status: initialStatus }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(initialStatus);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", taskId);

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("Pending Approval"); // instantly update UI
        setFile(null);
      } else {
        console.error("Upload failed!");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  return (
    <div className="task-card">
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{description}</p>
      <p>
        <strong>Status:</strong> {status}
      </p>

      {status === "assigned" && (
        <form onSubmit={handleSubmit}>
          <label htmlFor={`file-${taskId}`}>Upload File</label>
          <input
            type="file"
            id={`file-${taskId}`}
            name="file"
            onChange={handleFileChange}
          />
          {file && <button type="submit">Submit</button>}
        </form>
      )}

      {status === "Pending Approval" && (
        <p style={{ color: "orange" }}>⏳ Pending Approval...</p>
      )}

      {status === "Approved" && (
        <p style={{ color: "green" }}>✅ Task Approved!</p>
      )}
    </div>
  );
}

export default Task;
