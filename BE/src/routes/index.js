const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const facilityRoutes = require('./facilityRoutes');
const roomTypeRoutes = require('./roomTypeRoutes');
const helloRoutes = require('./helloRoutes');

const router = express.Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);
router.use('/room-types', roomTypeRoutes);
router.use('/hello', helloRoutes);

module.exports = router; 