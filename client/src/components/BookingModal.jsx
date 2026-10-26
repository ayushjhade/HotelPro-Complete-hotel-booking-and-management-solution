import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import dayjs from 'dayjs';

const BookingModal = ({ room, show, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

  const [fromdate, setFromdate] = useState(today);
  const [todate, setTodate] = useState(tomorrow);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');

  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardholdername, setCardholdername] = useState(user?.name || '');
  const [expmonthyear, setExpmonthyear] = useState('');
  const [cvvcode, setCvvcode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestPhone) setGuestPhone(user.phone);
      if (!cardholdername) setCardholdername(user.name);
    }
  }, [user]);

  if (!show || !room) return null;

  // Calculate total days and amount
  const start = dayjs(fromdate);
  const end = dayjs(todate);
  const totalDays = end.diff(start, 'day');
  const totalAmount = totalDays > 0 ? totalDays * room.rent : 0;

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setExpmonthyear(val);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (totalDays <= 0) {
      setError('Check-out date must be at least 1 day after check-in date.');
      return;
    }

    if (!cardNumber || !cvvcode || !expmonthyear || !cardholdername) {
      setError('Please provide complete payment card information.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        room_id: room.room_id,
        fromdate,
        todate,
        name: guestName,
        phone: guestPhone,
        cardDetails: {
          cardNumber,
          cvvcode,
          expmonthyear,
          cardholdername,
        },
      };

      const res = await API.post('/bookings/book', payload);
      setSuccess('Reservation confirmed! Redirecting to your bookings...');
      
      setTimeout(() => {
        if (onBookingSuccess) onBookingSuccess(res.data.booking);
        onClose();
        navigate('/mybookings');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete booking. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-dark text-white border-bottom border-secondary border-opacity-25 px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary px-3 py-1.5 rounded-pill">{room.type}</span>
              <h5 className="modal-title fw-bold mb-0">Book Room #{room.roomNumber}</h5>
            </div>
            <button type="button" className="btn btn-link text-white p-0 border-0" onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 py-2">
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Room Summary Header */}
            <div className="row g-3 mb-4 bg-light p-3 rounded-3 border align-items-center">
              <div className="col-sm-4">
                <img
                  src={room.photos?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                  alt={room.roomNumber}
                  className="img-fluid rounded-3 object-fit-cover w-100"
                  style={{ height: '100px' }}
                />
              </div>
              <div className="col-sm-8">
                <h6 className="fw-bold mb-1">Room {room.roomNumber} - {room.type}</h6>
                <p className="text-muted small mb-2 text-truncate-2">{room.description}</p>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-primary fs-5">${room.rent} <span className="small text-muted fw-normal">/ night</span></span>
                  <span className="badge bg-secondary bg-opacity-25 text-dark">Available units: {room.count}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleBooking}>
              {/* Dates & Guest Details */}
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                <Calendar size={18} className="text-primary" />
                <span>1. Dates & Guest Information</span>
              </h6>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Check-In Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromdate}
                    min={today}
                    onChange={(e) => setFromdate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Check-Out Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={todate}
                    min={fromdate || today}
                    onChange={(e) => setTodate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Guest Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><User size={16} className="text-muted" /></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Contact Phone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><Phone size={16} className="text-muted" /></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. +1 555-0199"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-4 border border-primary border-opacity-25 d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted">Stay Duration: <strong>{totalDays > 0 ? totalDays : 0} {totalDays === 1 ? 'Night' : 'Nights'}</strong></div>
                  <div className="small text-muted">Nightly Rate: <strong>${room.rent}</strong></div>
                </div>
                <div className="text-end">
                  <span className="small text-muted d-block">Total Due</span>
                  <span className="fs-3 fw-bold text-primary">${totalAmount}</span>
                </div>
              </div>

              {/* Payment Info */}
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                <CreditCard size={18} className="text-primary" />
                <span>2. Payment Details (Card Simulation)</span>
              </h6>

              <div className="row g-3 mb-4">
                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name as printed on card"
                    value={cardholdername}
                    onChange={(e) => setCardholdername(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="4532 8901 2345 6789"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="col-md-3 col-6">
                  <label className="form-label small fw-semibold">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="12/28"
                    value={expmonthyear}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="col-md-3 col-6">
                  <label className="form-label small fw-semibold">CVV Code</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="123"
                    value={cvvcode}
                    onChange={(e) => setCvvcode(e.target.value.substring(0, 4))}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 text-muted small mb-4">
                <ShieldCheck size={16} className="text-success" />
                <span>Encrypted simulated checkout. No real card charge will occur.</span>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary px-4 rounded-3" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-hotelpro px-4 py-2 rounded-3 d-flex align-items-center gap-2"
                  disabled={loading || totalDays <= 0}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Confirm & Pay ${totalAmount}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
