import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import CompanyHome from "./pages/CompanyHome.jsx";
import EmpPage from "./pages/EmpPage.jsx";
// App.js
  // ✅ put this ONCE here


 function App() {
          return (
            <BrowserRouter>
              <Routes>
                <Route path="/:empId" element={<Home />} />
                <Route path="/admin" element={<CompanyHome />} />

                 <Route path="/employee/:empId" element={<EmpPage />} />
        
              </Routes>
            </BrowserRouter>
          );
        }

export default App;
