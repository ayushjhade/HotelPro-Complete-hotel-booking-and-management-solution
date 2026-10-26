const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');

// @desc    Book a room
// @route   POST /api/bookings/book
const bookRoom = async (req, res) => {
  try {
    const { room_id, fromdate, todate, name, phone, cardDetails } = req.body;

    if (!room_id || !fromdate || !todate || !cardDetails) {
      return res.status(400).json({ message: 'Room ID, check-in, check-out dates, and payment details are required.' });
    }

    const { cardNumber, cvvcode, expmonthyear, cardholdername } = cardDetails;
    if (!cardNumber || !cvvcode || !expmonthyear || !cardholdername) {
      return res.status(400).json({ message: 'All credit card payment fields are required.' });
    }

    // Verify room
    const room = await Room.findOne({
      $or: [{ room_id }, { _id: room_id.match(/^[0-9a-fA-F]{24}$/) ? room_id : null }],
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Calculate duration
    const startDate = dayjs(fromdate);
    const endDate = dayjs(todate);
    const totaldays = endDate.diff(startDate, 'day');

    if (totaldays <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date (at least 1 night).' });
    }

    const totalAmount = totaldays * room.rent;

    const booking_id = 'BK-' + uuidv4().substring(0, 8).toUpperCase();

    // Mask card number for PCI security in storage (show last 4 digits)
    const sanitizedCardNumber = cardNumber.replace(/\s+/g, '');
    const maskedCard = '**** **** **** ' + sanitizedCardNumber.slice(-4);

    const newBooking = new Booking({
      booking_id,
      room_id: room.room_id,
      roomNumber: room.roomNumber,
      roomType: room.type,
      user_id: req.user.user_id,
      name: name || req.user.name,
      phone: phone || req.user.phone,
      fromdate,
      todate,
      totaldays,
      totalAmount,
      status: 'active',
      cardDetails: {
        cardNumber: maskedCard,
        cvvcode: '***',
        expmonthyear,
        cardholdername: cardholdername.trim(),
      },
    });

    await newBooking.save();

    // Append to Room's currentBookings
    room.currentBookings.push({
      booking_id,
      user_id: req.user.user_id,
      fromdate,
      todate,
      status: 'active',
    });

    await room.save();

    res.status(201).json({
      message: 'Room booked successfully!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Failed to complete booking.', error: error.message });
  }
};

// @desc    Get current user's booking history
// @route   GET /api/bookings/mybookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.user_id }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Fetch my bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch user bookings.', error: error.message });
  }
};

// @desc    Cancel an active booking
// @route   POST /api/bookings/cancel
const cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const booking = await Booking.findOne({ booking_id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Permission check: only booking owner or admin can cancel
    if (booking.user_id !== req.user.user_id && req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Update the room's currentBookings status
    const room = await Room.findOne({ room_id: booking.room_id });
    if (room) {
      const bIndex = room.currentBookings.findIndex((b) => b.booking_id === booking_id);
      if (bIndex !== -1) {
        room.currentBookings[bIndex].status = 'cancelled';
        await room.save();
      }
    }

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Fetch all bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch all bookings.', error: error.message });
  }
};

module.exports = {
  bookRoom,
  getMyBookings,
  cancelBooking,
  getAllBookings,
};
