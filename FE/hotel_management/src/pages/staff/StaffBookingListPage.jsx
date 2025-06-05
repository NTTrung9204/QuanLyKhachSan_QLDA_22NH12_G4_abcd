import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const StaffBookingListPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        identityCard: '',
        startDate: '',
        endDate: '',
        status: 'checked_in' // Default to show checked-in bookings
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Set default date range to last 7 days
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);

        setFilters(prev => ({
            ...prev,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        }));

        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            let url = '/api/bookings';
            const queryParams = [];
            
            if (filters.identityCard) {
                queryParams.push(`identityCard=${filters.identityCard}`);
            }
            if (filters.startDate) {
                queryParams.push(`startDate=${filters.startDate}`);
            }
            if (filters.endDate) {
                queryParams.push(`endDate=${filters.endDate}`);
            }
            if (filters.status) {
                queryParams.push(`status=${filters.status}`);
            }

            if (queryParams.length > 0) {
                url += '?' + queryParams.join('&');
            }

            const response = await api.get(url);
            setBookings(response.data.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBookings();
    };

    const handleAddService = (bookingId) => {
        navigate(`/staff/bookings/${bookingId}/services`);
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

    const getStatusColor = (status) => {
        const colors = {
            pending: '#eab308',    // Yellow
            confirmed: '#2563eb',  // Blue
            checked_in: '#059669', // Green
            checked_out: '#64748b', // Gray
            cancelled: '#dc2626'   // Red
        };
        return colors[status] || '#000000';
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: 'Chờ xác nhận',
            confirmed: 'Đã xác nhận',
            checked_in: 'Đã check-in',
            checked_out: 'Đã check-out',
            cancelled: 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    const renderServicesList = (services) => {
        if (!services || services.length === 0) return null;

        return (
            <div style={styles.servicesList}>
                <h4 style={styles.servicesTitle}>Dịch vụ đã đặt:</h4>
                {services.map((service, index) => (
                    <div key={index} style={styles.serviceItem}>
                        <span>{service.serviceId.name}</span>
                        <span>x{service.quantity}</span>
                        <span>{formatPrice(service.serviceId.price * service.quantity)}</span>
                        <span>{formatDate(service.useDate)}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Quản lý dịch vụ đặt phòng</h1>

            <div style={styles.filterContainer}>
                <form onSubmit={handleSearch} style={styles.filterForm}>
                    <div style={styles.filterGroup}>
                        <label>CCCD/CMND:</label>
                        <input
                            type="text"
                            name="identityCard"
                            value={filters.identityCard}
                            onChange={handleFilterChange}
                            style={styles.input}
                            placeholder="Nhập CCCD/CMND"
                        />
                    </div>

                    <div style={styles.filterGroup}>
                        <label>Từ ngày:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.filterGroup}>
                        <label>Đến ngày:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.filterGroup}>
                        <label>Trạng thái:</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            style={styles.select}
                        >
                            <option value="">Tất cả</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="checked_in">Đã check-in</option>
                            <option value="checked_out">Đã check-out</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.searchButton}>
                        Tìm kiếm
                    </button>
                </form>
            </div>

            {loading ? (
                <div style={styles.loading}>Đang tải...</div>
            ) : bookings.length === 0 ? (
                <div style={styles.noResults}>Không tìm thấy booking nào</div>
            ) : (
                <div style={styles.bookingsContainer}>
                    {bookings.map((booking) => (
                        <div key={booking._id} style={styles.bookingCard}>
                            <div style={styles.bookingHeader}>
                                <div style={styles.bookingHeaderLeft}>
                                    <h3 style={styles.bookingId}>Booking #{booking._id.slice(-6)}</h3>
                                    <span style={{
                                        ...styles.statusBadge,
                                        backgroundColor: getStatusColor(booking.status)
                                    }}>
                                        {getStatusText(booking.status)}
                                    </span>
                                </div>
                                {booking.status === 'checked_in' && (
                                    <button
                                        style={styles.addServiceButton}
                                        onClick={() => handleAddService(booking._id)}
                                    >
                                        Thêm dịch vụ
                                    </button>
                                )}
                            </div>

                            <div style={styles.bookingContent}>
                                <div style={styles.roomInfo}>
                                    {booking.rooms.map((room, index) => (
                                        <div key={index} style={styles.roomDetails}>
                                            <h4 style={styles.roomName}>{room.roomId.roomTypeId.name} - {room.roomId.name}</h4>
                                            <p>Check-in: {formatDate(room.checkIn)}</p>
                                            <p>Check-out: {formatDate(room.checkOut)}</p>
                                            <p>Số người: {room.numAdult} người lớn, {room.numChild} trẻ em</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.bookingInfo}>
                                    <div style={styles.totalAmount}>
                                        <span>Tổng tiền: {formatPrice(booking.totalAmount)}</span>
                                    </div>
                                    <div style={styles.bookingDate}>
                                        <span>Ngày tạo: {formatDate(booking.createdAt)}</span>
                                    </div>
                                    {booking.services && booking.services.length > 0 && (
                                        <div style={styles.servicesList}>
                                            <h4 style={styles.servicesTitle}>Dịch vụ đã đặt:</h4>
                                            <div style={styles.servicesTable}>
                                                {booking.services.map((service, index) => (
                                                    <div key={index} style={styles.serviceRow}>
                                                        <span style={styles.serviceName}>{service.serviceId.name}</span>
                                                        <span style={styles.serviceQuantity}>x{service.quantity}</span>
                                                        <span style={styles.servicePrice}>{formatPrice(service.serviceId.price)}</span>
                                                        <span style={styles.serviceDate}>{formatDate(service.useDate)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
    },
    title: {
        textAlign: 'center',
        color: '#1a365d',
        marginBottom: '30px',
    },
    filterContainer: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    filterForm: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'flex-end',
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: '1',
        minWidth: '200px',
    },
    input: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        width: '100%',
    },
    select: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        backgroundColor: '#fff',
        width: '100%',
    },
    searchButton: {
        padding: '8px 24px',
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        height: '37px',
        fontSize: '14px',
        fontWeight: '500',
        alignSelf: 'flex-end',
    },
    bookingsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    bookingHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
    },
    bookingHeaderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    bookingId: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a365d',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '999px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
    },
    addServiceButton: {
        padding: '8px 16px',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    bookingContent: {
        padding: '20px',
    },
    roomInfo: {
        marginBottom: '20px',
    },
    roomDetails: {
        backgroundColor: '#f8fafc',
        padding: '16px',
        borderRadius: '6px',
        marginBottom: '12px',
    },
    roomName: {
        margin: '0 0 8px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a365d',
    },
    bookingInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    totalAmount: {
        fontSize: '16px',
        fontWeight: '600',
    },
    bookingDate: {
        color: '#64748b',
    },
    servicesList: {
        backgroundColor: '#f8fafc',
        padding: '16px',
        borderRadius: '6px',
    },
    servicesTitle: {
        margin: '0 0 12px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a365d',
    },
    servicesTable: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    serviceRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 0.5fr 1fr 1.5fr',
        gap: '12px',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #e2e8f0',
        fontSize: '14px',
    },
    serviceName: {
        fontWeight: '500',
    },
    serviceQuantity: {
        color: '#64748b',
    },
    servicePrice: {
        color: '#059669',
    },
    serviceDate: {
        color: '#64748b',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        color: '#64748b',
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        color: '#64748b',
    },
};

export default StaffBookingListPage; 