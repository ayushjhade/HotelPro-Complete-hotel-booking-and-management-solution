const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['admin', 'customer', 'ordinary'],
      default: 'customer',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
