const express = require('express');
const authRoutes = require('./authRoutes');
const helloRoutes = require('./helloRoutes');

const router = express.Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/hello', helloRoutes);

module.exports = router; 