import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Shield, ArrowRight } from 'lucide-react';

const carouselSlides = [
  {
    id: 1,
    title: 'Experience Unparalleled Luxury & Comfort',
    subtitle: 'Presidential Penthouse & Executive Ocean Suites',
    description: 'Immerse yourself in world-class hospitality, private terraces, exquisite fine dining, and customized concierge service.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
    tag: 'Signature Suite',
  },
  {
    id: 2,
    title: 'Modern Living for Discerning Travelers',
    subtitle: 'Ergonomic Executive Rooms with City Skyline Views',
    description: 'Seamlessly blend business and leisure with high-speed fiber internet, ergonomic workstations, and restful bedding.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
    tag: 'Executive Choice',
  },
  {
    id: 3,
    title: 'Family Vacations & Memorable Getaways',
    subtitle: 'Connecting Grand Suites with Resort Amenities',
    description: 'Create unforgettable family moments with expansive living areas, child-friendly suites, and on-demand entertainment.',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80',
    tag: 'Family Resort',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

  return (
    <div className="position-relative overflow-hidden shadow-lg" style={{ minHeight: '520px' }}>
      {carouselSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`position-absolute w-100 h-100 transition-opacity duration-700 ${
              isActive ? 'opacity-100 z-1' : 'opacity-0 z-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'opacity 0.8s ease-in-out',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              minHeight: '520px',
            }}
          >
            <div className="hero-overlay">
              <div className="container py-5">
                <div className="row">
                  <div className="col-lg-8 col-md-10 text-white">
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-1 shadow-sm">
                      <Sparkles size={15} />
                      {slide.tag}
                    </span>
                    <h1 className="display-4 fw-extrabold mb-3 text-white lh-sm">
                      {slide.title}
                    </h1>
                    <h4 className="fw-semibold text-warning mb-3">
                      {slide.subtitle}
                    </h4>
                    <p className="lead text-light text-opacity-90 mb-4 pe-lg-5">
                      {slide.description}
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                      <Link to="/userhome" className="btn btn-hotelpro-gold btn-lg d-flex align-items-center gap-2 shadow">
                        <span>Explore & Book Rooms</span>
                        <ArrowRight size={18} />
                      </Link>
                      <a href="#about-section" className="btn btn-outline-light btn-lg px-4 rounded-3">
                        About HotelPro
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="btn btn-dark bg-opacity-50 text-white position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle p-2 z-2 border-0 shadow"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="btn btn-dark bg-opacity-50 text-white position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle p-2 z-2 border-0 shadow"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 z-2 d-flex gap-2">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`border-0 rounded-pill transition-all ${
              i === currentSlide ? 'bg-warning' : 'bg-white bg-opacity-50'
            }`}
            style={{
              width: i === currentSlide ? '32px' : '10px',
              height: '8px',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
