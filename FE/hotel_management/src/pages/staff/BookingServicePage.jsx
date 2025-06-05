import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BookingServicePage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        serviceId: '',
        quantity: 1,
        useDate: '',
        roomIndex: 0
    });

    useEffect(() => {
        fetchBookingAndServices();
    }, [bookingId]);

    const fetchBookingAndServices = async () => {
        try {
            setLoading(true);
            const [bookingRes, servicesRes] = await Promise.all([
                api.get(`/api/bookings/${bookingId}`),
                api.get('/api/services')
            ]);

            const bookingData = bookingRes.data.data;
            setBooking(bookingData);

            // Set default useDate to check-in date of first room
            if (bookingData.rooms[0]) {
                const checkInDate = new Date(bookingData.rooms[0].checkIn);
                setFormData(prev => ({
                    ...prev,
                    useDate: checkInDate.toISOString().split('T')[0]
                }));
            }

            setServices(servicesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Không thể tải thông tin booking hoặc dịch vụ');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.serviceId || !formData.useDate) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const response = await api.post('/api/service-management/booking/add-service', {
                bookingId,
                serviceId: formData.serviceId,
                quantity: formData.quantity,
                useDate: new Date(formData.useDate).toISOString(),
                roomIndex: formData.roomIndex
            });

            if (response.data.status === 'success') {
                alert('Thêm dịch vụ thành công');
                setBooking(response.data.data.booking);
                // Reset form
                setFormData(prev => ({
                    ...prev,
                    serviceId: '',
                    quantity: 1
                }));
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Không thể thêm dịch vụ');
        }
    };

    const handleBack = () => {
        navigate('/staff/services');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) return <div style={styles.loading}>Đang tải...</div>;
    if (!booking) return <div style={styles.error}>Không tìm thấy booking</div>;

    return (
        <div style={styles.container}>
            <button onClick={handleBack} style={styles.backButton}>
                ← Quay lại danh sách
            </button>

            <h1 style={styles.title}>Thêm dịch vụ cho Booking #{bookingId.slice(-6)}</h1>

            <div style={styles.bookingInfo}>
                <h2>Thông tin phòng</h2>
                <div style={styles.roomsGrid}>
                    {booking.rooms.map((room, index) => (
                        <div key={index} style={styles.roomCard}>
                            <h3>{room.roomId.roomTypeId.name} - {room.roomId.name}</h3>
                            <p>Check-in: {formatDate(room.checkIn)}</p>
                            <p>Check-out: {formatDate(room.checkOut)}</p>
                            <p>Số người: {room.numAdult} người lớn, {room.numChild} trẻ em</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.servicesSection}>
                <div style={styles.addServiceForm}>
                    <h2>Thêm dịch vụ mới</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label>Chọn phòng:</label>
                            <select
                                value={formData.roomIndex}
                                onChange={(e) => setFormData(prev => ({ ...prev, roomIndex: Number(e.target.value) }))}
                                style={styles.select}
                            >
                                {booking.rooms.map((room, index) => (
                                    <option key={index} value={index}>
                                        Phòng {index + 1} - {room.roomId.roomTypeId.name} ({room.roomId.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Chọn dịch vụ:</label>
                            <select
                                value={formData.serviceId}
                                onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                                style={styles.select}
                                required
                            >
                                <option value="">-- Chọn dịch vụ --</option>
                                {services.map(service => (
                                    <option key={service._id} value={service._id}>
                                        {service.name} - {formatPrice(service.price)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label>Số lượng:</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label>Ngày sử dụng:</label>
                            <input
                                type="date"
                                value={formData.useDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, useDate: e.target.value }))}
                                style={styles.input}
                                min={booking.rooms[0].checkIn.split('T')[0]}
                                max={booking.rooms[0].checkOut.split('T')[0]}
                                required
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            Thêm dịch vụ
                        </button>
                    </form>
                </div>

                <div style={styles.existingServices}>
                    <h2>Dịch vụ đã đặt</h2>
                    {booking.services && booking.services.length > 0 ? (
                        <div style={styles.servicesGrid}>
                            {booking.services.map((service, index) => (
                                <div key={index} style={styles.serviceCard}>
                                    <h3>{service.serviceId.name}</h3>
                                    <p>Số lượng: {service.quantity}</p>
                                    <p>Giá: {formatPrice(service.serviceId.price)}</p>
                                    <p>Thành tiền: {formatPrice(service.serviceId.price * service.quantity)}</p>
                                    <p>Ngày sử dụng: {formatDate(service.useDate)}</p>
                                    <p>Phòng: {service.roomIndex + 1}</p>
                                    <p>Người thêm: {service.addedBy?.profile.firstName} {service.addedBy?.profile.lastName}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.noServices}>Chưa có dịch vụ nào được đặt</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#666',
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#dc2626',
    },
    backButton: {
        padding: '8px 16px',
        backgroundColor: '#475569',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
    },
    title: {
        textAlign: 'center',
        color: '#1a365d',
        marginBottom: '30px',
    },
    bookingInfo: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    roomsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    roomCard: {
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
    },
    servicesSection: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
    },
    addServiceForm: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    select: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
    },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
    },
    submitButton: {
        padding: '12px',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
    },
    existingServices: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    serviceCard: {
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
    },
    noServices: {
        textAlign: 'center',
        padding: '20px',
        color: '#666',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        marginTop: '20px',
    },
};

export default BookingServicePage; 