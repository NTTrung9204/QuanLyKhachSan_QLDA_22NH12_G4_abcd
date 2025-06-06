import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const BookingHistory = () => {
  const [bookings, setBookings] = useState({
    past: [],
    current: [],
    future: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Gọi API lấy lịch sử đặt phòng của khách hàng hiện tại
      const response = await api.get('/api/booking-history/my-bookings');
      console.log('API Response:', response.data);
      
      if (response.data.status === 'success') {
        // API đã trả về dữ liệu đã được phân loại
        const { past = [], current = [], future = [] } = response.data.data;
        
        setBookings({
          past: Array.isArray(past) ? past : [],
          current: Array.isArray(current) ? current : [],
          future: Array.isArray(future) ? future : []
        });
      } else {
        setError('Không thể tải lịch sử đặt phòng');
      }
    } catch (err) {
      console.error('Error fetching booking history:', err);
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra khi tải lịch sử đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      const response = await api.post(`/api/bookings/${bookingId}/cancel`);
      
      if (response.data.status === 'success') {
        // Cập nhật lại danh sách đặt phòng
        await fetchBookingHistory();
      } else {
        setError('Không thể hủy đặt phòng');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra khi hủy đặt phòng');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // Amber
      case 'confirmed':
        return '#3b82f6'; // Blue
      case 'checked-in':
        return '#10b981'; // Green
      case 'checked-out':
        return '#6b7280'; // Gray
      case 'cancelled':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Default gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'checked-in':
        return 'Đang ở';
      case 'checked-out':
        return 'Đã trả phòng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const renderBookingSection = (title, bookingList, animationDelay = 0) => (
    <div style={styles.section} className="booking-section">
      <h3 style={styles.sectionTitle}>{title}</h3>
      {bookingList.length === 0 ? (
        <div style={styles.emptyMessage}>Không có đặt phòng nào</div>
      ) : (
        <div style={styles.bookingList}>
          {bookingList.map((booking, index) => (
            <div 
              key={booking._id} 
              style={styles.bookingCard}
              className="booking-card"
              data-aos="fade-up"
              data-aos-delay={index * 100 + animationDelay}
            >
              <div style={styles.bookingHeader}>
                <div style={styles.bookingId}>
                  Mã đặt phòng: #{booking._id.slice(-6)}
                </div>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(booking.status),
                }}>
                  {getStatusText(booking.status)}
                </div>
              </div>

              <div style={styles.bookingDetails}>
                {booking.rooms.map((room, idx) => (
                  <div key={idx} style={styles.roomInfo}>
                    <div style={styles.roomName}>
                      {room.roomId?.name || 'Phòng chưa được chỉ định'}
                    </div>
                    <div style={styles.dateRange}>
                      <span style={styles.dateIcon}>📅</span>
                      {formatDate(room.checkIn)} - {formatDate(room.checkOut)}
                    </div>
                    <div style={styles.guestInfo}>
                      <span style={styles.guestIcon}>👥</span>
                      {room.numAdult} người lớn {room.numChild > 0 && `• ${room.numChild} trẻ em`}
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.bookingFooter}>
                <div style={styles.totalAmount}>
                  Tổng tiền: {formatCurrency(booking.totalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Đang tải lịch sử đặt phòng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.errorText}>{error}</p>
        <button 
          style={styles.retryButton}
          onClick={fetchBookingHistory}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Lịch sử đặt phòng</h2>
      </div>
      
      {renderBookingSection('Đặt phòng sắp tới', bookings.future, 0)}
      {renderBookingSection('Đang lưu trú', bookings.current, 200)}
      {renderBookingSection('Lịch sử đặt phòng', bookings.past, 400)}

      <div style={styles.bannerSection}>
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury hotel view"
          style={styles.bannerImage}
        />
        <div style={styles.bannerOverlay}>
          <div style={styles.bannerContent}>
            <h3 style={styles.bannerTitle}>Trải nghiệm dịch vụ đẳng cấp</h3>
            <p style={styles.bannerText}>
              Tận hưởng kỳ nghỉ tuyệt vời với những dịch vụ cao cấp và tiện nghi hiện đại
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  pageHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    padding: '3rem',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)',
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    opacity: '0.9',
  },
  section: {
    marginBottom: '3rem',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.6s ease forwards',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e5e7eb',
  },
  bookingList: {
    display: 'grid',
    gap: '1.5rem',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  bookingId: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e3a5f',
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
  },
  bookingDetails: {
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    padding: '1.5rem 0',
  },
  roomInfo: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  roomName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: '0.75rem',
  },
  dateRange: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4b5563',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  },
  dateIcon: {
    fontSize: '1.1rem',
  },
  guestInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4b5563',
    fontSize: '0.95rem',
  },
  guestIcon: {
    fontSize: '1.1rem',
  },
  bookingFooter: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#059669',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      backgroundColor: '#fecaca',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    }
  },
  smallSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #dc2626',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#4b5563',
    fontSize: '1.1rem',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#fee2e2',
    borderRadius: '12px',
    margin: '2rem',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  },
  retryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#b91c1c',
    },
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    color: '#6b7280',
    fontSize: '1rem',
    fontStyle: 'italic',
  },
  bannerSection: {
    position: 'relative',
    width: '100%',
    height: '300px',
    marginTop: '3rem',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
    display: 'flex',
    alignItems: 'center',
    padding: '2rem',
  },
  bannerContent: {
    maxWidth: '600px',
    color: 'white',
  },
  bannerTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  bannerText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .booking-section {
    animation: fadeInUp 0.6s ease forwards;
  }

  .booking-card {
    transition: all 0.3s ease;
  }

  .booking-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }

  .bannerSection:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    .pageHeader {
      padding: 2rem 1rem;
    }
    
    .pageTitle {
      font-size: 2rem;
    }
    
    .bookingCard {
      padding: 1rem;
    }
    
    .bannerSection {
      height: 250px;
    }
    
    .bannerTitle {
      font-size: 1.5rem;
    }
    
    .bannerText {
      font-size: 1rem;
    }
  }
`;
document.head.appendChild(styleSheet);

export default BookingHistory;