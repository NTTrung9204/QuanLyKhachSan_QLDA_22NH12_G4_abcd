import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', formData);
      const userData = response.data;

      console.log(userData)
      console.log(userData.data)

      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('token', userData.data.token);
      localStorage.setItem('user', JSON.stringify(userData.data.user));
      
      login(userData);
      setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
      
      // Chuyển hướng dựa theo role
      setTimeout(() => {
        const userRole = userData.data.user.role;
        console.log("userRole:", userRole)
        switch(userRole) {
          case 'admin':
            navigate('/admin');
            break;
          case 'staff':
            navigate('/staff/bookings');
            break;
          case 'customer':
            navigate('/');
            break;
          default:
            navigate('/');
        }
      }, 1500);

    } catch {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Continue with Google');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidePanel}>
        <div style={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791"
            alt="Hotel lobby view"
            style={styles.backgroundImage}
          />
          <div style={styles.overlay}></div>
        </div>
      </div>

      <div style={styles.centerPanel}>
        <div style={styles.formContainer}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}></div>
            </div>
          </div>

          <div style={styles.header}>
            <h2 style={styles.title}>Chào mừng trở lại!</h2>
            <p style={styles.subtitle}>
              Đăng nhập để trải nghiệm dịch vụ đặt phòng trực tuyến và nhiều tiện ích khác
            </p>
          </div>

          {error && (
            <div style={styles.alert}>
              <span style={styles.alertIcon}>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.successAlert}>
              <span style={styles.alertIcon}>✓</span>
              {success}
            </div>
          )}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formSection}>
              <h4 style={styles.sectionTitle}>Thông tin đăng nhập</h4>
              
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Tên đăng nhập"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={loading ? {...styles.loginButton, ...styles.buttonDisabled} : styles.loginButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Đang xử lý...
                </>
              ) : 'Đăng nhập'}
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerText}>hoặc</span>
            </div>

            <button 
              type="button"
              style={styles.socialButton}
              onClick={handleGoogleLogin}
            >
              <span style={styles.googleIcon}>G</span>
              Tiếp tục với Google
            </button>

            <div style={styles.registerPrompt}>
              <p>Chưa có tài khoản? <Link to="/register" style={styles.registerLink}>Đăng ký ngay</Link></p>
            </div>
          </form>

        </div>
      </div>

      <div style={styles.sidePanel}>
        <div style={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
            alt="Hotel room view"
            style={styles.backgroundImage}
          />
          <div style={styles.overlay}></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  sidePanel: {
    flex: '1',
    position: 'relative',
    minHeight: '100vh'
  },
  centerPanel: {
    flex: '0 0 480px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)'
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  logo: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '20px',
      height: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '50%'
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.4'
  },
  alert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center'
  },
  successAlert: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#166534',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center'
  },
  alertIcon: {
    marginRight: '0.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    '&:hover': {
      borderColor: '#cbd5e1'
    },
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    '&::placeholder': {
      color: '#9ca3af'
    }
  },
  loginButton: {
    width: '100%',
    padding: '0.8rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 8px rgba(59, 130, 246, 0.3)'
    }
  },
  buttonDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
    '&:hover': {
      transform: 'none',
      boxShadow: '0 4px 6px rgba(156, 163, 175, 0.2)'
    }
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '1rem 0',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#e5e7eb'
    }
  },
  dividerText: {
    backgroundColor: '#ffffff',
    color: '#6b7280',
    fontSize: '0.875rem',
    padding: '0 1rem'
  },
  socialButton: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.15s ease-in-out',
    '&:hover': {
      backgroundColor: '#f9fafb',
      borderColor: '#9ca3af'
    }
  },
  googleIcon: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#ea4335'
  },
  registerPrompt: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '1rem'
  },
  registerLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    background: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '8px'
  },
  featureIcon: {
    fontSize: '1.25rem'
  },
  featureText: {
    fontSize: '0.875rem',
    margin: 0,
    color: '#374151',
    fontWeight: '500'
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 1200px) {
    .container {
      flex-direction: column;
    }
    .sidePanel {
      display: none;
    }
    .centerPanel {
      flex: 1;
      width: 100%;
      padding: 1rem;
    }
  }

  @media (max-width: 640px) {
    .centerPanel {
      padding: 1rem;
    }
    .formContainer {
      max-width: 100%;
    }
  }
`;
document.head.appendChild(styleSheet);

export default LoginPage;