import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import pages
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';

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
    <Routes style={{ width: '100vw', height: '100vh' }}>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} /> 
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRoutes;