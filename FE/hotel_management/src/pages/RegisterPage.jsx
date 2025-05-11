import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
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
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword || 
        !formData.fullName || !formData.phone || !formData.address || 
        !formData.cccd || !formData.birthDate) {
      setError('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (formData.username.length < 4) {
      setError('Tên đăng nhập phải có ít nhất 4 ký tự');
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
      // Here you would normally call your API to register the user
      setTimeout(() => {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          username: formData.username,
          name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          cccd: formData.cccd,
          birthDate: formData.birthDate,
          gender: formData.gender,
          role: 'user'
        };
        
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
          login(newUser);
          navigate('/');
        }, 1500);
        
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      setError('Đăng ký thất bại. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.leftColumn}>
          <div style={styles.formHeader}>
            <h2 style={styles.heading}>Đăng ký tài khoản</h2>
            <p style={styles.subheading}>Vui lòng điền đầy đủ thông tin để tạo tài khoản</p>
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
              <div style={styles.sectionTitle}>Thông tin tài khoản</div>
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
                  placeholder="Ví dụ: john_doe"
                />
              </div>

              <div style={styles.formRow}>
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
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="confirmPassword">
                    Xác nhận mật khẩu <span style={styles.requiredMark}>*</span>
                  </label>
                  <input
                    style={styles.formInput}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <div style={styles.sectionTitle}>Thông tin cá nhân</div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="fullName">
                  Họ và tên <span style={styles.requiredMark}>*</span>
                </label>
                <input
                  style={styles.formInput}
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="phone">
                    Số điện thoại <span style={styles.requiredMark}>*</span>
                  </label>
                  <input
                    style={styles.formInput}
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="0987654321"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="cccd">
                    CCCD <span style={styles.requiredMark}>*</span>
                  </label>
                  <input
                    style={styles.formInput}
                    type="text"
                    id="cccd"
                    name="cccd"
                    value={formData.cccd}
                    onChange={handleChange}
                    required
                    placeholder="12 chữ số"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="address">
                  Địa chỉ <span style={styles.requiredMark}>*</span>
                </label>
                <input
                  style={styles.formInput}
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Địa chỉ đầy đủ"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="birthDate">
                    Ngày sinh <span style={styles.requiredMark}>*</span>
                  </label>
                  <input
                    style={styles.formInput}
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="gender">
                    Giới tính <span style={styles.requiredMark}>*</span>
                  </label>
                  <select
                    style={styles.formSelect}
                    id="gender"
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

            <div style={styles.termsContainer}>
              <p style={styles.termsText}>
                Bằng cách đăng ký, bạn đồng ý với <a href="#" style={styles.termsLink}>Điều khoản dịch vụ</a> và <a href="#" style={styles.termsLink}>Chính sách bảo mật</a> của chúng tôi.
              </p>
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
              ) : 'Đăng ký'}
            </button>

            <div style={styles.loginPrompt}>
              <p>Đã có tài khoản? <Link to="/login" style={styles.link}>Đăng nhập</Link></p>
            </div>
          </form>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.welcomeSection}>
            <h3 style={styles.welcomeTitle}>Chào mừng đến với khách sạn của chúng tôi!</h3>
            <p style={styles.welcomeText}>
              Đăng ký tài khoản để trải nghiệm dịch vụ đặt phòng trực tuyến và nhận nhiều ưu đãi hấp dẫn.
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
    maxWidth: '1200px',
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
    textAlign: 'left'
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
  alertSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
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
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
    width: '100%',
    boxSizing: 'border-box'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.8rem',
    paddingBottom: '0.3rem',
    borderBottom: '2px solid #e2e8f0'
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    flexWrap: 'wrap'
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
  formInputWithIcon: {
    width: '100%',
    padding: '0.75rem',
    paddingRight: '2.5rem',
    fontSize: '1rem',
    backgroundColor: '#fff',  
    color: '#000',    
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s',
    outline: 'none'
  },
  inputWithIcon: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  },
  formSelect: {
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
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 8.5l-4-4h8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    paddingRight: '2.5rem'
  },
  termsContainer: {
    padding: '0.8rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginTop: '0.8rem'
  },
  termsText: {
    fontSize: '0.875rem',
    color: '#64748b',
    textAlign: 'center'
  },
  termsLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline'
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
  loginPrompt: {
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

export default RegisterPage;
