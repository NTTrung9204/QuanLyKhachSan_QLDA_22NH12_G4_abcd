const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { AppError, globalErrorHandler } = require('./utils/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Import routes
const routes = require('./routes');

// Initialize Express app
const app = express();

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:5172', // frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(morgan('dev')); // Logging middleware

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Mount all routes under /api
app.use('/api', routes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app;
