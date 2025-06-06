import api from "./axios";

const statisticsApi = {
    getRevenue: async (period, date) => {
        const response = await api.get('/api/statistics/revenue', {
            params: { period, date }
        });
        return response.data;
    },

    getAllRoomTypes: async () => {
        const response = await api.get('/api/room-types');
        return response.data;
    },

    getBookingsByRoomType: async (period, date) => {
        const response = await api.get('/api/statistics/bookings-by-room-type', {
            params: { period, date }
        });
        return response.data;
    },

    getBookingsByDate: async (period, date) => {
        const response = await api.get('/api/statistics/bookings-by-date', {
            params: { period, date }
        });
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await api.get('/api/statistics/dashboard-stats');
        return response.data;
    }
};

export default statisticsApi; 