const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateToken = (userId, type) => {
  return jwt.sign(
    { id: userId, type },
    process.env.JWT_SECRET || 'hotelpro_secret_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user (Customer or Admin)
// @route   POST /api/users/signup
const registerUser = async (req, res) => {
  try {
    const { name, email, password, c_password, confirmPassword, phone, type } = req.body;

    const confirmPass = c_password || confirmPassword;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (confirmPass && password !== confirmPass) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Normalize type to admin or customer
    const userRole = type && type.toLowerCase() === 'admin' ? 'admin' : 'customer';

    const newUser = new User({
      user_id: 'USR-' + uuidv4().substring(0, 8).toUpperCase(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
      type: userRole,
    });

    await newUser.save();

    const token = generateToken(newUser.user_id, newUser.type);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        type: newUser.type,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user.user_id, user.type);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/users/all
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile.', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
};
