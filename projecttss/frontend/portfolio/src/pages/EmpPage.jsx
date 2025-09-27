import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EmployeeProgress from "../components/EmployeeProgress";
import ProductivityBar from "../components/ProductivityBar";

import "../styling/progress.css";

function EmpPage() {
  const { empId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pendingTasks, setPendingTasks] = useState([]);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/emp/${empId}`);
        setEmployee(response.data.employee);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };
    fetchEmployee();
  }, [empId]);

  // Fetch pending tasks
  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/tasks/pending/${empId}`
        );
        setPendingTasks(response.data);
      } catch (err) {
        console.error("Error fetching pending tasks:", err);
      }
    };
    fetchPendingTasks();
  }, [empId]);

  // Assign task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/tasks", {
        empId: empId,
        title,
        description,
      });
      alert("Task assigned successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error assigning task:", err);
    }
  };

  // Approve task
  const handleApprove = async (submissionId) => {
    try {
      await axios.put(
        `http://localhost:4000/tasks/submission/${submissionId}/approve`
      );
      setPendingTasks((prev) =>
        prev.filter((t) => t.submission_id !== submissionId)
      );
    } catch (err) {
      console.error("Error approving task:", err);
    }
  };

  // Reject task
  const handleReject = async (submissionId) => {
    try {
      await axios.put(
        `http://localhost:4000/tasks/submission/${submissionId}/reject`
      );
      setPendingTasks((prev) =>
        prev.filter((t) => t.submission_id !== submissionId)
      );
    } catch (err) {
      console.error("Error rejecting task:", err);
    }
  };

  if (!employee) return <p>Loading...</p>;

  return (
  <div className="emp-page-container">
  <header className="emp-header">
    <h1>Employee: {employee.emp_name}</h1>
  </header>

  {/* Top Section */}
  <div className="emp-top-section">
    <ProductivityBar
      className="emp-productivity-bar"
      weekHours={employee.week_hours || 0}
      totalHours={employee.total_hours || 0}
      weekProjects={employee.week_projects || 0}
      totalProjects={employee.total_projects || 0}
    />

    <EmployeeProgress
      className="emp-progress-bar"
      name="Progress"
      totalHours={employee.total_hours || 0}
      weekHours={employee.week_hours || 0}
    />
  </div>

  {/* Assign Task Form */}
  <section className="assign-task-section">
    <h2>Assign Task to {employee.emp_name}</h2>
    <form className="assign-task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Task Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="assign-btn">Assign Task</button>
    </form>
  </section>

  {/* Pending Tasks */}
  <section className="pending-tasks-section">
    <h2>Pending Tasks for Approval</h2>
    {pendingTasks.length === 0 ? (
      <p className="no-tasks">No pending tasks.</p>
    ) : (
      <div className="tasks-grid">
        {pendingTasks.map((task) => (
          <div key={task.submission_id} className="task-card">
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p>
              <strong>File:</strong>{" "}
              <a href={`http://localhost:4000/${task.file_path}`} target="_blank" rel="noopener noreferrer">
                View / Download
              </a>
            </p>
            <p><strong>Status:</strong> {task.status}</p>
            <div className="task-actions">
              <button onClick={() => handleApprove(task.submission_id)} className="approve-btn">Approve</button>
              <button onClick={() => handleReject(task.submission_id)} className="reject-btn">Reject</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
</div>

  
  );
}

export default EmpPage;
