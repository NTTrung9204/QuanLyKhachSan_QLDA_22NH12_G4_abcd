import React, { createContext, useState, useEffect, useContext } from 'react';

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
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
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