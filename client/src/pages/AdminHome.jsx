import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  CalendarCheck,
  Hotel,
  PlusCircle,
  Users,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  DollarSign
} from 'lucide-react';

const AdminHome = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'rooms' | 'addroom' | 'users'

  // Data states
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Notifications
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Add Room Form state
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    type: 'Deluxe',
    rent: '',
    count: '1',
    description: '',
    photos: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Search filter
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (activeTab === 'bookings') {
        const res = await API.get('/bookings/all');
        setBookings(res.data);
      } else if (activeTab === 'rooms') {
        const res = await API.get('/rooms');
        setRooms(res.data);
      } else if (activeTab === 'users') {
        const res = await API.get('/users/all');
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Admin data fetch error', err);
      setError(err.response?.data?.message || 'Failed to fetch data for this section.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');
    setMessage('');

    try {
      const photosArray = roomFormData.photos
        ? roomFormData.photos.split(',').map((p) => p.trim())
        : [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          ];

      const payload = {
        roomNumber: roomFormData.roomNumber,
        type: roomFormData.type,
        rent: Number(roomFormData.rent),
        count: Number(roomFormData.count) || 1,
        description: roomFormData.description,
        photos: photosArray,
      };

      const res = await API.post('/rooms/add', payload);
      setMessage(`Room ${roomFormData.roomNumber} added successfully!`);
      setRoomFormData({
        roomNumber: '',
        type: 'Deluxe',
        rent: '',
        count: '1',
        description: '',
        photos: '',
      });
      // Switch to rooms tab
      setActiveTab('rooms');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add room.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room from the system?')) {
      return;
    }

    try {
      await API.delete(`/rooms/${roomId}`);
      setMessage('Room removed successfully.');
      setRooms((prev) => prev.filter((r) => r.room_id !== roomId && r._id !== roomId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room.');
    }
  };

  const handleAdminCancelBooking = async (bookingId) => {
    if (!window.confirm(`As Administrator, cancel reservation ${bookingId}?`)) return;

    try {
      await API.post('/bookings/cancel', { booking_id: bookingId });
      setMessage(`Booking ${bookingId} has been cancelled.`);
      setBookings((prev) =>
        prev.map((b) => (b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div className="py-4">
      <div className="container">
        {/* Admin Header Banner */}
        <div className="p-4 rounded-4 mb-4 text-white shadow-lg"
             style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 50%, #1e293b 100%)' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-danger px-3 py-1.5 rounded-pill fw-bold d-inline-flex align-items-center gap-1">
                  <ShieldAlert size={14} />
                  ADMINISTRATIVE CONSOLE
                </span>
              </div>
              <h1 className="h3 fw-bold mb-1 text-white">
                Hi, <span className="text-warning">{user?.name || 'Admin'}</span>
              </h1>
              <p className="small text-light text-opacity-75 mb-0">
                Manage room inventories, user bookings, guest accounts, and platform operations.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="btn btn-outline-light btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 align-self-start align-self-md-auto"
            >
              <RefreshCw size={15} />
              <span>Refresh Records</span>
            </button>
          </div>
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

        {/* Tab Navigation (MDB-styled / Bootstrap Tabs) */}
        <div className="custom-admin-tabs d-flex flex-wrap border-bottom pb-2 mb-4 gap-1">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            <CalendarCheck size={18} />
            <span>All Bookings</span>
            {bookings.length > 0 && <span className="badge bg-white text-dark ms-1">{bookings.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'rooms' ? 'active' : ''}`}
          >
            <Hotel size={18} />
            <span>All Rooms</span>
            {rooms.length > 0 && <span className="badge bg-white text-dark ms-1">{rooms.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab('addroom')}
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'addroom' ? 'active' : ''}`}
          >
            <PlusCircle size={18} />
            <span>Add Room</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>All Users</span>
            {users.length > 0 && <span className="badge bg-white text-dark ms-1">{users.length}</span>}
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading administrative data...</span>
            </div>
          </div>
        ) : (
          <div>
            {/* TAB 1: ALL BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="glass-panel p-4 shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <h5 className="fw-bold mb-0 text-dark">System Reservations ({bookings.length})</h5>
                  <div className="input-group" style={{ maxWidth: '300px' }}>
                    <span className="input-group-text bg-white"><Search size={14} className="text-muted" /></span>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Filter bookings..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-uppercase small text-muted">
                      <tr>
                        <th>Booking ID</th>
                        <th>Guest Name</th>
                        <th>Room # & Type</th>
                        <th>Dates (In / Out)</th>
                        <th>Days</th>
                        <th>Total Paid</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings
                        .filter((b) =>
                          b.booking_id.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          b.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          b.roomNumber?.toLowerCase().includes(searchFilter.toLowerCase())
                        )
                        .map((b) => {
                          const isCancelled = b.status === 'cancelled';
                          return (
                            <tr key={b.booking_id || b._id}>
                              <td>
                                <span className="badge bg-dark bg-opacity-75">{b.booking_id}</span>
                              </td>
                              <td>
                                <div className="fw-bold text-dark">{b.name}</div>
                                <div className="small text-muted">{b.phone}</div>
                              </td>
                              <td>
                                <div className="fw-semibold">Room {b.roomNumber || 'N/A'}</div>
                                <span className="badge bg-light text-secondary border">{b.roomType || 'Standard'}</span>
                              </td>
                              <td>
                                <div className="small">{b.fromdate}</div>
                                <div className="small text-muted">{b.todate}</div>
                              </td>
                              <td>{b.totaldays}N</td>
                              <td>
                                <span className="fw-bold text-primary">${b.totalAmount}</span>
                              </td>
                              <td>
                                <span className={isCancelled ? 'badge-status-cancelled' : 'badge-status-active'}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="text-end">
                                {!isCancelled && (
                                  <button
                                    onClick={() => handleAdminCancelBooking(b.booking_id)}
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1"
                                    title="Cancel Reservation"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {bookings.length === 0 && (
                    <div className="text-center py-4 text-muted small">No bookings registered yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ALL ROOMS */}
            {activeTab === 'rooms' && (
              <div className="glass-panel p-4 shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h5 className="fw-bold mb-0 text-dark">Hotel Rooms Inventory ({rooms.length})</h5>
                  <button
                    onClick={() => setActiveTab('addroom')}
                    className="btn btn-hotelpro btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
                  >
                    <PlusCircle size={15} />
                    <span>Add New Room</span>
                  </button>
                </div>

                <div className="row g-4">
                  {rooms.map((room) => (
                    <div key={room.room_id || room._id} className="col-md-6 col-lg-4">
                      <div className="card h-100 border rounded-4 overflow-hidden shadow-sm">
                        <img
                          src={room.photos?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                          alt={room.roomNumber}
                          className="w-100 object-fit-cover"
                          style={{ height: '180px' }}
                        />
                        <div className="p-3 d-flex flex-column flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h5 className="fw-bold mb-0">Room {room.roomNumber}</h5>
                              <span className="badge bg-primary px-2.5 py-1 rounded-pill small mt-1">{room.type}</span>
                            </div>
                            <div className="text-end">
                              <span className="fs-5 fw-bold text-primary">${room.rent}</span>
                              <span className="small text-muted d-block">/ night</span>
                            </div>
                          </div>
                          <p className="small text-muted text-truncate-2 mb-3 flex-grow-1">{room.description}</p>
                          <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                            <span className="small text-muted">Stock: <strong>{room.count}</strong></span>
                            <button
                              onClick={() => handleDeleteRoom(room.room_id)}
                              className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ADD ROOM */}
            {activeTab === 'addroom' && (
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="glass-panel p-4 p-md-5 shadow-sm border">
                    <div className="text-center mb-4">
                      <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-flex mb-2">
                        <PlusCircle size={28} />
                      </div>
                      <h4 className="fw-bold mb-1 text-dark">Add New Room Configuration</h4>
                      <p className="text-muted small">Expand hotel capacity with new rooms, suites, and pricing</p>
                    </div>

                    <form onSubmit={handleAddRoom}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Room Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 401"
                            value={roomFormData.roomNumber}
                            onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Room Type</label>
                          <select
                            className="form-select"
                            value={roomFormData.type}
                            onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                            required
                          >
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Presidential Suite</option>
                            <option value="Family Suite">Family Suite</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Rent Per Night ($)</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="e.g. 175"
                            value={roomFormData.rent}
                            onChange={(e) => setRoomFormData({ ...roomFormData, rent: e.target.value })}
                            required
                            min="1"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Inventory Count (Total Units)</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="e.g. 5"
                            value={roomFormData.count}
                            onChange={(e) => setRoomFormData({ ...roomFormData, count: e.target.value })}
                            required
                            min="1"
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-semibold">Photo URLs (comma-separated)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://example.com/room1.jpg, https://example.com/room2.jpg"
                            value={roomFormData.photos}
                            onChange={(e) => setRoomFormData({ ...roomFormData, photos: e.target.value })}
                          />
                          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                            Leave empty to automatically use verified high-resolution luxury room photos.
                          </span>
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-semibold">Description</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Detailed description of features, views, and room perks..."
                            value={roomFormData.description}
                            onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-hotelpro w-100 py-2.5 mt-4 d-flex align-items-center justify-content-center gap-2"
                        disabled={formSubmitting}
                      >
                        {formSubmitting ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        ) : (
                          <>
                            <PlusCircle size={18} />
                            <span>Publish Room to System</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ALL USERS */}
            {activeTab === 'users' && (
              <div className="glass-panel p-4 shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">Registered Users ({users.length})</h5>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-uppercase small text-muted">
                      <tr>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>Phone</th>
                        <th>Role / Type</th>
                        <th>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.user_id || u._id}>
                          <td>
                            <span className="badge bg-secondary bg-opacity-25 text-dark">{u.user_id}</span>
                          </td>
                          <td className="fw-bold text-dark">{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            <span className={`badge ${u.type === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                              {u.type === 'admin' ? 'Administrator' : 'Customer'}
                            </span>
                          </td>
                          <td className="small text-muted">
                            {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="text-center py-4 text-muted small">No users found.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
