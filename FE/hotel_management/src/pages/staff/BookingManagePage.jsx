import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/axios';

const styles = {
    bookingPage: {
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
    },
    
    bookingContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
    },
    
    bookingTitle: {
        color: '#333',
        fontSize: '2rem',
        marginBottom: '30px',
        textAlign: 'center'
    },
    
    searchForm: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    
    label: {
        fontWeight: '500',
        color: '#000'
    },
    
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: 'white',
        color: '#000',
        '&:focus': {
            borderColor: '#2196f3'
        }
    },
    
    searchButton: {
        padding: '12px 24px',
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: 'auto',
        alignSelf: 'flex-end',
        '&:hover': {
            backgroundColor: '#1976d2'
        }
    },
    
    searchResults: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    
    roomGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    
    noResults: {
        textAlign: 'center',
        color: '#666',
        fontSize: '1.1rem',
        padding: '40px 0'
    },

    '@media (max-width: 768px)': {
        searchForm: {
            gridTemplateColumns: '1fr'
        },
        bookingContainer: {
            padding: '10px'
        },
        searchButton: {
            width: '100%'
        }
    },

    roomTypeOption: {
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        gap: '4px'
    },
    roomTypeName: {
        fontWeight: 'bold'
    },
    roomTypePrice: {
        color: '#2196f3'
    },
    roomTypeDetails: {
        fontSize: '0.9rem',
        color: '#666'
    },
    roomCard: {
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white'
    },
    roomName: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#333',
        textAlign: 'center'
    },
    timeInputContainer: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginTop: '8px'
    },
    timeInput: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100px'
    },
    roomTypeSection: {
        marginBottom: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    roomTypeHeader: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        marginBottom: '12px',
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
        color: '#333',
        textAlign: 'start'
    },
    roomTypeInfo: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '16px',
        color: '#555'
    },
    roomTypeDetail: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    priceText: {
        color: '#1976d2',
        fontWeight: '500'
    },
    roomsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
    },
    floorBadge: {
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.9rem',
        display: 'inline-block'
    },
    selectedRoomInfo: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    customerForm: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        alignItems: 'flex-end'
    },
    customerInputGroup: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: '5px'
    },
    customerInfo: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
    },
    customerInfoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
    },
    customerInfoItem: {
        margin: '5px 0'
    },
    customerLabel: {
        fontWeight: 'bold',
        marginRight: '5px'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    popup: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '25px',
        width: '85%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto'
    },
    popupHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
        marginBottom: '25px'
    },
    popupTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#000'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#666'
    },
    formSection: {
        marginBottom: '30px',
        padding: '0 10px'
    },
    sectionTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#000'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
    },
    formInputGroup: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    confirmButton: {
        padding: '12px 24px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#388e3c'
        }
    },
    cancelButton: {
        padding: '12px 24px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#d32f2f'
        }
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '30px',
        gap: '15px'
    },
    formRow: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
    },
    formInputContainer: {
        flex: 1
    },
    readOnlyInput: {
        backgroundColor: 'white',
        cursor: 'not-allowed',
        border: '1px solid #eee',
        color: '#000'
    },
    resetButton: {
        padding: '12px 24px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: 'auto',
        alignSelf: 'flex-end',
        '&:hover': {
            backgroundColor: '#d32f2f'
        }
    }
};

