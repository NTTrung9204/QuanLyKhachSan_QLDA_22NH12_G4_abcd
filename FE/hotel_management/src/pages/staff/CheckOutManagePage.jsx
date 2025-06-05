import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const CheckOutManagePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Helper function to format date with time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  useEffect(() => {
    fetchCheckedInBookings();
  }, []);

  const fetchCheckedInBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings/checked-in');
      console.log(response.data.data);
      setBookings(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch checked-in bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/check-out`);
      setShowConfirmation(false);
      setSelectedBooking(null);
      // Refresh the bookings list after successful check-out
      fetchCheckedInBookings();
    } catch (err) {
      setError('Failed to check out. Please try again.');
      console.error('Error checking out:', err);
    }
  };

  const openCheckOutConfirmation = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmation(true);
  };

  const closeCheckOutConfirmation = () => {
    setSelectedBooking(null);
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="check-out-page">
      <h1 className="page-title">Checked-in Bookings</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>CCCD/CMND</th>
              <th>Room(s)</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">
                  No checked-in bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.customerId.profile?.fullName || 'N/A'}</td>
                  <td>{booking.customerId.profile?.cccd || 'N/A'}</td>
                  <td>{booking.rooms.map((room) => room.roomId.name).join(', ')}</td>
                  <td>{formatDate(booking.rooms[0].checkIn)}</td>
                  <td>{formatDate(booking.rooms[0].checkOut)}</td>
                  <td>${booking.totalAmount.toFixed(2)}</td>
                  <td className="actions-cell">
                    <button
                      className="action-button check-out-button"
                      onClick={() => openCheckOutConfirmation(booking)}
                      title="Check Out"
                    >
                      Check-Out
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showConfirmation && selectedBooking && (
        <div className="overlay">
          <div className="confirmation-popup">
            <div className="popup-header">
              <h2>Xác nhận Check-out</h2>
              <button className="close-button" onClick={closeCheckOutConfirmation}>×</button>
            </div>
            
            <div className="confirmation-content">
              <div className="info-group">
                <h3>Thông tin đặt phòng</h3>
                <div className="info-row">
                  <span className="label">Booking ID:</span>
                  <span>{selectedBooking._id}</span>
                </div>
                <div className="info-row">
                  <span className="label">Khách hàng:</span>
                  <span>{selectedBooking.customerId.profile?.fullName}</span>
                </div>
                <div className="info-row">
                  <span className="label">CCCD/CMND:</span>
                  <span>{selectedBooking.customerId.profile?.cccd}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phòng:</span>
                  <span>{selectedBooking.rooms.map(room => room.roomId.name).join(', ')}</span>
                </div>
                <div className="info-row">
                  <span className="label">Check-in:</span>
                  <span>{formatDate(selectedBooking.rooms[0].checkIn)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Check-out:</span>
                  <span>{formatDate(selectedBooking.rooms[0].checkOut)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <button 
                className="cancel-button"
                onClick={closeCheckOutConfirmation}
              >
                Hủy
              </button>
              <button 
                className="confirm-button"
                onClick={() => handleCheckOut(selectedBooking._id)}
              >
                Xác nhận Check-out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .check-out-page {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-title {
    font-size: 24px;
    color: #1a237e;
    margin-bottom: 24px;
    font-weight: 600;
  }

  .error-message {
    background-color: #ffebee;
    color: #c62828;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    border: 1px solid #ef9a9a;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1a237e;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .table-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .bookings-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .bookings-table th {
    background-color: #1a237e;
    color: white;
    padding: 16px;
    font-weight: 500;
  }

  .bookings-table td {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    color: #333;
  }

  .bookings-table tr:last-child td {
    border-bottom: none;
  }

  .bookings-table tr:hover {
    background-color: #f5f5f5;
  }

  .no-data {
    text-align: center;
    color: #666;
    padding: 32px !important;
  }

  .actions-cell {
    white-space: nowrap;
    text-align: center;
  }

  .action-button {
    background: none;
    border: none;
    padding: 8px 16px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .check-out-button {
    color: white;
    background-color: #f44336;
  }

  .check-out-button:hover {
    background-color: #d32f2f;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .confirmation-popup {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 500px;
    padding: 24px;
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .popup-header h2 {
    margin: 0;
    font-size: 20px;
    color: #1a237e;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .confirmation-content {
    margin-bottom: 24px;
  }

  .info-group {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 16px;
  }

  .info-group h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    color: #333;
  }

  .info-row {
    display: flex;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .info-row .label {
    width: 120px;
    font-weight: 500;
    color: #666;
  }

  .confirmation-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .cancel-button {
    padding: 8px 16px;
    background-color: #e0e0e0;
    border: none;
    border-radius: 4px;
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cancel-button:hover {
    background-color: #d5d5d5;
  }

  .confirm-button {
    padding: 8px 16px;
    background-color: #f44336;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .confirm-button:hover {
    background-color: #d32f2f;
  }

  @media (max-width: 1024px) {
    .check-out-page {
      padding: 16px;
    }

    .table-container {
      overflow-x: auto;
    }

    .bookings-table {
      min-width: 800px;
    }
  }

  @media (max-width: 600px) {
    .page-title {
      font-size: 20px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default CheckOutManagePage;
