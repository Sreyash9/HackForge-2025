import React from "react";



function EmployeeProgress({ name, totalHours, weekHours }) {
  // Progress for the week (out of 40)
  const weekProgress = Math.round((weekHours / 40) * 100);

  return (
    <div className="employee-progress">
      <span className="employee-name">{name}</span>
      <div className="progress-section">
        <span className="progress-title">This Week</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${weekProgress}%` }}
          ></div>
        </div>
        <span className="progress-label">
          {weekHours} / 40 hours ({weekProgress}%)
        </span>
      </div>
      <div className="progress-section">
        <span className="progress-title">Total Hours Worked</span>
        <span className="total-hours-label">{totalHours} hours</span>
      </div>
    </div>
  );
}

export default EmployeeProgress;