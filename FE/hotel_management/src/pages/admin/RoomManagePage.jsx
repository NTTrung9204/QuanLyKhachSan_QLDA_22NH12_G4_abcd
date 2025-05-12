import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const styles = {
  container: {
    padding: '2rem',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#000000'
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.5)'
  },
  addButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#1f2937',
    backgroundColor: '#f8fafc',
    minWidth: '150px'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'left',
    verticalAlign: 'top',
    color: '#000000'
  },
  actionTd: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center',
    width: '80px'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#000000'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#f8fafc'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    color: '#000000'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    color: '#000000'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  cancelButton: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    color: 'red'
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  floorHeader: {
    backgroundColor: '#e5e7eb',
    padding: '12px',
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'left',
    borderBottom: '1px solid #d1d5db'
  },
  floorRow: {
    backgroundColor: '#f3f4f6'
  }
};

const RoomManagePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomTypeId: '',
    name: '',
    floor: 1
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/rooms');
      console.log('fetchRooms', response.data.data);
      setRooms(response.data.data);
    } catch (error) {
      alert('Không thể tải danh sách phòng');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await api.get('/api/room-types');
      console.log('fetchRoomTypes', response.data.data);
      setRoomTypes(response.data.data);
    } catch (error) {
      alert('Không thể tải danh sách loại phòng');
      console.error('Error fetching room types:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/rooms', formData);
      alert('Thêm phòng thành công');
      setIsModalVisible(false);
      setFormData({
        roomTypeId: '',
        name: '',
        floor: 1
      });
      fetchRooms();
    } catch (error) {
      alert('Không thể thêm phòng');
      console.error('Error adding room:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        await api.delete(`/api/rooms/${id}`);
        alert('Xóa phòng thành công');
        fetchRooms();
      } catch (error) {
        alert('Không thể xóa phòng');
        console.error('Error deleting room:', error);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hàm nhóm phòng theo tầng
  const groupRoomsByFloor = (rooms) => {
    // Sắp xếp phòng theo tầng và tên
    const sortedRooms = [...rooms].sort((a, b) => {
      if (a.floor !== b.floor) {
        return a.floor - b.floor;
      }
      return a.name.localeCompare(b.name);
    });

    // Nhóm phòng theo tầng
    const grouped = {};
    sortedRooms.forEach(room => {
      if (!grouped[room.floor]) {
        grouped[room.floor] = [];
      }
      grouped[room.floor].push(room);
    });

    return grouped;
  };

  const renderRoomTable = () => {
    const groupedRooms = groupRoomsByFloor(rooms);
    const floors = Object.keys(groupedRooms).sort((a, b) => Number(a) - Number(b));

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Tên phòng</th>
            <th style={styles.th}>Loại phòng</th>
            <th style={styles.th}>Giá mỗi đêm</th>
            <th style={styles.th}>Số người</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {floors.map(floor => (
            <React.Fragment key={floor}>
              <tr>
                <td colSpan="5" style={styles.floorHeader}>
                  Tầng {floor}
                </td>
              </tr>
              {groupedRooms[floor].map(room => (
                <tr key={room._id}>
                  <td style={styles.td}>{room.name}</td>
                  <td style={styles.td}>
                    {room.roomTypeId?.name || 'N/A'}
                  </td>
                  <td style={styles.td}>
                    {room.roomTypeId ? formatPrice(room.roomTypeId.pricePerNight) : 'N/A'}
                  </td>
                  <td style={styles.td}>
                    {room.roomTypeId ? `${room.roomTypeId.maxAdult} người lớn, ${room.roomTypeId.maxChild} trẻ em` : 'N/A'}
                  </td>
                  <td style={styles.actionTd}>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(room._id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Quản lý phòng</h1>
        <button style={styles.addButton} onClick={() => setIsModalVisible(true)}>
          Thêm phòng
        </button>
      </div>

      <div style={styles.tableContainer}>
        {renderRoomTable()}
      </div>

      {isModalVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Thêm phòng mới</h2>
              <button 
                style={styles.deleteButton}
                onClick={() => setIsModalVisible(false)}
              >
                ✕
              </button>
            </div>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Loại phòng</label>
                <select
                  style={styles.select}
                  name="roomTypeId"
                  value={formData.roomTypeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn loại phòng</option>
                  {roomTypes.map(roomType => (
                    <option key={roomType._id} value={roomType._id}>
                      {roomType.name} - {formatPrice(roomType.pricePerNight)} - {roomType.maxAdult} người lớn, {roomType.maxChild} trẻ em
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tên phòng</label>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tầng</label>
                <input
                  style={styles.input}
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setIsModalVisible(false)}
                >
                  Hủy
                </button>
                <button type="submit" style={styles.submitButton}>
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagePage;
