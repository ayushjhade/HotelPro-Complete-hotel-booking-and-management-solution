const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  addRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllRooms);
router.get('/all', getAllRooms);
router.get('/:id', getRoomById);
router.post('/add', protect, adminOnly, addRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);

module.exports = router;
