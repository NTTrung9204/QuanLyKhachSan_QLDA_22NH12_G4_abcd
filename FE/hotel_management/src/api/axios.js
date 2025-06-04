// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // ← thay đổi thành base URL thật của bạn
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // optional
});

// Optional: Thêm interceptors nếu cần
api.interceptors.request.use(
  (config) => {
    // Danh sách các đường dẫn không cần token
    const excludedPaths = ['/api/auth/login', '/api/auth/signup'];

    // Nếu không nằm trong danh sách, thêm token
    if (!excludedPaths.some(path => config.url.includes(path))) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
