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

    //   console.log('token:', userData.token);
    //   console.log('Login successful:', userData.data.user.role);   
      
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.data.user));
      
      login(userData);
      setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
      
    //   Chuyển hướng dựa theo role
      setTimeout(() => {
        switch(userData.data.user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'staff':
            navigate('/staff/bookings');
            break;
          case 'customer':
            navigate('/');
            break;
        }
      }, 1500);

    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.leftColumn}>
          <div style={styles.formHeader}>
            <h2 style={styles.heading}>Đăng nhập</h2>
            <p style={styles.subheading}>Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {error && (
            <div style={styles.alertDanger}>
              <i style={styles.icon}>⚠️</i> {error}
            </div>
          )}

          {success && (
            <div style={styles.alertSuccess}>
              <i style={styles.icon}>✓</i> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formSection}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="username">
                  Tên đăng nhập <span style={styles.requiredMark}>*</span>
                </label>
                <input
                  style={styles.formInput}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="password">
                  Mật khẩu <span style={styles.requiredMark}>*</span>
                </label>
                <input
                  style={styles.formInput}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} role="status" aria-hidden="true"></span>
                  Đang xử lý...
                </>
              ) : 'Đăng nhập'}
            </button>

            <div style={styles.registerPrompt}>
              <p>Chưa có tài khoản? <Link to="/register" style={styles.link}>Đăng ký ngay</Link></p>
            </div>
          </form>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.welcomeSection}>
            <h3 style={styles.welcomeTitle}>Chào mừng trở lại!</h3>
            <p style={styles.welcomeText}>
              Đăng nhập để trải nghiệm dịch vụ đặt phòng trực tuyến và nhiều tiện ích khác.
            </p>
            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🏨</span>
                <p style={styles.featureText}>Đặt phòng dễ dàng</p>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>💰</span>
                <p style={styles.featureText}>Giá ưu đãi độc quyền</p>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🎁</span>
                <p style={styles.featureText}>Tích điểm đổi quà</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%)',
    padding: '2rem'
  },
  formWrapper: {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  leftColumn: {
    flex: '1',
    padding: '1.5rem',
    minWidth: 0,
    maxWidth: '100%'
  },
  rightColumn: {
    width: '400px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    padding: '2rem',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  formHeader: {
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  heading: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.3rem',
    textAlign: 'center'
  },
  subheading: {
    fontSize: '1rem',
    color: '#64748b',
    textAlign: 'center'
  },
  alertDanger: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '0.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
    width: '100%',
    boxSizing: 'border-box'
  },
  formGroup: {
    flex: '1',
    minWidth: '250px',
    maxWidth: '100%',
    marginBottom: '0.8rem',
    position: 'relative'
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#334155',
    textAlign: 'left',
    letterSpacing: '0.3px'
  },
  requiredMark: {
    color: '#dc2626',
    marginLeft: '3px',
    fontSize: '1rem'
  },
  formInput: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    fontSize: '0.95rem',
    backgroundColor: '#fff',
    color: '#1e293b',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    outline: 'none',
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
      color: '#94a3b8',
      fontSize: '0.9rem'
    }
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)',
    '&:hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 2px rgba(59, 130, 246, 0.2)'
    }
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none'
    }
  },
  spinner: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    border: '2px solid #ffffff',
    borderRightColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.75s linear infinite',
    marginRight: '0.5rem'
  },
  registerPrompt: {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#64748b'
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  welcomeSection: {
    textAlign: 'center'
  },
  welcomeTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem'
  },
  welcomeText: {
    fontSize: '1rem',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.8rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px'
  },
  featureIcon: {
    fontSize: '1.5rem'
  },
  featureText: {
    fontSize: '1rem',
    margin: 0
  },
  alertSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center'
  }
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 1024px) {
    .formWrapper {
      flex-direction: column;
    }
    .rightColumn {
      width: 100%;
      padding: 1.5rem;
    }
    .leftColumn {
      padding: 1.5rem;
      border-right: none;
      border-bottom: 1px solid #e9ecef;
    }
  }

  @media (max-width: 640px) {
    .formRow {
      flex-direction: column;
    }
    .formGroup {
      min-width: 100%;
    }
    .container {
      padding: 1rem;
    }
  }
`;
document.head.appendChild(styleSheet);

export default LoginPage;