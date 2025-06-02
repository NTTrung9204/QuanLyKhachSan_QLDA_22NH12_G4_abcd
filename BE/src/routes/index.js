const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const facilityRoutes = require('./facilityRoutes');
const roomTypeRoutes = require('./roomTypeRoutes');
const roomRoutes = require('./roomRoutes');
const imageRoutes = require('./imageRoutes');
const helloRoutes = require('./helloRoutes');
const serviceRoutes = require('./serviceRoutes');
const bookingRoutes = require('./bookingRoutes');
const homeRoutes = require('./homeRoutes');
const bookingHistoryRoutes = require('./bookingHistoryRoutes');

const router = express.Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);
router.use('/room-types', roomTypeRoutes);
router.use('/rooms', roomRoutes);
router.use('/images', imageRoutes);
router.use('/hello', helloRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/home', homeRoutes);
router.use('/booking-history', bookingHistoryRoutes);

module.exports = router; 