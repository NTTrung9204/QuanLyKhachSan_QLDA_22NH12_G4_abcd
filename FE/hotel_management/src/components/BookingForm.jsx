import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Plus, Trash2, Clock, Hotel, Coffee } from 'lucide-react';
import api from '../api/axios';

const BookingForm = ({ selectedRoom, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    rooms: [{
      roomTypeId: selectedRoom ? selectedRoom.id : '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      numAdult: selectedRoom ? selectedRoom.capacity.adult : 1,
      numChild: selectedRoom ? selectedRoom.capacity.child : 0
    }],
    services: []
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableRoomTypes, setAvailableRoomTypes] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableRooms, setAvailableRooms] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Starting API calls...');
      
      // Gọi API riêng lẻ để dễ debug
      let roomTypesData, servicesData, userData, roomsData;
      
      try {
        const roomTypesRes = await api.get('/api/room-types');
        console.log('Room types API response:', roomTypesRes);
        roomTypesData = roomTypesRes.data;
        setRoomTypes(roomTypesData.data);
      } catch (err) {
        console.error('Error fetching room types:', err);
        throw new Error('Không thể tải danh sách loại phòng: ' + (err.response?.data?.message || err.message));
      }

      try {
        const roomsRes = await api.get('/api/rooms');
        console.log('Rooms API response:', roomsRes);
        roomsData = roomsRes.data;
      } catch (err) {
        console.error('Error fetching rooms:', err);
        throw new Error('Không thể tải danh sách phòng: ' + (err.response?.data?.message || err.message));
      }

      try {
        const servicesRes = await api.get('/api/services');
        console.log('Services API response:', servicesRes);
        servicesData = servicesRes.data;
      } catch (err) {
        console.error('Error fetching services:', err);
        throw new Error('Không thể tải danh sách dịch vụ: ' + (err.response?.data?.message || err.message));
      }

      // Lấy thông tin user từ localStorage (được lưu sau khi login)
      try {
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          userData = JSON.parse(userDataStr);
          console.log('User data from localStorage:', userData);
        } else {
          console.warn('No user data found in localStorage');
        }
      } catch (err) {
        console.error('Error getting user data:', err);
        throw new Error('Không thể lấy thông tin người dùng: ' + err.message);
      }

      // Xử lý dữ liệu phòng và loại phòng
      if (roomTypesData.status === 'success' && Array.isArray(roomTypesData.data)) {
        setAvailableRoomTypes(roomTypesData.data);
        console.log('Room types loaded:', roomTypesData.data.length);
      } else {
        console.warn('Invalid room types data format:', roomTypesData);
        throw new Error('Dữ liệu loại phòng không hợp lệ');
      }

      // Xử lý dữ liệu phòng cụ thể
      if (roomsData.status === 'success' && Array.isArray(roomsData.data)) {
        // Tổ chức phòng theo loại phòng
        const roomsByType = {};
        roomsData.data.forEach(room => {
          const typeId = room.roomTypeId._id;
          if (!roomsByType[typeId]) {
            roomsByType[typeId] = [];
          }
          roomsByType[typeId].push(room);
        });
        setAvailableRooms(roomsByType);
        console.log('Rooms loaded and organized by type:', Object.keys(roomsByType).length);
      } else {
        console.warn('Invalid rooms data format:', roomsData);
        throw new Error('Dữ liệu phòng không hợp lệ');
      }

      // Xử lý dữ liệu dịch vụ
      if (servicesData.status === 'success' && Array.isArray(servicesData.data)) {
        setAvailableServices(servicesData.data);
        console.log('Services loaded:', servicesData.data.length);
      } else {
        console.warn('Invalid services data format:', servicesData);
        throw new Error('Dữ liệu dịch vụ không hợp lệ');
      }
      
      // Xử lý dữ liệu user
      if (userData) {
        const email = userData.email;  // Lấy email trực tiếp từ response login
        if (email) {
          setFormData(prev => ({
            ...prev,
            customerId: email
          }));
          console.log('User email loaded:', email);
        } else {
          console.warn('No email found in user data');
        }
      }

    } catch (error) {
      console.error('Final error:', error);
      let errorMessage = 'Không thể tải dữ liệu. ';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage += 'API không tồn tại hoặc sai đường dẫn. Chi tiết: ' + error.message;
        } else {
          errorMessage += `Lỗi server: ${error.response.status} - ${error.response.data?.message || error.message}`;
        }
      } else if (error.request) {
        errorMessage += 'Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateFromInput = (inputDate) => {
    if (!inputDate) return '';
    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchAvailableRooms = async (roomTypeId, checkIn, checkOut) => {
    if (!roomTypeId || !checkIn || !checkOut) return;
    
    try {
      const selectedRoomType = roomTypes.find(rt => rt._id === roomTypeId);
      const formattedCheckIn = new Date(checkIn);
      const formattedCheckOut = new Date(checkOut);
      
      console.log('=== CHECKING AVAILABLE ROOMS ===');
      console.log('Request Parameters:', {
        roomTypeId,
        roomTypeName: selectedRoomType?.name,
        checkIn: formatDate(formattedCheckIn),
        checkOut: formatDate(formattedCheckOut)
      });

      // 1. Lấy tất cả phòng và lọc theo loại phòng
      const roomsRes = await api.get('/api/rooms');

      console.log('=== ROOMS CHECK ===');
      console.log('Raw API response:', roomsRes.data);
      
      if (!roomsRes.data.data || !Array.isArray(roomsRes.data.data)) {
        console.error('Invalid rooms data format');
        setError('Không thể lấy danh sách phòng');
        return;
      }

      // Lọc ra những phòng thuộc loại phòng được chọn
      const roomsOfType = roomsRes.data.data.filter(room => {
        const roomTypeIdFromResponse = room.roomTypeId?._id;
        const isMatch = roomTypeIdFromResponse === roomTypeId;
        console.log(`Room ${room.name} (${roomTypeIdFromResponse}):`, {
          roomType: room.roomTypeId?.name,
          isMatch
        });
        return isMatch;
      });
      
      console.log('Rooms for this type:', {
        roomType: selectedRoomType?.name,
        total: roomsOfType.length,
        rooms: roomsOfType.map(room => ({
          id: room._id,
          name: room.name,
          floor: room.floor,
          roomType: room.roomTypeId.name
        }))
      });

      if (!roomsOfType || roomsOfType.length === 0) {
        console.log('No rooms found for room type:', selectedRoomType?.name);
        setError(`Chưa có phòng nào được tạo cho loại phòng ${selectedRoomType?.name || 'này'}`);
        setAvailableRooms(prev => ({
          ...prev,
          [roomTypeId]: []
        }));
        return;
      }

      // 2. Kiểm tra phòng nào đã được đặt trong khoảng thời gian này
      const bookingsRes = await api.get('/api/bookings', {
        params: {
          checkIn: formattedCheckIn.toISOString(),
          checkOut: formattedCheckOut.toISOString()
        }
      });

      console.log('=== BOOKINGS CHECK ===');
      console.log('Bookings response:', bookingsRes.data);

      // Lấy danh sách phòng đã được đặt
      const bookedRoomIds = new Set();
      if (bookingsRes.data.status === 'success' && Array.isArray(bookingsRes.data.data)) {
        bookingsRes.data.data.forEach(booking => {
          booking.rooms.forEach(room => {
            if (room.roomId) {
              bookedRoomIds.add(room.roomId._id || room.roomId);
            }
          });
        });
      }

      console.log('Booked room IDs:', Array.from(bookedRoomIds));

      // Lọc ra những phòng còn trống
      const availableRooms = roomsOfType.filter(room => !bookedRoomIds.has(room._id));

      console.log('=== RESULTS ===');
      console.log(`Found ${availableRooms.length} available rooms out of ${roomsOfType.length} total rooms`);
      console.log('Available rooms:', availableRooms.map(room => ({
        id: room._id,
        name: room.name,
        floor: room.floor
      })));

      setAvailableRooms(prev => ({
        ...prev,
        [roomTypeId]: availableRooms
      }));

      if (availableRooms.length === 0) {
        setError(`Tất cả phòng loại ${selectedRoomType.name} đã được đặt trong thời gian từ ${formatDate(formattedCheckIn)} đến ${formatDate(formattedCheckOut)}`);
      } else {
        setError('');
      }

    } catch (err) {
      console.error('Error fetching available rooms:', err);
      const errorMsg = err.response?.data?.message || err.message;
      setError('Không thể tải danh sách phòng trống: ' + errorMsg);
      setAvailableRooms(prev => ({
        ...prev,
        [roomTypeId]: []
      }));
    }
  };

  const handleRoomChange = async (index, field, value) => {
    const newRooms = [...formData.rooms];
    
    // Xử lý đặc biệt cho trường hợp date
    if (field === 'checkIn' || field === 'checkOut') {
      // Chuyển đổi từ dd/mm/yyyy sang yyyy-mm-dd cho input
      const [day, month, year] = value.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      newRooms[index] = { ...newRooms[index], [field]: formattedDate };
    } else {
      newRooms[index] = { ...newRooms[index], [field]: value };
    }
    
    // Reset roomId when roomTypeId or dates change
    if (field === 'roomTypeId' || field === 'checkIn' || field === 'checkOut') {
      newRooms[index].roomId = '';
    }
    
    // Nếu thay đổi roomTypeId, cập nhật lại số người tối đa
    if (field === 'roomTypeId') {
      const selectedRoomType = availableRoomTypes.find(r => r._id === value);
      if (selectedRoomType) {
        newRooms[index].numAdult = selectedRoomType.maxAdult || 1;
        newRooms[index].numChild = selectedRoomType.maxChild || 0;
      }
    }
    
    setFormData({ ...formData, rooms: newRooms });

    // Fetch available rooms when both dates and room type are selected
    const room = newRooms[index];
    if (room.roomTypeId && room.checkIn && room.checkOut) {
      console.log('Checking available rooms for:', {
        roomType: availableRoomTypes.find(r => r._id === room.roomTypeId)?.name,
        checkIn: room.checkIn,
        checkOut: room.checkOut
      });
      await fetchAvailableRooms(room.roomTypeId, room.checkIn, room.checkOut);
    }
  };

  const addRoom = () => {
    setFormData({
      ...formData,
      rooms: [...formData.rooms, {
        roomTypeId: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        numAdult: 1,
        numChild: 0
      }]
    });
  };

  const removeRoom = (index) => {
    if (formData.rooms.length > 1) {
      const newRooms = formData.rooms.filter((_, i) => i !== index);
      setFormData({ ...formData, rooms: newRooms });
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, {
        serviceId: '',
        quantity: 1,
        useDate: ''
      }]
    });
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Tính tiền phòng
    formData.rooms.forEach(room => {
      const roomType = availableRoomTypes.find(r => r._id === room.roomTypeId);
      if (roomType && room.checkIn && room.checkOut) {
        const days = Math.ceil((new Date(room.checkOut) - new Date(room.checkIn)) / (1000 * 60 * 60 * 24));
        total += roomType.pricePerNight * Math.max(1, days);
      }
    });

    // Tính tiền dịch vụ
    formData.services.forEach(service => {
      const serviceInfo = availableServices.find(s => s._id === service.serviceId);
      if (serviceInfo) {
        total += serviceInfo.price * service.quantity;
      }
    });

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Validate form
      if (!formData.customerId.trim()) {
        throw new Error('Vui lòng nhập email khách hàng');
      }

      for (let room of formData.rooms) {
        if (!room.roomTypeId || !room.checkIn || !room.checkOut) {
          throw new Error('Vui lòng điền đầy đủ thông tin phòng');
        }
        if (!room.roomId) {
          throw new Error('Vui lòng chọn phòng cụ thể cho mỗi đặt phòng');
        }
        if (new Date(room.checkOut) <= new Date(room.checkIn)) {
          throw new Error('Ngày trả phòng phải sau ngày nhận phòng');
        }
      }

      // Format data before sending
      const bookingData = {
        ...formData,
        rooms: formData.rooms.map(room => ({
          roomId: room.roomId,  // Ensure we're sending roomId
          checkIn: new Date(room.checkIn).toISOString(),
          checkOut: new Date(room.checkOut).toISOString(),
          numAdult: room.numAdult,
          numChild: room.numChild
        })),
        services: formData.services.filter(service => service.serviceId).map(service => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
          useDate: service.useDate ? new Date(service.useDate).toISOString() : null
        }))
      };

      console.log('Sending booking data:', bookingData);

      // Call API to create booking
      const response = await api.post('/api/bookings', bookingData);
      console.log('Booking response:', response.data);
      
      if (response.data.status === 'success') {
        setSuccess('Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        
        // Close form after successful submission
        setTimeout(() => {
          onClose();
        }, 2000);
      }

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidePanel}>
        <div style={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            alt="Luxury hotel lobby"
            style={styles.backgroundImage}
          />
          <div style={styles.overlay}></div>
        </div>
      </div>

      <div style={styles.centerPanel}>
        <div style={styles.formContainer}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>
              <Hotel size={32} color="#ffffff" />
            </div>
          </div>

          <div style={styles.header}>
            <h2 style={styles.title}>Đặt Phòng Khách Sạn</h2>
            <p style={styles.subtitle}>
              Đặt phòng dễ dàng và nhanh chóng với dịch vụ chuyên nghiệp
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

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Thông tin khách hàng */}
            <div style={styles.formSection}>
              <h4 style={styles.sectionTitle}>
                <Users size={16} style={styles.titleIcon} />
                Thông tin khách hàng
              </h4>
              
              <div style={styles.inputGroup}>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.customerId}
                  onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                  placeholder="Email khách hàng"
                  required
                />
              </div>
            </div>

            {/* Thông tin phòng */}
            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h4 style={styles.sectionTitle}>
                  <MapPin size={16} style={styles.titleIcon} />
                  Thông tin phòng ({formData.rooms.length})
                </h4>
                <button 
                  type="button" 
                  style={styles.addButton}
                  onClick={addRoom}
                >
                  <Plus size={16} />
                  Thêm phòng
                </button>
              </div>

              {formData.rooms.map((room, index) => (
                <div key={index} style={styles.roomCard}>
                  <div style={styles.roomHeader}>
                    <span style={styles.roomNumber}>Phòng {index + 1}</span>
                    {formData.rooms.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() => removeRoom(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Loại phòng</label>
                      <select
                        style={styles.input}
                        value={room.roomTypeId}
                        onChange={(e) => handleRoomChange(index, 'roomTypeId', e.target.value)}
                        required
                      >
                        <option value="">Chọn loại phòng</option>
                        {availableRoomTypes.map(type => (
                          <option key={type._id} value={type._id}>
                            {type.name} - {type.maxAdult} người lớn, {type.maxChild} trẻ em - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.pricePerNight)}/đêm
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Chọn phòng cụ thể */}
                  {room.roomTypeId && room.checkIn && room.checkOut && (
                    <div style={styles.inputRow}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Chọn phòng trống</label>
                        <select
                          style={styles.input}
                          value={room.roomId || ''}
                          onChange={(e) => handleRoomChange(index, 'roomId', e.target.value)}
                          required
                        >
                          <option value="">Chọn phòng trống</option>
                          {availableRooms[room.roomTypeId]?.map(availableRoom => {
                            // Kiểm tra xem phòng có đầy đủ thông tin không
                            if (!availableRoom || !availableRoom._id) return null;
                            
                            const roomName = availableRoom.name || 'N/A';
                            const floorNumber = availableRoom.floor || 'N/A';
                            const roomTypeName = availableRoom.roomTypeId?.name || '';
                            
                            return (
                              <option key={availableRoom._id} value={availableRoom._id}>
                                {`Số phòng: ${roomName} - Tầng ${floorNumber}${
                                  roomTypeName ? ` - ${roomTypeName}` : ''
                                }`}
                              </option>
                            );
                          })}
                        </select>
                        {(!availableRooms[room.roomTypeId] || availableRooms[room.roomTypeId].length === 0) && (
                          <div style={styles.warning}>
                            Không có phòng trống cho thời gian này
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Ngày nhận phòng</label>
                      <input
                        style={styles.input}
                        type="date"
                        value={formatDateForInput(room.checkIn)}
                        onChange={(e) => handleRoomChange(index, 'checkIn', formatDateFromInput(e.target.value))}
                        required
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Ngày trả phòng</label>
                      <input
                        style={styles.input}
                        type="date"
                        value={formatDateForInput(room.checkOut)}
                        onChange={(e) => handleRoomChange(index, 'checkOut', formatDateFromInput(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Số người lớn</label>
                      <input
                        style={styles.input}
                        type="number"
                        min="1"
                        value={room.numAdult || 1}
                        onChange={(e) => handleRoomChange(index, 'numAdult', parseInt(e.target.value))}
                        required
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Số trẻ em</label>
                      <input
                        style={styles.input}
                        type="number"
                        min="0"
                        value={room.numChild || 0}
                        onChange={(e) => handleRoomChange(index, 'numChild', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dịch vụ thêm */}
            <div style={styles.formSection}>
              <div style={styles.sectionHeader}>
                <h4 style={styles.sectionTitle}>
                  <Coffee size={16} style={styles.titleIcon} />
                  Dịch vụ thêm ({formData.services.length})
                </h4>
                <button 
                  type="button" 
                  style={styles.addButton}
                  onClick={addService}
                >
                  <Plus size={16} />
                  Thêm dịch vụ
                </button>
              </div>

              {formData.services.length === 0 ? (
                <p style={styles.emptyMessage}>Chưa có dịch vụ nào được chọn</p>
              ) : (
                formData.services.map((service, index) => (
                  <div key={index} style={styles.serviceCard}>
                    <div style={styles.serviceHeader}>
                      <span style={styles.serviceNumber}>Dịch vụ {index + 1}</span>
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() => removeService(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={styles.inputRow}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Loại dịch vụ</label>
                        <select
                          style={styles.select}
                          value={service.serviceId}
                          onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                          required
                        >
                          <option value="">Chọn dịch vụ</option>
                          {availableServices.map(s => (
                            <option key={s._id} value={s._id}>
                              {s.name} - {s.price.toLocaleString('vi-VN')}đ
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Số lượng</label>
                        <input
                          style={styles.input}
                          type="number"
                          min="1"
                          value={service.quantity}
                          onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        <Clock size={14} style={styles.labelIcon} />
                        Ngày sử dụng
                      </label>
                      <input
                        style={styles.input}
                        type="datetime-local"
                        value={service.useDate}
                        onChange={(e) => handleServiceChange(index, 'useDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tổng tiền */}
            <div style={styles.totalSection}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Tổng tiền ước tính:</span>
                <span style={styles.totalAmount}>
                  {calculateTotal().toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              style={loading ? {...styles.submitButton, ...styles.buttonDisabled} : styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Đang xử lý...
                </>
              ) : 'Đặt phòng ngay'}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.sidePanel}>
        <div style={styles.imageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
            alt="Luxury hotel room"
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc'
  },
  sidePanel: {
    flex: '1',
    position: 'relative',
    minHeight: '100vh'
  },
  centerPanel: {
    flex: '0 0 600px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '2rem',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    maxHeight: '100vh'
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
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)'
  },
  formContainer: {
    width: '100%',
    maxWidth: '550px',
    marginTop: '2rem'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  logo: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.875rem',
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
    borderRadius: '8px',
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
    borderRadius: '8px',
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
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center'
  },
  titleIcon: {
    marginRight: '0.5rem',
    color: '#0ea5e9'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#0ea5e9',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    border: '1px solid #0ea5e9',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  inputRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center'
  },
  labelIcon: {
    marginRight: '0.5rem',
    color: '#0ea5e9'
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
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  roomCard: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginBottom: '1rem'
  },
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  roomNumber: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0ea5e9'
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginBottom: '1rem'
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  serviceNumber: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0ea5e9'
  },
  removeButton: {
    padding: '0.5rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    color: '#dc2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontStyle: 'italic',
    margin: 0
  },
  totalSection: {
    padding: '1.5rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '12px',
    border: '1px solid #0ea5e9'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#374151'
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0ea5e9'
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 6px rgba(14, 165, 233, 0.2)'
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
  },
  warning: {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '0.5rem'
  }
};

// Add CSS for responsive design and animations
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
    .inputRow {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(styleSheet);

export default BookingForm;