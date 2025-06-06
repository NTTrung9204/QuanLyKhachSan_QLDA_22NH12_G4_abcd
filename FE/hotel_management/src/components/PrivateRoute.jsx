import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  // Lấy thông tin user từ localStorage
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  console.log(userStr)
  console.log(token)
  
  // Nếu không có token, chuyển về trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Parse thông tin user
  let user;
  try {
    user = JSON.parse(userStr);
    console.log("user:", user)
  } catch {
    console.log("user parse thất bại")
    // Nếu parse thất bại, đăng xuất user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  console.log("user.data.role:", user.data.role)


  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles && !allowedRoles.includes(user.data.user.role)) {
    // Nếu user không có quyền truy cập, chuyển về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu có token và đủ quyền, cho phép truy cập
  return children;
};

export default PrivateRoute; 