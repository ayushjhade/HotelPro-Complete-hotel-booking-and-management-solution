const mongoose = require('mongoose');

const currentBookingSchema = new mongoose.Schema(
  {
    booking_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    fromdate: {
      type: String,
      required: true,
    },
    todate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      required: true,
      unique: true,
    },
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    features: {
      type: [String],
      default: ['Free Wi-Fi', 'Air Conditioning', 'King Bed', 'Room Service'],
    },
    currentBookings: [currentBookingSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
