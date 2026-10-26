import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import {
  CalendarCheck,
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Hotel,
  Compass
} from 'lucide-react';
import dayjs from 'dayjs';

const UserHome = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roomType, setRoomType] = useState('All');
  const [checkInDate, setCheckInDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [checkOutDate, setCheckOutDate] = useState(dayjs().add(2, 'day').format('YYYY-MM-DD'));

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load rooms', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesType = roomType === 'All' || r.type.toLowerCase() === roomType.toLowerCase();
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="py-4">
      <div className="container">
        {/* Personalized Welcome Banner */}
        <div className="p-4 p-md-5 mb-4 rounded-4 text-white shadow-lg position-relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)' }}>
          <div className="row align-items-center position-relative z-1">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill fw-bold mb-2 d-inline-flex align-items-center gap-1">
                <Sparkles size={14} />
                CUSTOMER PORTAL
              </span>
              <h1 className="display-5 fw-extrabold mb-2 text-white">
                Hi, <span className="text-warning">{user?.name || 'Guest'}</span>!
              </h1>
              <p className="lead text-light text-opacity-90 mb-4 pe-lg-4">
                Welcome to your HotelPro dashboard. Browse our luxury accommodations, select arrival dates, and secure your room reservation with instant confirmation.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/mybookings" className="btn btn-hotelpro-gold px-4 py-2.5 rounded-3 d-flex align-items-center gap-2">
                  <CalendarCheck size={18} />
                  <span>View My Bookings</span>
                </Link>
                <a href="#room-directory" className="btn btn-outline-light px-4 py-2.5 rounded-3 d-flex align-items-center gap-2">
                  <Compass size={18} />
                  <span>Browse All Rooms</span>
                </a>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block text-end">
              <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-white border-opacity-20 d-inline-block text-start">
                <div className="small text-warning fw-bold text-uppercase mb-1">Account Summary</div>
                <div className="fs-5 fw-bold text-white mb-1">{user?.email}</div>
                <div className="small text-light text-opacity-75 mb-3">{user?.phone}</div>
                <div className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-1.5 rounded-pill">
                  Verified Customer
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Date Search Bar */}
        <div id="room-directory" className="glass-panel p-4 mb-4 border shadow-sm">
          <div className="row g-3 align-items-end">
            <div className="col-lg-4 col-md-6">
              <label className="form-label small fw-bold text-muted text-uppercase mb-1">Search Rooms</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><Search size={16} className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by room #, type, amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted text-uppercase mb-1">Room Category</label>
              <select
                className="form-select"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Deluxe">Deluxe Suites</option>
                <option value="Suite">Presidential Suites</option>
                <option value="Double">Executive Double</option>
                <option value="Single">Classic Single</option>
                <option value="Family Suite">Family Suites</option>
              </select>
            </div>

            <div className="col-lg-5 col-md-12">
              <div className="d-flex align-items-center justify-content-between p-2 px-3 bg-light rounded-3 border">
                <div className="small text-muted">
                  Showing <strong>{filteredRooms.length}</strong> available room configurations
                </div>
                {(roomType !== 'All' || searchQuery !== '') && (
                  <button
                    className="btn btn-link btn-sm text-primary p-0 text-decoration-none"
                    onClick={() => { setRoomType('All'); setSearchQuery(''); }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Room List (GetRooms) */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading rooms...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomCard
                  key={room.room_id || room._id}
                  room={room}
                  onBook={handleOpenBooking}
                />
              ))
            ) : (
              <div className="col-12 text-center py-5 text-muted glass-panel border">
                <Hotel size={40} className="text-muted mb-3 opacity-50" />
                <h5>No rooms match your filter criteria</h5>
                <p className="small mb-3">Try altering your search keyword or selecting a different category.</p>
                <button
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  onClick={() => { setRoomType('All'); setSearchQuery(''); }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          show={showModal}
          onClose={() => setShowModal(false)}
          onBookingSuccess={() => fetchRooms()}
        />
      )}
    </div>
  );
};

export default UserHome;
