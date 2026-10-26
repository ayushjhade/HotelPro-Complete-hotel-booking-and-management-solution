import React from 'react';
import { Hotel, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-secondary border-opacity-25 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white p-2 rounded-3">
                <Hotel size={22} className="text-warning" />
              </div>
              <span className="fs-4 fw-bold">Hotel<span className="text-warning">Pro</span></span>
            </div>
            <p className="text-secondary small pe-lg-4">
              Your ultimate hotel management and reservation solution. Streamlining hotel operations,
              guest reservations, and payment processing with bank-grade security and intuitive design.
            </p>
            <div className="d-flex align-items-center gap-2 text-secondary small">
              <ShieldCheck size={16} className="text-success" />
              <span>PCI-DSS Compliant • 256-Bit SSL Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small letter-spacing-1">Navigation</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li className="mb-2"><Link to="/userhome" className="text-secondary text-decoration-none hover-white">Available Rooms</Link></li>
              <li className="mb-2"><Link to="/login" className="text-secondary text-decoration-none hover-white">Guest Login</Link></li>
              <li className="mb-2"><Link to="/signup" className="text-secondary text-decoration-none hover-white">Create Account</Link></li>
            </ul>
          </div>

          {/* Hospitality Chains */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small letter-spacing-1">Rooms & Suites</h6>
            <ul className="list-unstyled small">
              <li className="mb-2 text-secondary">Deluxe Ocean Suite</li>
              <li className="mb-2 text-secondary">Executive Double</li>
              <li className="mb-2 text-secondary">Presidential Penthouse</li>
              <li className="mb-2 text-secondary">Family Grand Suite</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small letter-spacing-1">Contact & Support</h6>
            <div className="small text-secondary mb-2 d-flex align-items-center gap-2">
              <MapPin size={16} className="text-warning flex-shrink-0" />
              <span>742 Evergreen Promenade, Silicon Bay, CA 94016</span>
            </div>
            <div className="small text-secondary mb-2 d-flex align-items-center gap-2">
              <Phone size={16} className="text-warning flex-shrink-0" />
              <span>+1 (800) 555-HOTELPRO / (800) 555-4683</span>
            </div>
            <div className="small text-secondary mb-2 d-flex align-items-center gap-2">
              <Mail size={16} className="text-warning flex-shrink-0" />
              <span>support@hotelpro-system.com</span>
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <div>
            © {new Date().getFullYear()} HotelPro Inc. All rights reserved. Built with MERN Stack.
          </div>
          <div className="d-flex align-items-center gap-1">
            Designed for Modern Hospitality Operations
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
