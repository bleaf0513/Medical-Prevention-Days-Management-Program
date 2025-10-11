import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import ServiceCard from "../components/ServiceCard";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import LogoCarousel3D from "../components/LogoCarousel3D";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaShieldAlt, FaUsers, FaAward, FaStethoscope, FaHeartbeat, FaArrowRight } from "react-icons/fa";

export default function Home({ showBookingModal: propShowBookingModal, setShowBookingModal: propSetShowBookingModal }) {
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Use props if provided, otherwise use local state
  const modalState = propShowBookingModal !== undefined ? propShowBookingModal : showBookingModal;
  const setModalState = propSetShowBookingModal || setShowBookingModal;

  const services = [
    {
      title: "Centro Antifumo",
      description: "Professional smoking cessation programs with personalized support and proven methods.",
      category: "centro-antifumo"
    },
    {
      title: "Nutrizionista",
      description: "Expert nutritional counseling and personalized diet plans for optimal health.",
      category: "nutrizionista"
    },
    {
      title: "Screening Epatite C",
      description: "Comprehensive Hepatitis C screening and early detection services.",
      category: "screening-epatite-c"
    },
    {
      title: "Prevenzione Andrologica",
      description: "Specialized men's health prevention and screening services.",
      category: "prevenzione-andrologica"
    }
  ];

  const features = [
    {
      icon: <FaCalendarAlt size={40} className="text-primary" />,
      title: "Easy Booking",
      description: "Book your appointment online in just a few clicks with our intuitive booking system",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: <FaShieldAlt size={40} className="text-success" />,
      title: "Safe & Secure",
      description: "Your health data is protected with industry-standard security and privacy measures",
      color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    },
    {
      icon: <FaUsers size={40} className="text-info" />,
      title: "Expert Care",
      description: "Qualified medical professionals dedicated to your wellness and health goals",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: <FaAward size={40} className="text-warning" />,
      title: "Trusted Service",
      description: "Partnered with leading healthcare institutions and medical organizations",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    }
  ];

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-particles">
            {Array.from({ length: 50 }, (_, index) => (
              <div 
                key={index} 
                className="particle"
                style={{
                  '--delay': `${index * 0.1}s`,
                  '--duration': `${3 + Math.random() * 4}s`,
                  '--x': `${Math.random() * 100}%`,
                  '--y': `${Math.random() * 100}%`,
                  '--size': `${Math.random() * 4 + 2}px`
                }}
              />
            ))}
          </div>
          <div className="hero-gradient-overlay"></div>
        </div>
        
        <Container className="hero-container">
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="hero-content">
                <div className="hero-badge">
                  <FaStethoscope className="me-2" />
                  <span>Medical Prevention Center</span>
                </div>
                
                <h1 className="hero-title">
                  Your Health, <br />
                  <span className="text-gradient">Our Priority</span>
                </h1>
                
                <p className="hero-description">
                  Book your medical prevention appointments with ease. Early detection saves lives and ensures better health outcomes for you and your family.
                </p>
                
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Patients Served</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">Satisfaction Rate</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Support Available</div>
                  </div>
                </div>
                
                <div className="hero-actions">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => setModalState(true)}
                    className="hero-btn-primary"
                  >
                    <FaCalendarAlt className="me-2" />
                    Book Appointment
                    <FaArrowRight className="ms-2" />
                  </Button>
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    onClick={() => navigate("/register")}
                    className="hero-btn-secondary"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </Col>
            
            <Col lg={6} className="text-center">
              <div className="hero-visual">
                <div className="floating-cards">
                  <div className="floating-card card-1">
                    <div className="card-icon">
                      <FaHeartbeat />
                    </div>
                    <div className="card-text">
                      <div className="card-title">Health Check</div>
                      <div className="card-subtitle">Regular monitoring</div>
                    </div>
                  </div>
                  
                  <div className="floating-card card-2">
                    <div className="card-icon">
                      <FaShieldAlt />
                    </div>
                    <div className="card-text">
                      <div className="card-title">Prevention</div>
                      <div className="card-subtitle">Early detection</div>
                    </div>
                  </div>
                  
                  <div className="floating-card card-3">
                    <div className="card-icon">
                      <FaUsers />
                    </div>
                    <div className="card-text">
                      <div className="card-title">Expert Care</div>
                      <div className="card-subtitle">Professional team</div>
                    </div>
                  </div>
                </div>
                
                <div className="hero-image-container">
                  <img 
                    src="/assets/img (7).jpg" 
                    alt="Medical Prevention" 
                    className="hero-main-image"
                  />
                  <div className="image-overlay"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Our Services</h2>
              <p className="lead text-muted">
                Comprehensive medical prevention services tailored to your needs
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {services.map((service, index) => (
              <Col md={6} lg={3} key={index}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  onAction={() => navigate(`/booking/${service.category}`)}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Facility Section */}
      <section className="facility-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3 text-primary">Our Modern Facility</h2>
              <p className="lead text-muted">
                State-of-the-art medical center equipped with cutting-edge technology
              </p>
            </Col>
          </Row>
          <Row className="g-5 align-items-center">
            <Col lg={6}>
              <div className="facility-image-container">
                <img 
                  src="/img12.jpg" 
                  alt="Medical Facility" 
                  className="facility-image"
                />
                <div className="image-overlay-content">
                  <h4 className="text-white fw-bold">Advanced Equipment</h4>
                  <p className="text-white-50">Latest medical technology for accurate diagnosis</p>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="facility-content">
                <h3 className="fw-bold mb-4 text-primary">Why Our Facility Stands Out</h3>
                <div className="facility-features">
                  <div className="facility-feature">
                    <div className="feature-icon">
                      <FaShieldAlt />
                    </div>
                    <div className="feature-text">
                      <h5 className="fw-bold">Safety First</h5>
                      <p className="text-muted">Sterile environment with strict safety protocols</p>
                    </div>
                  </div>
                  <div className="facility-feature">
                    <div className="feature-icon">
                      <FaHeartbeat />
                    </div>
                    <div className="feature-text">
                      <h5 className="fw-bold">Modern Technology</h5>
                      <p className="text-muted">Latest diagnostic and treatment equipment</p>
                    </div>
                  </div>
                  <div className="facility-feature">
                    <div className="feature-icon">
                      <FaUsers />
                    </div>
                    <div className="feature-text">
                      <h5 className="fw-bold">Expert Staff</h5>
                      <p className="text-muted">Qualified medical professionals dedicated to your care</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-5 g-5 align-items-center">
            <Col lg={6} className="order-lg-2">
              <div className="facility-image-container">
                <img 
                  src="/img15.jpg" 
                  alt="Comfortable Medical Environment" 
                  className="facility-image"
                />
                <div className="image-overlay-content">
                  <h4 className="text-white fw-bold">Comfortable Care</h4>
                  <p className="text-white-50">Welcoming environment for your wellness journey</p>
                </div>
              </div>
            </Col>
            <Col lg={6} className="order-lg-1">
              <div className="facility-content">
                <h3 className="fw-bold mb-4 text-primary">Comfortable Environment</h3>
                <p className="lead text-muted mb-4">
                  We believe that a comfortable, welcoming environment is essential for effective healthcare. 
                  Our facility is designed to put you at ease while providing the highest quality medical care.
                </p>
                <div className="facility-stats">
                  <div className="stat-item">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Sterile Environment</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Emergency Support</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3 text-primary">Why Choose Us?</h2>
              <p className="lead text-muted">
                We're committed to providing the best healthcare experience with cutting-edge technology
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index}>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 3D Logo Carousel */}
      <LogoCarousel3D />

      <Footer />
      
      {/* Booking Modal */}
      <BookingModal 
        show={modalState} 
        onHide={() => setModalState(false)} 
      />

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
        }

        [data-theme="dark"] .hero-section {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1a1a1a 100%);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: var(--size);
          height: var(--size);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          left: var(--x);
          top: var(--y);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.8;
          }
        }

        .hero-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(96, 165, 250, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
        }

        .hero-container {
          position: relative;
          z-index: 2;
          padding: 2rem 0;
        }

        .hero-content {
          color: white;
          animation: fadeInUp 1s ease-out;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
          color: #1d4ed8;
        }

        .hero-badge:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .text-gradient {
          background: linear-gradient(45deg, #ffffff, #22d3ee, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(20deg); }
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #22d3ee;
          margin-bottom: 0.25rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          border: none;
          border-radius: 50px;
          font-weight: 600;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hero-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .hero-btn-primary:hover::before {
          left: 100%;
        }

        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
          background: linear-gradient(45deg, #1d4ed8, #3b82f6);
        }

        .hero-btn-secondary {
          border-radius: 50px;
          font-weight: 600;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.8);
          color: white;
          transition: all 0.3s ease;
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 1);
          transform: translateY(-3px);
          color: white;
        }

        .hero-visual {
          position: relative;
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-cards {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .floating-card:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .card-1 {
          top: 10%;
          left: 10%;
          animation: floatCard1 6s ease-in-out infinite;
        }

        .card-2 {
          top: 60%;
          right: 15%;
          animation: floatCard2 6s ease-in-out infinite;
        }

        .card-3 {
          bottom: 20%;
          left: 20%;
          animation: floatCard3 6s ease-in-out infinite;
        }

        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }

        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-20px) rotate(-2deg); }
        }

        @keyframes floatCard3 {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }

        .card-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }

        .card-text {
          color: #1d4ed8;
        }

        .card-title {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .hero-image-container {
          position: relative;
          width: 400px;
          height: 500px;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .hero-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hero-image-container:hover .image-overlay {
          opacity: 1;
        }

        .hero-image-container:hover .hero-main-image {
          transform: scale(1.05);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .facility-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
          overflow: hidden;
        }

        .facility-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .facility-image-container {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          padding: 8px;
        }

        .facility-image-container:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .facility-image {
          width: 100%;
          height: 450px;
          object-fit: cover;
          border-radius: 16px;
          transition: transform 0.4s ease;
        }

        .facility-image-container:hover .facility-image {
          transform: scale(1.02);
        }

        .image-overlay-content {
          position: absolute;
          bottom: 0;
          left: 8px;
          right: 8px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          padding: 2rem;
          color: white;
          border-radius: 0 0 16px 16px;
        }

        .facility-content {
          padding: 2rem 0;
        }

        .facility-features {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .facility-feature {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 1.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .facility-feature:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .facility-feature .feature-icon {
          width: 60px;
          height: 60px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .facility-feature .feature-text h5 {
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          font-size: 1.1rem;
        }

        .facility-feature .feature-text p {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        .facility-stats {
          display: flex;
          gap: 3rem;
          margin-top: 2rem;
          justify-content: center;
        }

        .facility-stats .stat-item {
          text-align: center;
          padding: 1.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .facility-stats .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .facility-stats .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .facility-stats .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        [data-theme="dark"] .facility-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        [data-theme="dark"] .facility-section::before {
          background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
        }

        [data-theme="dark"] .facility-image-container {
          background: #1e293b;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        [data-theme="dark"] .facility-image-container:hover {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
        }

        [data-theme="dark"] .facility-feature {
          background: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        [data-theme="dark"] .facility-feature:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        }

        [data-theme="dark"] .facility-stats .stat-item {
          background: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        [data-theme="dark"] .facility-stats .stat-item:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
        }

        .features-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
        }

        .features-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        [data-theme="dark"] .features-section {
          background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
        }

        [data-theme="dark"] .features-section::before {
          background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
        }

        .feature-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        [data-theme="dark"] .feature-card {
          background: #1a1a1a;
          border: 1px solid #262626;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #10b981);
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .feature-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-description {
            font-size: 1.1rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
          
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-btn-primary,
          .hero-btn-secondary {
            width: 100%;
            max-width: 300px;
          }
          
          .hero-visual {
            height: 400px;
            margin-top: 2rem;
          }
          
          .hero-image-container {
            width: 300px;
            height: 350px;
          }
          
          .floating-card {
            padding: 1rem;
            font-size: 0.875rem;
          }
          
          .card-1 {
            top: 5%;
            left: 5%;
          }
          
          .card-2 {
            top: 70%;
            right: 5%;
          }
          
          .card-3 {
            bottom: 10%;
            left: 10%;
          }
          
          .feature-card {
            padding: 2rem 1.5rem;
          }

          .facility-image {
            height: 300px;
          }

          .facility-stats {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }

          .facility-features {
            gap: 1rem;
          }

          .facility-feature {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-description {
            font-size: 1rem;
          }
          
          .hero-badge {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
          
          .hero-visual {
            height: 300px;
          }
          
          .hero-image-container {
            width: 250px;
            height: 300px;
          }
          
          .floating-card {
            padding: 0.75rem;
            font-size: 0.75rem;
          }
          
          .card-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .facility-image {
            height: 280px;
          }

          .facility-content {
            padding: 1rem 0;
          }

          .image-overlay-content {
            padding: 1.25rem;
          }

          .image-overlay-content h4 {
            font-size: 1.1rem;
          }

          .image-overlay-content p {
            font-size: 0.85rem;
          }

          .facility-feature {
            padding: 1rem;
          }

          .facility-feature .feature-icon {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
          }

          .facility-stats .stat-item {
            padding: 1rem;
            min-width: 100px;
          }

          .facility-stats .stat-number {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
