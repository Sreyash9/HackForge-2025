import React, { useState, useEffect } from "react";
import axios from "axios";

function Login({ empId }) {
  const [isWorking, setIsWorking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerId, setTimerId] = useState(null);

  // Fetch c_time when component mounts
  useEffect(() => {
    const fetchCTime = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/emp/${empId}/ctime`
        ); // new endpoint to get c_time
        const currentTime = response.data.c_time || 0;
        setSeconds(currentTime);
      } catch (err) {
        console.error("Error fetching current work time:", err);
      }
    };

    if (empId) fetchCTime();
  }, [empId]);

  const handleWorkToggle = async () => {
    if (!isWorking) {
      // Start work
      setIsWorking(true);
      const id = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      setTimerId(id);
    } else {
      // Stop work
      setIsWorking(false);
      clearInterval(timerId);
      setTimerId(null);

      // Save seconds to database
      try {
        await axios.put(`http://localhost:4000/emp/${empId}/ctime`, {
          c_time: seconds,
        });
      } catch (err) {
        console.error("Error saving work time:", err);
      }
    }
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <button className="login-btn" onClick={handleWorkToggle}>
        {isWorking ? "STOP WORK" : "JOIN WORK"}
      </button>
      {isWorking && (
        <p>
          ⏱ On Work: <strong>{formatTime(seconds)}</strong>
        </p>
      )}
    </div>
  );
}

export default Login;
