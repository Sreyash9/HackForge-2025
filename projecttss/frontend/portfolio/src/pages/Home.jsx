import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Login from "../components/login.jsx";
import Task from "../components/Task.jsx";
import EmployeeProgress from "../components/EmployeeProgress.jsx";
import ProductivityBar from "../components/ProductivityBar.jsx";
import Header from "../components/Header.jsx";

function Home() {
  const { empId } = useParams(); 
  const [tasks, setTasks] = useState([]);
  const [employee, setEmployee] = useState({
    emp_name: "Employee",
    week_hours: 0,
    total_hours: 0,
    week_projects: 0,
    total_projects: 0,
    productivity: 0,
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const empResp = await axios.get(`http://localhost:4000/emp/${empId}`);
        setEmployee(empResp.data.employee);

        const tasksResp = await axios.get(
          `http://localhost:4000/tasks/employee/${empId}`
        );
        setTasks(tasksResp.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (empId) fetchEmployeeData();
  }, [empId]);

  return (
    <div>
      <Header />
   
    <div className="dashboard-container">

      {/* Top Row */}
      <div className="top-row">
        <div className="greeting-progress">
          <h1 className="home-title">Hello {employee.emp_name}</h1>
          <EmployeeProgress
            name="Progress"
            totalHours={employee.total_hours}
            weekHours={employee.week_hours}
          />
        </div>
        <div className="join-work-section">
          <Login empId={empId} />
        </div>
      </div>

      {/* Middle Row */}
      <div className="productivity-row">
        <ProductivityBar
          weekHours={employee.week_hours}
          totalHours={employee.total_hours}
          weekProjects={employee.week_projects}
          totalProjects={employee.total_projects}
        />
      </div>

      {/* Bottom Row - Horizontal task cards */}
      <div className="tasks-row">
        <h2 className="tasks-title">All Projects</h2>
        <div className="tasks-horizontal">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Task
                key={task.id}
                taskId={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
              />
            ))
          ) : (
            <p className="no-tasks">No tasks assigned yet.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;
