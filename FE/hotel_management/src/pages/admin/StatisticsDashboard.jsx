import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LabelList
} from 'recharts';
import statisticsApi from '../../api/statisticsApi';

// Add CSS styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .statistics-container {
        padding: 24px;
    }

    .statistics-title {
        font-size: 2rem;
        font-weight: 500;
        margin-bottom: 24px;
        color: #1a237e;
    }

    .filters-container {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        align-items: center;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .filter-label {
        font-size: 0.875rem;
        color: #666;
    }

    .filter-select,
    .filter-date {
        min-width: 200px;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        color: #333;
    }

    .filter-select:focus,
    .filter-date:focus {
        outline: none;
        border-color: #1a237e;
        box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.2);
    }

    .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
    }

    .summary-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 20px;
    }

    .summary-card-title {
        color: #666;
        font-size: 0.875rem;
        margin-bottom: 8px;
    }

    .summary-card-value {
        font-size: 1.5rem;
        font-weight: 500;
        color: #1a237e;
    }

    .charts-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
        margin-bottom: 24px;
    }

    .chart-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 20px;
    }

    .chart-title {
        font-size: 1.25rem;
        font-weight: 500;
        margin-bottom: 16px;
        color: #1a237e;
    }

    .chart-container {
        height: 400px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .chart-placeholder {
        color: #666;
        text-align: center;
        font-size: 1rem;
    }

    .revenue-card {
        grid-column: 1 / -1;
    }

    .revenue-value {
        font-size: 2rem;
        font-weight: 500;
        text-align: center;
        margin: 16px 0;
        color: #1a237e;
    }

    @media (max-width: 1024px) {
        .charts-container {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .statistics-container {
            padding: 16px;
        }

        .filters-container {
            flex-direction: column;
            align-items: stretch;
        }

        .filter-select,
        .filter-date {
            width: 100%;
        }
    }
`;
document.head.appendChild(styleSheet);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatisticsDashboard = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [bookingsByDate, setBookingsByDate] = useState([]);
    const [bookingsByRoomType, setBookingsByRoomType] = useState([]);
    const [revenue, setRevenue] = useState(null);
    const [dailyRevenue, setDailyRevenue] = useState([]);

    const fetchDailyRevenue = async () => {
        try {
            const response = await statisticsApi.getBookingsByDate('month', date);
            
            // Create array of all days in the month
            const selectedDate = new Date(date);
            const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            
            // Create initial data array with all days
            const initialData = Array.from({ length: daysInMonth }, (_, index) => ({
                date: index + 1,
                revenue: 0,
                bookings: 0
            }));

            // Map response data to the corresponding days
            const responseData = response.data.reduce((acc, item) => {
                const dayOfMonth = new Date(item._id).getDate();
                acc[dayOfMonth - 1] = {
                    date: dayOfMonth,
                    revenue: item.revenue || 0,
                    bookings: item.count || 0
                };
                return acc;
            }, initialData);

            console.log('Processed daily revenue:', responseData);
            setDailyRevenue(responseData);
        } catch (error) {
            console.error('Error fetching daily revenue:', error);
            setDailyRevenue([]);
        }
    };

    const fetchBookingsByDate = async () => {
        try {
            const response = await statisticsApi.getBookingsByDate('month', date);
            
            // Create array of all days in the month
            const selectedDate = new Date(date);
            const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            
            // Create initial data array with all days
            const initialData = Array.from({ length: daysInMonth }, (_, index) => {
                const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), index + 1);
                return {
                    _id: currentDate.toISOString().split('T')[0],
                    count: 0,
                    revenue: 0
                };
            });

            // Map response data to the corresponding days
            const bookingsData = response.data.reduce((acc, item) => {
                const dayIndex = new Date(item._id).getDate() - 1;
                acc[dayIndex] = {
                    _id: item._id,
                    count: item.count || 0,
                    revenue: item.revenue || 0
                };
                return acc;
            }, initialData);

            console.log('Processed bookings data:', bookingsData);
            setBookingsByDate(bookingsData);
        } catch (error) {
            console.error('Error fetching bookings by date:', error);
            setBookingsByDate([]);
        }
    };

    const fetchBookingsByRoomType = async () => {
        try {
            // Get bookings by room type for the selected month
            const response = await statisticsApi.getBookingsByRoomType('month', date);
            const bookingsData = response.data;
            console.log('Room type bookings:', bookingsData);

            // Sort data by room type name
            const sortedData = [...bookingsData].sort((a, b) => a.name.localeCompare(b.name));
            setBookingsByRoomType(sortedData);
        } catch (error) {
            console.error('Error fetching bookings by room type:', error);
            setBookingsByRoomType([]);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            // const response = await statisticsApi.getDashboardStats();
            // console.log('Dashboard stats response:', response.data);
            
            // setDashboardStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setDashboardStats(null);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        fetchBookingsByDate();
        fetchBookingsByRoomType();
        fetchDailyRevenue();
    }, [date]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Custom tooltip for the line chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>{`Ngày: ${new Date(label).getDate()}`}</p>
                    <p style={{ margin: 0, color: '#8884d8' }}>
                        {`Số lượng: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for the revenue chart
    const RevenueTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>{`Ngày: ${label}`}</p>
                    <p style={{ margin: 0, color: '#82ca9d' }}>
                        {`Doanh thu: ${formatCurrency(payload[0].value)}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="statistics-container">
            <h1 className="statistics-title">Thống kê tháng</h1>

            {/* Month Selector */}
            <div className="filters-container">
                <div className="filter-group">
                    <label className="filter-label" htmlFor="month-select">Chọn tháng</label>
                    <input
                        id="month-select"
                        type="month"
                        className="filter-date"
                        value={date.substring(0, 7)}
                        onChange={(e) => setDate(`${e.target.value}-01`)}
                    />
                </div>
            </div>

            {/* Summary Cards */}
            {dashboardStats && (
                <div className="summary-cards">
                    <div className="summary-card">
                        <div className="summary-card-title">Doanh thu tháng này</div>
                        <div className="summary-card-value">
                            {formatCurrency(dashboardStats.monthlyRevenue)}
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-card-title">Tổng số phòng</div>
                        <div className="summary-card-value">
                            {dashboardStats.totalRooms}
                        </div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-card-title">Tổng số đặt phòng</div>
                        <div className="summary-card-value">
                            {dashboardStats.totalBookings}
                        </div>
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="charts-container" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                {/* Daily Revenue Chart */}
                <div className="chart-card">
                    <h2 className="chart-title">Doanh thu theo ngày trong tháng</h2>
                    <div className="chart-container">
                        {dailyRevenue && dailyRevenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dailyRevenue}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip content={<RevenueTooltip />} />
                                    <Legend />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#82ca9d"
                                        name="Doanh thu"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-placeholder">
                                Không có dữ liệu
                            </div>
                        )}
                    </div>
                </div>

                {/* Bookings by Room Type Chart */}
                {/* <div className="chart-card">
                    <h2 className="chart-title">Số lượng đặt theo loại phòng</h2>
                    <div className="chart-container">
                        {bookingsByRoomType && bookingsByRoomType.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={bookingsByRoomType}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name"
                                        label={{ 
                                            value: 'Loại phòng',
                                            position: 'insideBottom',
                                            offset: -5
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Số lượng đặt phòng',
                                            angle: -90,
                                            position: 'insideLeft'
                                        }}
                                    />
                                    <Tooltip content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div style={{
                                                    backgroundColor: 'white',
                                                    padding: '10px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px'
                                                }}>
                                                    <p style={{ margin: 0 }}>{`Loại phòng: ${label}`}</p>
                                                    <p style={{ margin: 0, color: '#8884d8' }}>
                                                        {`Số lượng đặt: ${payload[0].value}`}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
                                    <Legend />
                                    <Bar
                                        dataKey="count"
                                        fill="#8884d8"
                                        name="Số lượng đặt phòng"
                                    >
                                        <LabelList 
                                            dataKey="count" 
                                            position="top" 
                                            formatter={(value) => value || '0'}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-placeholder">
                                Không có dữ liệu
                            </div>
                        )}
                    </div>
                </div> */}

                {/* Bookings by Date Chart */}
                <div className="chart-card">
                    <h2 className="chart-title">Số lượng đặt phòng theo ngày</h2>
                    <div className="chart-container">
                        {bookingsByDate && bookingsByDate.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={bookingsByDate}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" tickFormatter={(value) => new Date(value).getDate()} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8884d8"
                                        name="Số lượng đặt phòng"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-placeholder">
                                Không có dữ liệu
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard; 