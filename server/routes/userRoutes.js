const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/SignUp', registerUser); // Case-insensitive alias matching user prompt
router.post('/login', loginUser);
router.post('/Login', loginUser); // Case-insensitive alias matching user prompt
router.get('/profile', protect, getUserProfile);
router.get('/all', protect, adminOnly, getAllUsers);

module.exports = router;
