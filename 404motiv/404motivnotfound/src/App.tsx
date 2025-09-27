import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import LocalUserDashboard from './components/local/LocalUserDashboard';
import ManufacturerDashboard from './components/manufacturer/ManufacturerDashboard';
import RecyclerDashboard from './components/recycler/RecyclerDashboard';
import RecyclingBasics from './components/local/RecyclingBasics';
import { AuthForm } from './components/AuthForm';
import { User } from './types';
import { UserType } from './db/models';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleRoleSelect = (role: User['role']) => {
    setSelectedUserType(role as UserType);
  };

  const renderDashboard = () => {
    if (!isAuthenticated) {
      if (selectedUserType) {
        return (
          <AuthForm
            userType={selectedUserType}
            onSuccess={() => {}} // Auth context will handle the success
          />
        );
      }
      return <LandingPage onRoleSelect={handleRoleSelect} />;
    }
    
    if (!user) return null;

    switch (user.role) {
      case 'local':
        return <LocalUserDashboard />;
      case 'manufacturer':
        return <ManufacturerDashboard />;
      case 'recycler':
        return <RecyclerDashboard />;
      default:
        return <LandingPage onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={user}
          onRoleChange={handleRoleSelect}
          onLogout={logout}
        />
        <Routes>
          <Route path="/recycling-basics" element={
            isAuthenticated && user?.role === 'local' ? (
              <RecyclingBasics />
            ) : (
              <Navigate to="/" replace />
            )
          } />
          <Route path="*" element={renderDashboard()} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;