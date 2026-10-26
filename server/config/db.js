const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedInitialData = async () => {
  try {
    const User = require('../models/User');
    const Room = require('../models/Room');

    // Seed Admin and Demo Customer if none exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      const userPassword = await bcrypt.hash('password123', salt);

      await User.create([
        {
          user_id: 'USR-ADMIN01',
          name: 'HotelPro Admin',
          email: 'admin@hotelpro.com',
          password: adminPassword,
          phone: '+1-800-555-0199',
          type: 'admin',
        },
        {
          user_id: 'USR-CUST01',
          name: 'John Doe',
          email: 'john@example.com',
          password: userPassword,
          phone: '+1-555-0144',
          type: 'customer',
        },
      ]);
      console.log('✅ Seeded default Admin (admin@hotelpro.com / admin123) and Customer (john@example.com / password123)');
    }

    // Seed Initial Luxury Rooms if none exist
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      await Room.create([
        {
          room_id: 'RM-DELUXE101',
          roomNumber: '101',
          description: 'Spacious deluxe room featuring a scenic private balcony, panoramic sea views, plush king-size bed, marble bathroom, and premium entertainment system.',
          photos: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
          ],
          type: 'Deluxe',
          rent: 180,
          count: 5,
          features: ['King Size Bed', 'Ocean View Balcony', 'High-Speed Wi-Fi', 'Smart 55" 4K TV', 'Minibar & Espresso Machine'],
          currentBookings: [],
        },
        {
          room_id: 'RM-EXEC102',
          roomNumber: '102',
          description: 'Designed for business travelers and couples seeking refined comfort. Includes an ergonomic workspace, soundproof windows, and luxurious double beds.',
          photos: [
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
          ],
          type: 'Double',
          rent: 130,
          count: 8,
          features: ['Double Queen Beds', 'Ergonomic Workstation', 'High-Speed Wi-Fi', 'Rain Shower', 'City Skyline View'],
          currentBookings: [],
        },
        {
          room_id: 'RM-PENT201',
          roomNumber: '201',
          description: 'The pinnacle of luxury at HotelPro. Features a private jacuzzi, dedicated lounge area, custom cocktail bar, and 24/7 dedicated butler service.',
          photos: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
          ],
          type: 'Suite',
          rent: 320,
          count: 2,
          features: ['Private Jacuzzi', 'Separate Living Room', 'Butler Service', 'Complimentary Breakfast', 'Panoramic Views'],
          currentBookings: [],
        },
        {
          room_id: 'RM-CLASSIC202',
          roomNumber: '202',
          description: 'Cozy and stylish room tailored for solo travelers and brief stays. Features a plush single bed, ambient lighting, and modern bath amenities.',
          photos: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
          ],
          type: 'Single',
          rent: 80,
          count: 10,
          features: ['Single Luxury Bed', 'High-Speed Wi-Fi', 'Coffee Maker', 'Climate Control', 'Safe Deposit Box'],
          currentBookings: [],
        },
        {
          room_id: 'RM-FAMILY301',
          roomNumber: '301',
          description: 'Spacious two-bedroom family suite offering ample room for relaxation, child-friendly amenities, dining area, and double entertainment units.',
          photos: [
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
          ],
          type: 'Family Suite',
          rent: 240,
          count: 3,
          features: ['2 Connecting Bedrooms', 'Dining Table & Kitchenette', '2 Full Bathrooms', 'Game Console & Smart TVs'],
          currentBookings: [],
        },
      ]);
      console.log('✅ Seeded 5 initial luxury rooms into HotelPro database.');
    }
  } catch (seedErr) {
    console.error('Seeding error:', seedErr);
  }
};

let mongodInstance = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotel';

  try {
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('✅ Connected to MongoDB at:', mongoURI);
    await seedInitialData();
  } catch (error) {
    console.warn(`Standard MongoDB connection to ${mongoURI} failed (${error.message}).`);
    console.log('Starting high-compatibility embedded MongoDB server...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        binary: {
          os: { os: 'linux', dist: 'ubuntu', release: '22.04' },
          version: '7.0.5',
        },
      });
      const inMemoryUri = mongodInstance.getUri();
      console.log(`✅ Embedded MongoDB engine running at: ${inMemoryUri}`);

      await mongoose.connect(inMemoryUri);
      console.log('✅ Connected to embedded MongoDB successfully.');
      await seedInitialData();
    } catch (fallbackError) {
      console.error('Failed to initialize embedded MongoDB:', fallbackError);
      throw fallbackError;
    }
  }
};

module.exports = connectDB;
