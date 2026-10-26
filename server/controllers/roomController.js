const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all rooms
// @route   GET /api/rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findOne({
      $or: [{ room_id: req.params.id }, { _id: req.params.id }],
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving room', error: error.message });
  }
};

// @desc    Add a new room (Admin only)
// @route   POST /api/rooms/add
const addRoom = async (req, res) => {
  try {
    const { roomNumber, description, photos, type, rent, count, features } = req.body;

    if (!roomNumber || !description || !type || !rent) {
      return res.status(400).json({ message: 'Room number, description, type, and rent are required.' });
    }

    const existingRoom = await Room.findOne({ roomNumber: roomNumber.trim() });
    if (existingRoom) {
      return res.status(400).json({ message: `Room with number ${roomNumber} already exists.` });
    }

    let photoArray = [];
    if (Array.isArray(photos)) {
      photoArray = photos.filter((p) => typeof p === 'string' && p.trim() !== '');
    } else if (typeof photos === 'string' && photos.trim() !== '') {
      photoArray = photos.split(',').map((p) => p.trim());
    }

    if (photoArray.length === 0) {
      // Provide high quality default room image if none provided
      photoArray = [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      ];
    }

    const newRoom = new Room({
      room_id: 'RM-' + uuidv4().substring(0, 8).toUpperCase(),
      roomNumber: roomNumber.trim(),
      description: description.trim(),
      photos: photoArray,
      type: type.trim(),
      rent: Number(rent),
      count: count ? Number(count) : 1,
      features: features && features.length > 0 ? features : ['Free High-Speed Wi-Fi', 'Smart TV', 'Air Conditioning', 'Ensuite Bathroom', 'Room Service'],
      currentBookings: [],
    });

    const savedRoom = await newRoom.save();
    res.status(201).json({ message: 'Room added successfully', room: savedRoom });
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ message: 'Failed to add room', error: error.message });
  }
};

// @desc    Delete a room (Admin only)
// @route   DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({
      $or: [{ room_id: req.params.id }, { _id: req.params.id }],
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully', room_id: room.room_id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete room', error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  addRoom,
  deleteRoom,
};
