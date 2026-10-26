import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, User, LogOut, CalendarCheck, ShieldAlert, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark hotelpro-navbar sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white" to="/">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
            <Hotel size={22} className="text-warning" />
          </div>
          <span>Hotel<span className="text-warning">Pro</span></span>
          <span className="brand-badge">PREMIUM</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarHotelPro"
          aria-controls="navbarHotelPro"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarHotelPro">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold active' : 'text-light'}`} to="/">
                Home
              </NavLink>
            </li>

            {isAuthenticated && !isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold active' : 'text-light'}`} to="/userhome">
                    Browse Rooms
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold active' : 'text-light'}`} to="/mybookings">
                    <CalendarCheck size={16} className="me-1" />
                    My Bookings
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-white fw-semibold active' : 'text-light'}`} to="/adminhome">
                  <ShieldAlert size={16} className="me-1 text-warning" />
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Area */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 text-white bg-dark bg-opacity-50 px-3 py-1 rounded-pill border border-secondary border-opacity-25">
                  <User size={16} className="text-warning" />
                  <span className="small fw-medium">
                    Hi, <strong className="text-warning">{user?.name}</strong> {isAdmin && <span className="badge bg-danger ms-1">Admin</span>}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm d-flex align-items-center gap-1 rounded-pill px-3 py-1.5"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1">
                  <LogIn size={15} />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="btn btn-warning btn-sm fw-bold rounded-pill px-3 py-1.5 d-flex align-items-center gap-1 text-dark">
                  <UserPlus size={15} />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
