import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

// Import pages
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import ImageManagePage from '../pages/admin/ImageManagePage';
import FacilityManagePage from '../pages/admin/FacilityManagePage';
import RoomTypeManagePage from '../pages/admin/RoomTypeManagePage';
import RoomManagePage from '../pages/admin/RoomManagePage';
import BookingManagePage from '../pages/staff/BookingManagePage';
import ProfileViewPage from '../pages/customer/ProfileViewPage';
import ServiceManagePage from '../pages/admin/ServiceManagePage';
import HotelSearchPage from '../pages/HotelSearchPage';
import HotelRoomsListing from '../pages/customer/HotelRoomsListing'; 
import CheckInManagePage from '../pages/staff/CheckInManagePage';
import StaffLayout from '../layouts/StaffLayout';
import AdminLayout from '../layouts/AdminLayout';
import CheckOutManagePage from '../pages/staff/CheckOutManagePage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import BookingServicePage from '../pages/staff/BookingServicePage';
import StaffBookingListPage from '../pages/staff/StaffBookingListPage';
import StatisticsDashboard from '../pages/admin/StatisticsDashboard';

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

            <Route 
                path="/rooms" 
                element={
                    <PrivateRoute>
                        <HotelRoomsListing />
                    </PrivateRoute>
                } 
            />  

            {/* Admin Routes */}
            <Route
                path="/admin/*" 
                element={
                    <PrivateRoute allowedRoles={['admin']}>
                        <AdminLayout>
                            <Routes>
                                <Route path="/" element={<RoomManagePage />} />
                                <Route path="rooms" element={<RoomManagePage />} />
                                <Route path="services" element={<ServiceManagePage />} />
                                <Route path="images" element={<ImageManagePage />} />
                                <Route path="facilities" element={<FacilityManagePage />} />
                                <Route path="type-rooms" element={<RoomTypeManagePage />} />
                                <Route path="statistics" element={<StatisticsDashboard />} />
                            </Routes>
                        </AdminLayout>
                    </PrivateRoute>
                } 
            />

            {/* Staff Routes */}
            <Route 
                path="/staff/*" 
                element={
                    <PrivateRoute allowedRoles={['staff']}>
                        <StaffLayout>
                            <Routes>
                                <Route path="/" element={<div>Staff Dashboard</div>} />
                                <Route path="bookings" element={<BookingManagePage />} />
                                <Route path='check-in' element={<CheckInManagePage />} />
                                <Route path='check-out' element={<CheckOutManagePage />} />
                                <Route path="services" element={<StaffBookingListPage />} />
                                <Route path="bookings/:bookingId/services" element={<BookingServicePage />} />
                            </Routes>
                        </StaffLayout>
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
                            <Route path="profile" element={<ProfileViewPage />} />
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