export default function BookingManagePage() {
    const getDefaultDateTime = () => {
        const date = new Date();
        // Làm tròn đến 30 phút gần nhất
        const minutes = Math.ceil(date.getMinutes() / 30) * 30;
        date.setMinutes(minutes, 0, 0);
        return date.toISOString().slice(0, 16); // Lấy đến phút (YYYY-MM-DDTHH:mm)
    };

    const getDefaultCheckOutTime = (checkInTime) => {
        const date = new Date(checkInTime);
        // Thêm 1 ngày
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 16);
    };

    const formatDateTimeForAPI = (dateTimeString) => {
        return new Date(dateTimeString).toISOString();
    };
    
    const [checkIn, setCheckIn] = useState(getDefaultDateTime());
    const [checkOut, setCheckOut] = useState(getDefaultCheckOutTime(getDefaultDateTime()));
    const [roomType, setRoomType] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomTypesData, setRoomTypesData] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [cccd, setCccd] = useState('');
    const [customerInfo, setCustomerInfo] = useState(null);
    const [searchingCustomer, setSearchingCustomer] = useState(false);
    const [customerError, setCustomerError] = useState(null);
    const [booking, setBooking] = useState({
        customerName: '',
        customerCccd: '',
        customerPhone: '',
        customerAddress: '',
        customerEmail: '',
        customerId: '',
        numAdult: 1,
        numChild: 0,
        birthDate: '',
        gender: 'male'
    });

    useEffect(() => {
        fetchRoomTypes();
        fetchAvailableRooms();
    }, []);

    const fetchRoomTypes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/room-types');
            console.log(response.data.data);
            setRoomTypes(response.data.data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách loại phòng. Vui lòng thử lại sau.');
            console.error('Error fetching room types:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableRooms = async () => {
        try {
            setLoading(true);
            let url = `/api/rooms/available?checkIn=${formatDateTimeForAPI(checkIn)}&checkOut=${formatDateTimeForAPI(checkOut)}`;
            
            if (roomType) {
                url += `&roomTypeId=${roomType}`;
            }

            const response = await api.get(url);
            console.log("API Response:", response.data.data);
            
            // Ensure roomTypes data is properly structured
            const roomTypesData = response.data.data.roomTypes || [];
            
            // Map through the room types and ensure each room has its roomTypeId data
            const processedRoomTypes = roomTypesData.map(roomType => ({
                ...roomType,
                availableRooms: roomType.availableRooms.map(room => ({
                    ...room,
                    roomTypeId: {
                        _id: roomType._id,
                        name: roomType.name,
                        pricePerNight: roomType.pricePerNight,
                        maxAdult: roomType.maxAdult,
                        maxChild: roomType.maxChild
                    }
                }))
            }));

            setRoomTypesData(processedRoomTypes);
            console.log("Processed Room Types:", processedRoomTypes);

            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách phòng trống. Vui lòng thử lại sau.');
            console.error('Error fetching available rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchAvailableRooms();
    };

    const handleRoomTypeChange = (event) => {
        setRoomType(event.target.value);
    };

    const handleCheckInChange = (e) => {
        const newCheckIn = e.target.value;
        setCheckIn(newCheckIn);
        // Tự động cập nhật checkout sau 1 ngày
        setCheckOut(getDefaultCheckOutTime(newCheckIn));
    };

    const handleCheckOutChange = (e) => {
        setCheckOut(e.target.value);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleRoomSelect = (room) => {
        console.log("Selected Room Data:", room);
        setSelectedRoom(room);
        // Reset customer info and set default number of guests when selecting a new room
        setCustomerInfo(null);
        setCccd('');
        setBooking({
            customerName: '',
            customerCccd: '',
            customerPhone: '',
            customerAddress: '',
            customerEmail: '',
            customerId: '',
            numAdult: 1,
            numChild: 0,
            birthDate: '',
            gender: 'male'
        });
    };

    const searchCustomerByCccd = async () => {
        if (!cccd.trim()) {
            setCustomerError("Vui lòng nhập số CCCD");
            return;
        }

        try {
            setSearchingCustomer(true);
            setCustomerError(null);
            
            const response = await api.get(`/api/users/profile/${cccd}`);
            const customer = response.data.data;
            setCustomerInfo(customer);
            
            // Populate booking form with customer data
            setBooking(prev => ({
                ...prev,
                customerName: customer.profile?.fullName || '',
                customerCccd: customer.profile?.cccd || '',
                customerPhone: customer.profile?.phone || '',
                customerAddress: customer.profile?.address || '',
                customerEmail: customer.profile?.email || '',
                customerId: customer._id || '',
                birthDate: customer.profile?.birthDate?.split('T')[0] || '',
                gender: customer.profile?.gender || 'male'
            }));
        } catch (err) {
            console.error('Error fetching customer:', err);
            setCustomerError(err.response?.data?.message || 'Không tìm thấy khách hàng với CCCD này');
            setCustomerInfo(null);
        } finally {
            setSearchingCustomer(false);
        }
    };

    const handleBookingInputChange = (e) => {
        const { name, value } = e.target;
        setBooking(prev => ({
            ...prev,
            [name]: value
        }));
    };

    function randomLetters(length) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        return Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    }

    const handleCreateBooking = async () => {
        try {
            // Validate required fields
            const requiredFields = [
                { field: 'customerName', label: 'Họ tên' },
                { field: 'customerCccd', label: 'CCCD/CMND' },
                { field: 'customerPhone', label: 'Số điện thoại' },
                { field: 'customerEmail', label: 'Email' },
                { field: 'birthDate', label: 'Ngày sinh' },
                { field: 'customerAddress', label: 'Địa chỉ' }
            ];

            const missingFields = requiredFields.filter(
                ({ field }) => !booking[field]?.trim()
            );

            if (missingFields.length > 0) {
                alert(`Vui lòng điền đầy đủ thông tin sau:\n${missingFields.map(f => f.label).join('\n')}`);
                return;
            }

            console.log(selectedRoom);

            if (booking.numAdult > selectedRoom.roomTypeId.maxAdult) {
                alert(`Số người lớn không được vượt quá ${selectedRoom.roomTypeId.maxAdult}`);
                return;
            }

            if (booking.numChild > selectedRoom.roomTypeId.maxChild) {
                alert(`Số trẻ em không được vượt quá ${selectedRoom.roomTypeId.maxChild}`);
                return;
            }

            let customerId;

            // Try to get existing user or create new one
            try {
                // First try to get existing user
                const userResponse = await api.get(`/api/users/profile/${booking.customerCccd}`);
                customerId = userResponse.data.data._id;
            } catch (error) {
                // If user not found, create new user
                const createUserResponse = await api.post('/api/auth/signup', {
                    "username": booking.customerEmail,
                    "password": randomLetters(10),
                    "fullName": booking.customerName,
                    "phone": booking.customerPhone,
                    "address": booking.customerAddress,
                    "cccd": booking.customerCccd,
                    "birthDate": booking.birthDate,
                    "gender": booking.gender,
                    "email": booking.customerEmail
                });
                
                // Get the user profile after signup
                const newUserResponse = await api.get(`/api/users/profile/${booking.customerCccd}`);
                customerId = newUserResponse.data.data._id;
            }

            if (!customerId) {
                throw new Error('Không thể lấy được ID khách hàng');
            }

            // Create booking with the obtained customerId
            const bookingData = {
                customerId: customerId,
                rooms: [
                    {
                        roomId: selectedRoom._id,
                        checkIn: formatDateTimeForAPI(checkIn),
                        checkOut: formatDateTimeForAPI(checkOut),
                        numAdult: booking.numAdult,
                        numChild: booking.numChild
                    }
                ],
                services: []
            };

            const bookingResponse = await api.post('/api/bookings', bookingData);
            alert('Đặt phòng thành công!');
            handleClosePopup();
            fetchAvailableRooms(); // Refresh the room list
        } catch (error) {
            console.error('Error creating booking:', error);
            alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt phòng');
        }
    };

    const handleClosePopup = () => {
        setSelectedRoom(null);
        setCustomerInfo(null);
        setCccd('');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const handleResetCustomer = () => {
        setCustomerInfo(null);
        setCccd('');
        setCustomerError(null);
        setBooking(prev => ({
            ...prev,
            customerName: '',
            customerCccd: '',
            customerPhone: '',
            customerAddress: '',
            customerEmail: '',
            customerId: '',
            birthDate: '',
            gender: 'male'
        }));
    };

    return (
        <div style={styles.bookingPage}>
            <div style={styles.bookingContainer}>
                <h1 style={styles.bookingTitle}>Đặt Phòng</h1>

                <div style={styles.searchForm}>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="checkIn">Check-in:</label>
                        <input
                            style={styles.input}
                            type="datetime-local"
                            id="checkIn"
                            value={checkIn}
                            min={getDefaultDateTime()}
                            step="1800"
                            onChange={handleCheckInChange}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="checkOut">Check-out:</label>
                        <input
                            style={styles.input}
                            type="datetime-local"
                            id="checkOut"
                            value={checkOut}
                            min={checkIn}
                            step="1800"
                            onChange={handleCheckOutChange}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="roomType">Loại phòng:</label>
                        {loading ? (
                            <div>Đang tải...</div>
                        ) : error ? (
                            <div style={{color: 'red'}}>{error}</div>
                        ) : (
                            <select
                                style={styles.input}
                                id="roomType"
                                value={roomType}
                                onChange={handleRoomTypeChange}
                            >
                                <option value="">Tất cả loại phòng</option>
                                {roomTypes.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <button 
                        style={styles.searchButton} 
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        Tìm Phòng
                    </button>
                </div>

                <div style={styles.searchResults}>
                    {loading ? (
                        <div style={{textAlign: 'center', padding: '20px'}}>
                            Đang tải danh sách phòng...
                        </div>
                    ) : error ? (
                        <div style={{color: 'red', textAlign: 'center', padding: '20px'}}>
                            {error}
                        </div>
                    ) : roomTypesData.length > 0 ? (
                        roomTypesData.map((roomTypeData) => (
                            <div key={roomTypeData.roomTypeId} style={styles.roomTypeSection}>
                                <div style={styles.roomTypeHeader}>
                                    {roomTypeData.name}
                                </div>
                                <div style={styles.roomTypeInfo}>
                                    <div style={styles.roomTypeDetail}>
                                        <span>Giá: </span>
                                        <span style={styles.priceText}>{formatPrice(roomTypeData.pricePerNight)}/đêm</span>
                                    </div>
                                    <div style={styles.roomTypeDetail}>
                                        <span>Sức chứa: </span>
                                        <span>{roomTypeData.maxAdult} người lớn, {roomTypeData.maxChild} trẻ em</span>
                                    </div>
                                    <div style={styles.roomTypeDetail}>
                                        <span>Số phòng trống: </span>
                                        <span>{roomTypeData.availableRooms.length}</span>
                                    </div>
                                </div>

                                {roomTypeData.availableRooms && roomTypeData.availableRooms.length > 0 ? (
                                    <div style={styles.roomsGrid}>
                                        {roomTypeData.availableRooms.map((room) => (
                                            <div 
                                                key={room._id} 
                                                style={{
                                                    ...styles.roomCard,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handleRoomSelect(room)}
                                            >
                                                <div style={styles.roomName}>{room.name}</div>
                                                <div style={styles.floorBadge}>Tầng {room.floor}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>Không có phòng trống cho loại phòng này</div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={styles.noResults}>
                            Không tìm thấy phòng trống cho thời gian đã chọn
                        </p>
                    )}
                </div>
            </div>

            {selectedRoom && (
                <div style={styles.overlay}>
                    <div style={styles.popup}>
                        <div style={styles.popupHeader}>
                            <h2 style={styles.popupTitle}>Đặt Phòng {selectedRoom.name}</h2>
                            <button style={styles.closeButton} onClick={handleClosePopup}>×</button>
                        </div>

                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Thông tin phòng</h3>
                            <div style={styles.formGrid}>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="roomName">Phòng:</label>
                                    <input
                                        style={{...styles.input, ...styles.readOnlyInput}}
                                        type="text"
                                        id="roomName"
                                        value={selectedRoom.name}
                                        readOnly
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="roomFloor">Tầng:</label>
                                    <input
                                        style={{...styles.input, ...styles.readOnlyInput}}
                                        type="text"
                                        id="roomFloor"
                                        value={selectedRoom.floor}
                                        readOnly
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="roomType">Loại phòng:</label>
                                    <input
                                        style={{...styles.input, ...styles.readOnlyInput}}
                                        type="text"
                                        id="roomType"
                                        value={selectedRoom?.roomTypeId?.name || ''}
                                        readOnly
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="roomPrice">Giá:</label>
                                    <input
                                        style={{...styles.input, ...styles.readOnlyInput}}
                                        type="text"
                                        id="roomPrice"
                                        value={selectedRoom?.roomTypeId?.pricePerNight ? 
                                            `${new Intl.NumberFormat('vi-VN').format(selectedRoom.roomTypeId.pricePerNight)} ₫/đêm`
                                            : ''}
                                        readOnly
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="checkInTime">Check-in:</label>
                                    <input
                                        style={{...styles.input, ...styles.readOnlyInput}}
                                        type="text"
                                        id="checkInTime"
                                        value={new Date(checkIn).toLocaleString('vi-VN')}
                                        readOnly
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="checkOutTime">Check-out:</label>
                                    <input
                                        style={{...styles.input, ...styles.readOnlyInput}}
                                        type="text"
                                        id="checkOutTime"
                                        value={new Date(checkOut).toLocaleString('vi-VN')}
                                        readOnly
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="numAdult">Số người lớn:</label>
                                    <input
                                        style={styles.input}
                                        type="number"
                                        id="numAdult"
                                        name="numAdult"
                                        min="1"
                                        max={selectedRoom?.roomTypeId?.maxAdult || 2}
                                        value={booking.numAdult}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= (selectedRoom?.roomTypeId?.maxAdult || 2)) {
                                                handleBookingInputChange(e);
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="numChild">Số trẻ em:</label>
                                    <input
                                        style={styles.input}
                                        type="number"
                                        id="numChild"
                                        name="numChild"
                                        min="0"
                                        max={selectedRoom?.roomTypeId?.maxChild || 1}
                                        value={booking.numChild}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 0 && value <= (selectedRoom?.roomTypeId?.maxChild || 1)) {
                                                handleBookingInputChange(e);
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="roomCapacity">Sức chứa:</label>
                                    <input
                                        style={{...styles.input, ...styles.readOnlyInput}}
                                        type="text"
                                        id="roomCapacity"
                                        value={selectedRoom?.roomTypeId ? 
                                            `${selectedRoom.roomTypeId.maxAdult} người lớn, ${selectedRoom.roomTypeId.maxChild} trẻ em`
                                            : ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Thông tin khách hàng</h3>
                            
                            <div style={styles.formRow}>
                                <div style={styles.formInputContainer}>
                                    {/* <label style={styles.label} htmlFor="cccd">CCCD/CMND:</label> */}
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            id="cccd"
                                            value={cccd}
                                            onChange={(e) => setCccd(e.target.value)}
                                            placeholder="Nhập số CCCD/CMND"
                                        />
                                        <button 
                                            style={{...styles.searchButton, marginTop: 0, height: '41px'}}
                                            onClick={searchCustomerByCccd}
                                            disabled={searchingCustomer}
                                        >
                                            {searchingCustomer ? 'Đang tìm...' : 'Tìm kiếm'}
                                        </button>
                                        <button 
                                            style={{
                                                ...styles.resetButton,
                                                marginTop: 0,
                                                height: '41px',
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 16px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onClick={handleResetCustomer}
                                            type="button"
                                        >
                                            Xóa thông tin
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {customerError && (
                                <div style={{color: 'red', marginBottom: '15px', padding: '0 5px'}}>
                                    {customerError}
                                </div>
                            )}
                            
                            <div style={styles.formGrid}>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="customerName">
                                        Họ tên: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        style={customerInfo ? {...styles.input, ...styles.readOnlyInput} : styles.input}
                                        type="text"
                                        id="customerName"
                                        name="customerName"
                                        value={booking.customerName}
                                        onChange={handleBookingInputChange}
                                        placeholder="Họ tên khách hàng"
                                        readOnly={customerInfo !== null}
                                        required
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="customerCccd">
                                        CCCD/CMND: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        style={customerInfo ? {...styles.input, ...styles.readOnlyInput} : styles.input}
                                        type="text"
                                        id="customerCccd"
                                        name="customerCccd"
                                        value={booking.customerCccd}
                                        onChange={handleBookingInputChange}
                                        placeholder="Số CCCD/CMND"
                                        readOnly={customerInfo !== null}
                                        required
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="customerPhone">
                                        Số điện thoại: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        style={customerInfo ? {...styles.input, ...styles.readOnlyInput} : styles.input}
                                        type="text"
                                        id="customerPhone"
                                        name="customerPhone"
                                        value={booking.customerPhone}
                                        onChange={handleBookingInputChange}
                                        placeholder="Số điện thoại"
                                        readOnly={customerInfo !== null}
                                        required
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="customerEmail">
                                        Email: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        style={customerInfo ? {...styles.input, ...styles.readOnlyInput} : styles.input}
                                        type="email"
                                        id="customerEmail"
                                        name="customerEmail"
                                        value={booking.customerEmail}
                                        onChange={handleBookingInputChange}
                                        placeholder="Email"
                                        readOnly={customerInfo !== null}
                                        required
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="birthDate">
                                        Ngày sinh: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        style={customerInfo ? {...styles.input, ...styles.readOnlyInput} : styles.input}
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={booking.birthDate}
                                        onChange={handleBookingInputChange}
                                        readOnly={customerInfo !== null}
                                        required
                                    />
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="gender">Giới tính:</label>
                                    <select
                                        style={customerInfo ? {...styles.input, ...styles.readOnlyInput} : styles.input}
                                        id="gender"
                                        name="gender"
                                        value={booking.gender}
                                        onChange={handleBookingInputChange}
                                        disabled={customerInfo !== null}
                                    >
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                                <div style={styles.formInputGroup}>
                                    <label style={styles.label} htmlFor="customerAddress">
                                        Địa chỉ: <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        style={customerInfo ? {...styles.input, ...styles.readOnlyInput} : styles.input}
                                        type="text"
                                        id="customerAddress"
                                        name="customerAddress"
                                        value={booking.customerAddress}
                                        onChange={handleBookingInputChange}
                                        placeholder="Địa chỉ"
                                        readOnly={customerInfo !== null}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div style={styles.buttonGroup}>
                            <button 
                                style={styles.cancelButton}
                                onClick={handleClosePopup}
                            >
                                Hủy
                            </button>
                            <button 
                                style={styles.confirmButton}
                                onClick={handleCreateBooking}
                            >
                                Đặt phòng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}