import React from "react";
import "../styling/ProductivityBar.css"; // we will style the bar here

function ProductivityBar({ weekHours, totalHours, weekProjects, totalProjects }) {
  // Normalize metrics
  const weekHoursScore = Math.min(weekHours / 40, 1);          // ideal week: 40h
  const totalHoursScore = Math.min(totalHours / 2000, 1);      // long-term goal: 2000h
  const weekProjectsScore = Math.min(weekProjects / 5, 1);     // ideal: 5 projects/week
  const totalProjectsScore = Math.min(totalProjects / 50, 1);  // benchmark: 50 total projects

  // Weighted productivity formula
  const productivity =
    0.3 * weekHoursScore +
    0.2 * totalHoursScore +
    0.3 * weekProjectsScore +
    0.2 * totalProjectsScore;

  const productivityPercent = Math.round(productivity * 100);

  return (
    <div className="productivity-container">
      <h3>Productivity: {productivityPercent}%</h3>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${productivityPercent}%` }}
        />
      </div>
      <div className="metrics">
        <span>Week Hours: {weekHours}h</span>
        <span>Total Hours: {totalHours}h</span>
        <span>Week Projects: {weekProjects}</span>
        <span>Total Projects: {totalProjects}</span>
      </div>
    </div>
  );
}

export default ProductivityBar;
