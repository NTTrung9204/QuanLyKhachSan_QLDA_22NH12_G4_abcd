import React, { useState } from 'react';
import axios from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    cccd: '',
    birthDate: '',
    gender: 'male'
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || 
        !formData.fullName || !formData.phone || !formData.address || 
        !formData.cccd || !formData.birthDate) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (formData.username.length < 4) {
      setError('Tên đăng nhập phải có ít nhất 4 ký tự');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại phải có 10 chữ số');
      return false;
    }

    const cccdRegex = /^[0-9]{12}$/;
    if (!cccdRegex.test(formData.cccd)) {
      setError('CCCD phải có 12 chữ số');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        cccd: formData.cccd,
        birthDate: formData.birthDate,
        gender: formData.gender,
      };

      // Gọi API thực tế thay vì giả lập
      const response = await axios.post('/api/auth/signup', newUser);
      
      if (response.data) {
        setSuccess('Đăng ký thành công! Chào mừng bạn đến với khách sạn của chúng tôi!');
        // Có thể chuyển hướng người dùng đến trang đăng nhập
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
      setLoading(false);
      
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Continue with Google');
  };

  const handleFacebookSignup = () => {
    console.log('Continue with Facebook');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidePanel}>
        <div style={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d"
            alt="Hotel view left"
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
            <h2 style={styles.title}>Đăng ký tài khoản</h2>
            <p style={styles.subtitle}>
              Tiết kiệm đến 10% ngay trên lần đầu đặt phòng khi đăng ký miễn phí
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
              <h4 style={styles.sectionTitle}>Thông tin tài khoản</h4>
              
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
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Địa chỉ email"
                  required
                />
              </div>

              <div style={styles.inputRow}>
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
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Xác nhận mật khẩu"
                    required
                  />
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <h4 style={styles.sectionTitle}>Thông tin cá nhân</h4>
              
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                  required
                />
              </div>

              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    type="text"
                    name="cccd"
                    value={formData.cccd}
                    onChange={handleChange}
                    placeholder="CCCD/CMND"
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Địa chỉ"
                  required
                />
              </div>

              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <input
                    style={styles.input}
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <select
                    style={styles.select}
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              style={loading ? {...styles.registerButton, ...styles.buttonDisabled} : styles.registerButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Đang xử lý...
                </>
              ) : 'Đăng ký miễn phí'}
            </button>

            {/* <div style={styles.divider}>
              <span style={styles.dividerText}>hoặc</span>
            </div>

            <button 
              type="button"
              style={styles.socialButton}
              onClick={handleGoogleSignup}
            >
              <span style={styles.googleIcon}>G</span>
              Tiếp tục với Google
            </button> */}

            {/* <button 
              type="button"
              style={{...styles.socialButton, ...styles.facebookButton}}
              onClick={handleFacebookSignup}
            >
              <span style={styles.facebookIcon}>f</span>
              Tiếp tục với Facebook
            </button> */}

            <div style={styles.loginPrompt}>
              <p>Đã có tài khoản? <a href="/login" style={styles.loginLink}>Đăng nhập</a></p>
            </div>
          </form>
        </div>
      </div>

      <div style={styles.sidePanel}>
        <div style={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            alt="Hotel view right"
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
    fontSize: '1.5rem',
    fontWeight: '600',
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
    gap: '1rem'
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
  inputRow: {
    display: 'flex',
    gap: '0.75rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    '&::placeholder': {
      color: '#9ca3af'
    }
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  registerButton: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#1e40af',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    '&:hover': {
      backgroundColor: '#1d4ed8'
    }
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: '#9ca3af'
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
  facebookButton: {
    '&:hover': {
      backgroundColor: '#f0f9ff',
      borderColor: '#60a5fa'
    }
  },
  googleIcon: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#ea4335'
  },
  facebookIcon: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#1877f2'
  },
  loginPrompt: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  loginLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline'
    }
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
`;
document.head.appendChild(styleSheet);

export default RegisterPage;