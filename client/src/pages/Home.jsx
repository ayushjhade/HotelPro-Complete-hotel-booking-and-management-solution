import React, { useState, useEffect } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import API from '../services/api';
import {
  ShieldCheck,
  Zap,
  Users,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  KeyRound
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Quick filter states
  const [roomType, setRoomType] = useState('All');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const filteredRooms = roomType === 'All'
    ? rooms
    : rooms.filter((r) => r.type.toLowerCase() === roomType.toLowerCase());

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Quick Search & Feature Strip */}
      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel p-4 shadow-xl border">
          <div className="row g-3 align-items-center">
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted text-uppercase mb-1">Room Category</label>
              <select
                className="form-select border-primary"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Room Types</option>
                <option value="Deluxe">Deluxe Suites</option>
                <option value="Suite">Presidential Suites</option>
                <option value="Double">Executive Double</option>
                <option value="Single">Classic Single</option>
                <option value="Family Suite">Family Suites</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted text-uppercase mb-1">Check-in Flexibility</label>
              <div className="form-control bg-light text-muted small d-flex align-items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>Instant 24/7 Automated Check-in</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-bold text-muted text-uppercase mb-1">Guaranteed Best Rate</label>
              <div className="form-control bg-light text-muted small d-flex align-items-center gap-2">
                <ShieldCheck size={16} className="text-success" />
                <span>Zero Hidden Booking Fees</span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex align-items-end">
              <Link to="/userhome" className="btn btn-hotelpro w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                <span>View All Inventories</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rooms Section */}
      <section className="py-5">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-bold mb-2">
                CURATED INVENTORY
              </span>
              <h2 className="fw-bold mb-1 text-dark">Explore Our Featured Rooms & Suites</h2>
              <p className="text-muted mb-0">Handcrafted sanctuaries designed for relaxation, comfort, and productivity.</p>
            </div>
            <div className="d-flex gap-2">
              {['All', 'Deluxe', 'Double', 'Suite'].map((t) => (
                <button
                  key={t}
                  onClick={() => setRoomType(t)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${
                    roomType === t ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading luxury rooms...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <RoomCard key={room.room_id || room._id} room={room} onBook={handleOpenBooking} />
                ))
              ) : (
                <div className="col-12 text-center py-5 text-muted">
                  <p className="lead">No rooms found for category "{roomType}".</p>
                  <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => setRoomType('All')}>
                    Show All Rooms
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About HotelPro Section */}
      <section id="about-section" className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-warning bg-opacity-25 text-dark px-3 py-1.5 rounded-pill fw-bold mb-2">
                ABOUT HOTELPRO
              </span>
              <h2 className="display-6 fw-bold mb-3 text-dark">
                Your Ultimate Hotel Booking & Management Solution
              </h2>
              <p className="text-secondary leading-relaxed mb-4">
                At <strong>HotelPro</strong>, we offer a reliable and intuitive hotel management system
                designed to meet the evolving needs of modern hospitality. Whether you're handling reservations,
                managing guest inventories, or processing simulated payments, our platform ensures seamless operations
                with advanced security and scalability.
              </p>
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-primary text-white p-2.5 rounded-3 shadow-sm">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Real-time Availability</h6>
                      <p className="small text-muted mb-0">Instant reservation tracking without double bookings.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-success text-white p-2.5 rounded-3 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Encrypted Sessions</h6>
                      <p className="small text-muted mb-0">JSON Web Tokens & salted bcrypt hashing for total privacy.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-warning text-dark p-2.5 rounded-3 shadow-sm">
                      <Users size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Role Architecture</h6>
                      <p className="small text-muted mb-0">Dedicated portals for Ordinary Customers and Administrators.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-info text-white p-2.5 rounded-3 shadow-sm">
                      <Award size={20} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Scalable MVC</h6>
                      <p className="small text-muted mb-0">Engineered with high modularity across Express, MongoDB & React.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                  alt="HotelPro Architecture and Resort"
                  className="img-fluid rounded-4 shadow-2xl w-100 object-fit-cover"
                  style={{ height: '420px' }}
                />
                <div className="position-absolute bottom-0 start-0 m-4 p-3 bg-white bg-opacity-95 rounded-3 shadow-lg border max-w-sm">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <Clock size={16} className="text-primary" />
                    <strong className="small text-dark">Instant Room Reservation</strong>
                  </div>
                  <p className="small text-muted mb-0">Seamlessly book rooms, manage active stays, and cancel reservations anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default Home;
