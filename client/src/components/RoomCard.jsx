import React from 'react';
import { Wifi, Tv, Wind, Check, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room, onBook }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      onBook(room);
    }
  };

  const mainPhoto =
    room.photos && room.photos.length > 0
      ? room.photos[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="room-card h-100 d-flex flex-column shadow-sm">
        {/* Photo Container */}
        <div className="room-card-img-container position-relative">
          <img
            src={mainPhoto}
            alt={`Room ${room.roomNumber} - ${room.type}`}
            className="room-card-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <span className="room-type-tag">{room.type}</span>
          <div className="room-price-badge">
            ${room.rent} <span className="small fw-normal">/ night</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0 text-dark">Room {room.roomNumber}</h5>
            <span className="badge bg-light text-secondary border">
              {room.count} {room.count === 1 ? 'Unit' : 'Units'} Available
            </span>
          </div>

          <p className="text-muted small mb-3 flex-grow-1" style={{ minHeight: '48px' }}>
            {room.description}
          </p>

          {/* Features */}
          <div className="d-flex flex-wrap gap-1 mb-4">
            {room.features && room.features.length > 0 ? (
              room.features.slice(0, 3).map((feat, index) => (
                <span key={index} className="badge bg-light text-dark border small fw-normal py-1.5 px-2.5">
                  <Check size={12} className="text-success me-1" />
                  {feat}
                </span>
              ))
            ) : (
              <span className="badge bg-light text-muted border small">Wi-Fi & Air Conditioning</span>
            )}
          </div>

          {/* Action */}
          <button
            onClick={handleBookClick}
            className="btn btn-hotelpro w-100 d-flex align-items-center justify-content-center gap-2 mt-auto"
          >
            <span>{isAuthenticated ? 'Book This Room' : 'Login to Reserve'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
