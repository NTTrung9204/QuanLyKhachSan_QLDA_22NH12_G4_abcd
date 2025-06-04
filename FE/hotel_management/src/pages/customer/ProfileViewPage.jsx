import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const ProfileViewPage = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });
  
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/users/profile');
        console.log('Response data:', response.data);
        
        // Kiểm tra và map dữ liệu an toàn hơn
        const userData = response.data.data; // API trả về data trong response.data.data
        
        const mappedData = {
          fullName: userData?.profile?.fullName || '',
          email: userData?.profile?.email || '',
          phone: userData?.profile?.phone || '',
          address: userData?.profile?.address || '',
          dateOfBirth: userData?.profile?.birthDate || '',
          gender: userData?.profile?.gender || '',
        };
        
        console.log('Mapped data:', mappedData);
        
        setProfileData(mappedData);
        setEditData(mappedData);
        setFetchLoading(false);
      } catch (error) {
        console.error('Lỗi khi fetch profile:', error);
        setError('Không thể tải thông tin người dùng');
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert changes
      setEditData(profileData);
      setError('');
      setSuccess('');
    } else {
      // Start editing
      setEditData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Log dữ liệu trước khi gửi
      console.log('Dữ liệu gửi đi:', {
        fullName: editData.fullName,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        birthDate: editData.dateOfBirth,
        gender: editData.gender
      });

      const response = await api.patch('/api/users/profile', {
        fullName: editData.fullName,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        birthDate: editData.dateOfBirth,
        gender: editData.gender
      });

      console.log('Response sau khi update:', response.data);

      // Cập nhật lại state với dữ liệu mới
      const updatedData = response.data.data;
      const mappedData = {
        fullName: updatedData.profile.fullName || '',
        email: updatedData.profile.email || '',
        phone: updatedData.profile.phone || '',
        address: updatedData.profile.address || '',
        dateOfBirth: updatedData.profile.birthDate || '',
        gender: updatedData.profile.gender || '',
      };

      setProfileData(mappedData);
      setEditData(mappedData);
      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      console.error('Chi tiết lỗi:', error.response?.data);
      setError('Không thể cập nhật thông tin: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getGenderText = (gender) => {
    switch(gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  };

  // Thêm các component Icon
  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );

  const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );

  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  );

  if (fetchLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.centerPanel}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <div style={styles.profileContainer}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerInfo}>
              <h2 style={styles.userName}>{profileData.fullName || 'Chưa cập nhật'}</h2>
              <p style={styles.userEmail}>{profileData.email || 'Chưa cập nhật email'}</p>
            </div>
            
            <button 
              style={isEditing ? styles.cancelButton : styles.editButton}
              onClick={handleEditToggle}
              disabled={loading}
            >
              {isEditing ? (
                <>
                  <XIcon />
                  Hủy
                </>
              ) : (
                <>
                  <EditIcon />
                  Chỉnh sửa
                </>
              )}
            </button>
          </div>

          {/* Messages */}
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

          {/* Profile Information */}
          <div style={styles.profileSection}>
            <h3 style={styles.sectionTitle}>Thông tin cá nhân</h3>
            
            <div style={styles.infoGrid}>
              {/* Full Name */}
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <UserIcon style={styles.infoIcon} />
                  Họ và tên
                </div>
                {isEditing ? (
                  <input
                    style={styles.editInput}
                    type="text"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.fullName || 'Chưa cập nhật'}</div>
                )}
              </div>

              {/* Email */}
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <MailIcon style={styles.infoIcon} />
                  Email
                </div>
                {isEditing ? (
                  <input
                    style={styles.editInput}
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.email || 'Chưa cập nhật'}</div>
                )}
              </div>

              {/* Phone */}
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <PhoneIcon style={styles.infoIcon} />
                  Số điện thoại
                </div>
                {isEditing ? (
                  <input
                    style={styles.editInput}
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.phone || 'Chưa cập nhật'}</div>
                )}
              </div>

              {/* Address */}
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <MapPinIcon style={styles.infoIcon} />
                  Địa chỉ
                </div>
                {isEditing ? (
                  <textarea
                    style={{...styles.editInput, ...styles.textarea}}
                    name="address"
                    value={editData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    rows="2"
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.address || 'Chưa cập nhật'}</div>
                )}
              </div>

              {/* Date of Birth */}
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <CalendarIcon style={styles.infoIcon} />
                  Ngày sinh
                </div>
                {isEditing ? (
                  <input
                    style={styles.editInput}
                    type="date"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleChange}
                  />
                ) : (
                  <div style={styles.infoValue}>{formatDate(profileData.dateOfBirth)}</div>
                )}
              </div>

              {/* Gender */}
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <UsersIcon style={styles.infoIcon} />
                  Giới tính
                </div>
                {isEditing ? (
                  <select
                    style={styles.editInput}
                    name="gender"
                    value={editData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                ) : (
                  <div style={styles.infoValue}>{getGenderText(profileData.gender)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div style={styles.saveSection}>
              <button 
                style={loading ? {...styles.saveButton, ...styles.buttonDisabled} : styles.saveButton}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          )}
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
    flex: '0 0 700px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    overflowY: 'auto'
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
  profileContainer: {
    width: '100%',
    maxWidth: '600px',
    marginTop: '2rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    color: '#6b7280',
    marginTop: '3rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  userName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#3b82f6',
    backgroundColor: '#ffffff',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#dc2626',
    backgroundColor: '#ffffff',
    border: '1px solid #dc2626',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
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
  profileSection: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb'
  },
  infoGrid: {
    display: 'grid',
    gap: '1.5rem'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },
  infoIcon: {
    color: '#6b7280'
  },
  infoValue: {
    fontSize: '0.875rem',
    color: '#1f2937',
    padding: '0.75rem',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e2e8f0'
  },
  editInput: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    border: '2px solid #3b82f6',
    borderRadius: '6px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  textarea: {
    resize: 'vertical',
    minHeight: '60px'
  },
  saveSection: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
  },
  buttonDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};

export default ProfileViewPage;