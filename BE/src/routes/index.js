const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const helloRoutes = require('./helloRoutes');

const router = express.Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/hello', helloRoutes);

module.exports = router; 