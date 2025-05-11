import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import pages
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';

// Protected route wrapper component
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to home if user doesn't have the required role
    return <Navigate to="/" replace />;
  }
  
  // Render the child routes
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} /> 
    </Routes>
  );
};

export default AppRoutes;