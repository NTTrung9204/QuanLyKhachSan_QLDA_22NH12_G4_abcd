import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

// Create auth context
const AuthContext = createContext();

// Custom hook for using auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user data from localStorage on initial render
    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData && userData !== 'undefined') {
                setCurrentUser(JSON.parse(userData));
            }
        } catch (err) {
            console.error('Lỗi parse userData:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Login function
    const login = (userData) => {
        // userData should contain id, name, role
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout function
    const logout = async (callback) => {
        try {
            await api.post('/api/auth/logout');
            setCurrentUser(null);
            // Xóa token và user info từ localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Gọi callback function (sẽ được sử dụng để chuyển trang)
            if (callback) callback();
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            // Ngay cả khi có lỗi, vẫn xóa dữ liệu local
            setCurrentUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (callback) callback();
        }
    };

    // Context value
    const value = {
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;