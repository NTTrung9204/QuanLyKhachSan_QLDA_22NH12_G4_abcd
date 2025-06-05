import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StaffNavigation = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      text: 'Quản lý đặt phòng',
      icon: '🏨',
      path: '/staff/bookings',
    },
    {
      text: 'Quản lý check-in',
      icon: '📅',
      path: '/staff/check-in',
    },
    {
      text: 'Quản lý check-out',
      icon: '🔑',
      path: '/staff/check-out',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="staff-nav">
      <div className="nav-header">
        <h2 className="nav-title">Staff Portal</h2>
      </div>
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.text}</span>
            </Link>
          </li>
        ))}
        <li className="logout-item">
          <button onClick={handleLogout} className="nav-link logout-button">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Đăng xuất</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Add styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .staff-nav {
    width: 240px;
    min-height: 100vh;
    background-color: #1a237e;
    color: white;
    position: fixed;
    left: 0;
    top: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .nav-header {
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-title {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: white;
  }

  .nav-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    color: white;
    text-decoration: none;
    transition: background-color 0.2s ease;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font: inherit;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-icon {
    margin-right: 16px;
    font-size: 20px;
    width: 24px;
    text-align: center;
  }

  .nav-text {
    font-size: 14px;
  }

  .logout-item {
    margin-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logout-button {
    color: #ff5252;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .staff-nav {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .staff-nav.open {
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default StaffNavigation; 