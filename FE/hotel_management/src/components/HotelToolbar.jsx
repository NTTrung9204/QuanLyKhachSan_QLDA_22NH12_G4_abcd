import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HotelToolbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const profileMenuRef = useRef(null);

  // Giả lập kiểm tra trạng thái đăng nhập từ localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleViewProfile = () => {
    setShowProfileMenu(false);
    navigate('/customer/profile');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Giả lập đăng nhập để test
  const simulateLogin = () => {
    const mockUser = {
      _id: '123',
      username: 'john_doe',
      role: 'customer',
      profile: {
        fullName: 'John Doe',
        phone: '0987654321',
        address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM'
      }
    };
    
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoggedIn(true);
    setUser(mockUser);
  };

  return (
    <div style={styles.toolbar}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoSection} onClick={() => navigate('/')} role="button">
          <div style={styles.logo}>
            <div style={styles.logoIcon}></div>
          </div>
          <span style={styles.logoText}>Hotel</span>
        </div>

        {/* Navigation Menu */}
        <nav style={styles.navigation}>
          <Link to="/" style={styles.navLink}>Trang chủ</Link>
          <Link to="/rooms" style={styles.navLink}>Đặt phòng</Link>
          <Link to="/services" style={styles.navLink}>Dịch vụ</Link>
          <Link to="/contact" style={styles.navLink}>Liên hệ</Link>
        </nav>

        {/* Auth Section */}
        <div style={styles.authSection}>
          {!isLoggedIn ? (
            <div style={styles.authButtons}>
              <button style={styles.loginButton} onClick={handleLogin}>
                Đăng nhập
              </button>
              <button style={styles.registerButton} onClick={handleRegister}>
                Đăng ký
              </button>
              {/* Demo button để test */}
              <button style={styles.demoButton} onClick={simulateLogin}>
                Demo Login
              </button>
            </div>
          ) : (
            <div style={styles.profileSection} ref={profileMenuRef}>
              <div style={styles.profileButton} onClick={toggleProfileMenu}>
                <div style={styles.avatar}>
                  <span style={styles.avatarText}>
                    {user?.profile?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <span style={styles.userName}>
                  {user?.profile?.fullName || user?.username}
                </span>
                <span style={styles.dropdownArrow}>▼</span>
              </div>

              {showProfileMenu && (
                <div style={styles.profileMenu}>
                  <div style={styles.profileHeader}>
                    <div style={styles.profileInfo}>
                      <div style={styles.profileName}>
                        {user?.profile?.fullName || user?.username}
                      </div>
                      <div style={styles.profileRole}>
                        {user?.role === 'customer' ? 'Khách hàng' : 
                         user?.role === 'admin' ? 'Quản trị viên' : 
                         user?.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.menuDivider}></div>
                  
                  <button style={styles.menuItem} onClick={handleViewProfile}>
                    <span style={styles.menuIcon}>👤</span>
                    Thông tin cá nhân
                  </button>
                  
                  <button style={styles.menuItem}>
                    <span style={styles.menuIcon}>📋</span>
                    Lịch sử đặt phòng
                  </button>
                  
                  <button style={styles.menuItem}>
                    <span style={styles.menuIcon}>⚙️</span>
                    Cài đặt
                  </button>
                  
                  <div style={styles.menuDivider}></div>
                  
                  <button style={styles.logoutMenuItem} onClick={handleLogout}>
                    <span style={styles.menuIcon}>🚪</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    backgroundColor: '#1e3a5f',
    padding: '0.75rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logo: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '16px',
      height: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '50%'
    }
  },
  logoText: {
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '-0.025em'
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-1px)'
    }
  },
  authSection: {
    display: 'flex',
    alignItems: 'center'
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  loginButton: {
    padding: '0.5rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1e3a5f',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8fafc',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  },
  registerButton: {
    padding: '0.5rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
    }
  },
  demoButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    opacity: 0.8
  },
  profileSection: {
    position: 'relative'
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
    }
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  avatarText: {
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  userName: {
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  dropdownArrow: {
    color: '#ffffff',
    fontSize: '0.625rem',
    transition: 'transform 0.2s ease'
  },
  profileMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    width: '240px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    animation: 'slideDown 0.2s ease-out'
  },
  profileHeader: {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  profileName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  profileRole: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  menuDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '0.5rem 0'
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: '#374151',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: '#f3f4f6',
      color: '#1f2937'
    }
  },
  logoutMenuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: '#dc2626',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: '#fef2f2',
      color: '#b91c1c'
    }
  },
  menuIcon: {
    fontSize: '1rem',
    width: '16px',
    textAlign: 'center'
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .navigation {
      display: none;
    }
    .container {
      padding: 0 0.5rem;
    }
    .authButtons {
      gap: 0.5rem;
    }
    .loginButton, .registerButton {
      padding: 0.4rem 1rem;
      font-size: 0.8rem;
    }
    .userName {
      display: none;
    }
    .profileMenu {
      width: 200px;
    }
  }

  @media (max-width: 480px) {
    .logoText {
      display: none;
    }
    .demoButton {
      display: none;
    }
  }
`;
document.head.appendChild(styleSheet);

export default HotelToolbar;