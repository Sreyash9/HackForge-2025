import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TranslationProvider } from './utils/translations';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Addroom from './pages/Addroom';
import LogUsage from './pages/LogUsage';
import SetGoals from './pages/SetGoals';
import './index.css';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return !token ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <Router>
        <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Addroom"
            element={
              <ProtectedRoute>
                <Addroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/log-usage"
            element={
              <ProtectedRoute>
                <LogUsage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/set-goals"
            element={
              <ProtectedRoute>
                <SetGoals />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
    </TranslationProvider>
  );
};

export default App;