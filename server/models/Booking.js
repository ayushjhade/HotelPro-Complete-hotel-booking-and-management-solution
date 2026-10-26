const mongoose = require('mongoose');

const cardDetailsSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: true,
    },
    cvvcode: {
      type: String,
      required: true,
    },
    expmonthyear: {
      type: String,
      required: true,
    },
    cardholdername: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    booking_id: {
      type: String,
      required: true,
      unique: true,
    },
    room_id: {
      type: String,
      required: true,
      ref: 'Room',
    },
    roomNumber: {
      type: String,
    },
    roomType: {
      type: String,
    },
    user_id: {
      type: String,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    fromdate: {
      type: String,
      required: true,
    },
    todate: {
      type: String,
      required: true,
    },
    totaldays: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'booked', 'cancelled'],
      default: 'active',
    },
    cardDetails: {
      type: cardDetailsSchema,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
