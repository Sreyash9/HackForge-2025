import React from "react";
import Login from "../components/login.jsx";
import List from "../components/list.jsx";
import { useEffect, useState } from "react";
import axios from "axios";  

function createList(project){  

    return(
    
    <List
        key={project.id}
        id = {project.id}
        name={project.emp_name}
        hour={project.hours}
        />
        
    );
}

function Home(){
       const [data, setData] = useState([]);

      useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/data/list');
        console.log('API data:', response.data);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } 
    };

    fetchData();
  }, []);
   
   
   
    return(
       <div className="employer-dashboard">
  <header className="dashboard-header">
    <h1>EMPLOYER PORTAL</h1>
  </header>

  <div className="list-section">
    {data.map(createList)}
  </div>
</div>


    );
}

export default Home;