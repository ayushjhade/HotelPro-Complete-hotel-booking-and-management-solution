import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    c_password: '',
    phone: '',
    type: 'customer',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { name, email, password, c_password, phone, type } = formData;

    if (!name || !email || !password || !c_password || !phone || !type) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (password !== c_password) {
      setErrorMsg('Passwords do not match. Please verify your confirm password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    const result = await register({
      name,
      email,
      password,
      c_password,
      phone,
      type,
    });

    if (result.success) {
      setSuccessMsg(result.message || 'Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card border-0 rounded-4 shadow-xl overflow-hidden">
              <div className="p-4 p-sm-5 bg-white">
                <div className="text-center mb-4">
                  <div className="bg-warning bg-opacity-25 text-warning p-3 rounded-circle d-inline-flex mb-3">
                    <UserPlus size={28} className="text-dark" />
                  </div>
                  <h3 className="fw-bold mb-1 text-dark">Join HotelPro</h3>
                  <p className="text-muted small">Create your account for personalized hotel bookings</p>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 small mb-4">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 py-2 small mb-4">
                    <CheckCircle size={16} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><User size={16} className="text-muted" /></span>
                        <input
                          type="text"
                          name="name"
                          className="form-control border-start-0"
                          placeholder="e.g. Alex Henderson"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-muted" /></span>
                        <input
                          type="email"
                          name="email"
                          className="form-control border-start-0"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Phone size={16} className="text-muted" /></span>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control border-start-0"
                          placeholder="+1 555-0199"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* User Type Selection */}
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Account Role / Type</label>
                      <div className="d-flex gap-3">
                        <div className="form-check p-3 border rounded-3 flex-fill bg-light">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="type"
                            id="roleCustomer"
                            value="customer"
                            checked={formData.type === 'customer'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label fw-semibold text-dark small" htmlFor="roleCustomer">
                            Customer / Ordinary User
                            <span className="d-block text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                              Book hotel rooms, view history & manage stays
                            </span>
                          </label>
                        </div>
                        <div className="form-check p-3 border rounded-3 flex-fill bg-light">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="type"
                            id="roleAdmin"
                            value="admin"
                            checked={formData.type === 'admin'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label fw-semibold text-dark small" htmlFor="roleAdmin">
                            Hotel Administrator
                            <span className="d-block text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                              Manage rooms, view all bookings & user records
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                        <input
                          type="password"
                          name="password"
                          className="form-control border-start-0"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                        <input
                          type="password"
                          name="c_password"
                          className="form-control border-start-0"
                          placeholder="••••••••"
                          value={formData.c_password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-hotelpro w-100 py-2.5 mt-4 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 pt-2">
                  <span className="text-muted small">Already have an account? </span>
                  <Link to="/login" className="text-primary fw-semibold small text-decoration-none">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
