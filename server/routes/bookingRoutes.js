const express = require('express');
const router = express.Router();
const {
  bookRoom,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/book', protect, bookRoom);
router.get('/mybookings', protect, getMyBookings);
router.post('/cancel', protect, cancelBooking);
router.post('/cancelbooking', protect, cancelBooking); // Explicit alias requested in specification
router.get('/all', protect, adminOnly, getAllBookings);

module.exports = router;
