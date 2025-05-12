import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

// Import pages
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import ImageManagePage from '../pages/admin/ImageManagePage';
import FacilityManagePage from '../pages/admin/FacilityManagePage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route 
                path="/" 
                element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                } 
            />

            {/* Admin Routes */}
            <Route
                path="/admin/*" 
                element={
                    <PrivateRoute allowedRoles={['admin']}>
                        <Routes style={{backgroundColor : '#f8fafc', width : '100%'}}>
                            <Route path="/" element={<div>Admin Dashboard</div>} />
                            <Route path="rooms" element={<div>Room Management</div>} />
                            <Route path="services" element={<div>Service Management</div>} />
                            <Route path="images" element={<ImageManagePage />} />
                            <Route path="facilities" element={<FacilityManagePage />} />
                        </Routes>
                    </PrivateRoute>
                } 
            />

            {/* Staff Routes */}
            <Route 
                path="/staff/*" 
                element={
                    <PrivateRoute allowedRoles={['staff']}>
                        <Routes>
                            <Route path="/" element={<div>Staff Dashboard</div>} />
                            <Route path="bookings" element={<div>Booking Management</div>} />
                        </Routes>
                    </PrivateRoute>
                } 
            />

            {/* Customer Routes */}
            <Route 
                path="/customer/*" 
                element={
                    <PrivateRoute allowedRoles={['customer']}>
                        <Routes>
                            <Route path="/" element={<div>Customer Dashboard</div>} />
                            <Route path="bookings" element={<div>My Bookings</div>} />
                            <Route path="profile" element={<div>My Profile</div>} />
                        </Routes>
                    </PrivateRoute>
                } 
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;