import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Clock,
  ArrowRight,
  CreditCard
} from 'lucide-react';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await API.get('/bookings/mybookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load user bookings', err);
      setError('Unable to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action will free up the room.')) {
      return;
    }

    setActionLoading(bookingId);
    setError('');
    setMessage('');

    try {
      // POST to /api/bookings/cancelbooking
      const res = await API.post('/bookings/cancelbooking', { booking_id: bookingId });
      setMessage(res.data.message || 'Booking cancelled successfully.');

      // Update state locally
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking.';
      setError(msg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="py-4">
      <div className="container">
        {/* Header Breadcrumb */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
              <CalendarCheck className="text-primary" />
              <span>My Booking Reservations</span>
            </h2>
            <p className="text-muted mb-0">
              Track your reservation status, check-in schedules, and active hotel stays.
            </p>
          </div>
          <Link to="/userhome" className="btn btn-outline-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 align-self-start align-self-md-auto">
            <span>Book Another Room</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Feedback Alerts */}
        {message && (
          <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 py-2.5 mb-4 shadow-sm">
            <CheckCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2.5 mb-4 shadow-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Booking Cards / Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading bookings...</span>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel text-center py-5 p-4 border">
            <CalendarCheck size={48} className="text-muted mb-3 opacity-50" />
            <h4 className="fw-bold text-dark">No reservations yet</h4>
            <p className="text-muted small mb-4">
              You haven't made any hotel room reservations. Explore our rooms and book your first stay today!
            </p>
            <Link to="/userhome" className="btn btn-hotelpro px-4 py-2.5 rounded-3">
              Explore Available Rooms
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => {
              const isCancelled = booking.status === 'cancelled';

              return (
                <div key={booking.booking_id || booking._id} className="col-lg-6">
                  <div className={`card border rounded-4 shadow-sm h-100 overflow-hidden ${isCancelled ? 'bg-light opacity-90' : 'bg-white'}`}>
                    {/* Header */}
                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-dark px-2.5 py-1 rounded-pill small">
                          ID: {booking.booking_id}
                        </span>
                        <span className="fw-bold text-dark">
                          Room {booking.roomNumber || 'N/A'} ({booking.roomType || 'Standard'})
                        </span>
                      </div>
                      <span className={isCancelled ? 'badge-status-cancelled' : 'badge-status-active'}>
                        {isCancelled ? <XCircle size={14} /> : <CheckCircle size={14} />}
                        <span className="text-capitalize">{booking.status}</span>
                      </span>
                    </div>

                    {/* Body */}
                    <div className="card-body p-4">
                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                            <Calendar size={14} className="text-primary" />
                            <span>Check-in Date</span>
                          </div>
                          <div className="fw-bold text-dark">{booking.fromdate}</div>
                        </div>

                        <div className="col-sm-6">
                          <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                            <Calendar size={14} className="text-primary" />
                            <span>Check-out Date</span>
                          </div>
                          <div className="fw-bold text-dark">{booking.todate}</div>
                        </div>

                        <div className="col-sm-6">
                          <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                            <Clock size={14} className="text-primary" />
                            <span>Duration</span>
                          </div>
                          <div className="fw-bold text-dark">
                            {booking.totaldays} {booking.totaldays === 1 ? 'Night' : 'Nights'}
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                            <Phone size={14} className="text-primary" />
                            <span>Registered Phone</span>
                          </div>
                          <div className="fw-bold text-dark">{booking.phone || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Payment summary box */}
                      <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <span className="small text-muted d-block">Simulated Card Payment</span>
                          <span className="small fw-semibold text-secondary d-flex align-items-center gap-1">
                            <CreditCard size={14} />
                            {booking.cardDetails?.cardNumber || 'Card On File'}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="small text-muted d-block">Total Paid</span>
                          <span className="fs-4 fw-bold text-primary">${booking.totalAmount}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={() => handleCancelBooking(booking.booking_id)}
                          className={`btn btn-sm rounded-pill px-4 py-2 d-flex align-items-center gap-1 ${
                            isCancelled
                              ? 'btn-outline-secondary disabled'
                              : 'btn-outline-danger'
                          }`}
                          disabled={isCancelled || actionLoading === booking.booking_id}
                        >
                          {actionLoading === booking.booking_id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          ) : isCancelled ? (
                            <span>Reservation Cancelled</span>
                          ) : (
                            <>
                              <XCircle size={15} />
                              <span>Cancel Booking</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
