const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const RoomType = require('../models/roomTypeModel');

// Helper function to get date range
const getDateRange = (period, date) => {
    const start = new Date(date);
    const end = new Date(date);
    
    switch(period) {
        case 'day':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'month':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'year':
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
            break;
    }
    return { start, end };
};

exports.getRevenue = async (req, res) => {
    try {
        const { period, date } = req.query;
        const { start, end } = getDateRange(period, date);

        console.log('Fetching revenue for:', { period, date, start, end });

        const result = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        console.log('Revenue result:', result);

        res.status(200).json({
            status: 'success',
            data: {
                revenue: result[0]?.revenue || 0
            }
        });
    } catch (error) {
        console.error('Error in getRevenue:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getBookingsByRoomType = async (req, res) => {
    try {
        const { period, date } = req.query;
        const { start, end } = getDateRange(period, date);

        // First, get all room types to ensure we include those with zero bookings
        const allRoomTypes = await RoomType.find().select('_id name');

        // Get bookings with room details
        const bookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: 'checked_out'
                }
            },
            // Unwind the rooms array to treat each room as a separate document
            { $unwind: '$rooms' },
            // Lookup to get room details
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'rooms.roomId',
                    foreignField: '_id',
                    as: 'roomDetails'
                }
            },
            // Unwind the roomDetails array
            { $unwind: '$roomDetails' },
            // Group by room type
            {
                $group: {
                    _id: '$roomDetails.roomTypeId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create a map of room type ID to booking count
        const bookingCountMap = bookings.reduce((acc, item) => {
            acc[item._id.toString()] = item.count;
            return acc;
        }, {});

        // Map all room types to their booking counts
        const result = allRoomTypes.map(roomType => ({
            _id: roomType._id,
            name: roomType.name,
            count: bookingCountMap[roomType._id.toString()] || 0
        }));

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error('Error in getBookingsByRoomType:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getBookingsByDate = async (req, res) => {
    try {
        const { period, date } = req.query;
        const { start, end } = getDateRange(period, date);

        console.log('Fetching bookings for:', { period, date, start, end });

        const bookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt'
                        }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);

        console.log('Found bookings:', bookings);

        res.status(200).json({
            status: 'success',
            data: bookings
        });
    } catch (error) {
        console.error('Error in getBookingsByDate:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const { start: dayStart, end: dayEnd } = getDateRange('day', today);
        const { start: monthStart, end: monthEnd } = getDateRange('month', today);
        const { start: yearStart, end: yearEnd } = getDateRange('year', today);

        console.log('Fetching dashboard stats for periods:', {
            day: { dayStart, dayEnd },
            month: { monthStart, monthEnd },
            year: { yearStart, yearEnd }
        });

        const [
            dailyRevenue,
            monthlyRevenue,
            yearlyRevenue,
            totalRooms,
            totalBookings,
            roomTypeStats
        ] = await Promise.all([
            Booking.aggregate([
                { 
                    $match: { 
                        createdAt: { $gte: dayStart, $lte: dayEnd },
                        status: 'checked_out'
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Booking.aggregate([
                { 
                    $match: { 
                        createdAt: { $gte: monthStart, $lte: monthEnd },
                        status: 'checked_out'
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Booking.aggregate([
                { 
                    $match: { 
                        createdAt: { $gte: yearStart, $lte: yearEnd },
                        status: 'checked_out'
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Room.countDocuments(),
            Booking.countDocuments({ status: 'checked_out' }),
            Booking.aggregate([
                {
                    $match: {
                        status: 'checked_out'
                    }
                },
                {
                    $group: {
                        _id: '$roomType',
                        bookingCount: { $sum: 1 },
                        totalRevenue: { $sum: '$totalAmount' }
                    }
                }
            ])
        ]);

        // Populate room type details
        await Booking.populate(roomTypeStats, { path: '_id', model: 'RoomType' });

        const stats = {
            dailyRevenue: dailyRevenue[0]?.total || 0,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            yearlyRevenue: yearlyRevenue[0]?.total || 0,
            totalRooms,
            totalBookings,
            roomTypeStats
        };

        console.log('Dashboard stats:', stats);

        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}; 