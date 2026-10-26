const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
connectDB();

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HotelPro API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      users: '/api/users',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});

module.exports = app;
