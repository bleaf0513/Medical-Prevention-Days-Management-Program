import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaArrowRight } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="var(--primary)" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="var(--primary)" />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="var(--primary)" />
        </svg>
      </div>
      
      <Container className="footer-content">
        <Row className="g-5">
          <Col lg={4} md={6}>
            <div className="footer-brand">
              <div className="brand-logo">
                <img 
                  src="/logo.png" 
                  alt="Medical Prevention" 
                  width={120} 
                  height={120}
                  className="footer-logo"
                />
                <div className="brand-text">
                  <h5 className="brand-title">Medical Prevention</h5>
                  <p className="brand-subtitle">Health & Wellness Center</p>
                </div>
              </div>
              <p className="footer-description">
                Your health is our priority. We provide comprehensive medical prevention services 
                to help you maintain optimal wellness and live your best life.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </Col>
          
          <Col lg={2} md={6}>
            <div className="footer-section">
              <h6 className="section-title">Services</h6>
              <ul className="footer-links">
                <li><a href="/booking/centro-antifumo" className="footer-link">Centro Antifumo</a></li>
                <li><a href="/booking/nutrizionista" className="footer-link">Nutrizionista</a></li>
                <li><a href="/booking/screening-epatite-c" className="footer-link">Screening Epatite C</a></li>
                <li><a href="/booking/prevenzione-andrologica" className="footer-link">Prevenzione Andrologica</a></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6}>
            <div className="footer-section">
              <h6 className="section-title">Quick Links</h6>
              <ul className="footer-links">
                <li><a href="/" className="footer-link">Home</a></li>
                <li><a href="/booking" className="footer-link">Book Appointment</a></li>
                <li><a href="/register" className="footer-link">Register</a></li>
                <li><a href="/login" className="footer-link">Login</a></li>
                <li><a href="/my-bookings" className="footer-link">My Bookings</a></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={4} md={6}>
            <div className="footer-section">
              <h6 className="section-title">Contact Information</h6>
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Address</span>
                    <span className="contact-value">Medical Center, Health District<br />123 Wellness Street, Health City</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">info@medicalprevention.com</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="footer-divider"></div>
        
        <Row className="align-items-center footer-bottom">
          <Col md={6}>
            <p className="copyright">
              © {currentYear} Medical Prevention Program. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <span className="made-with">
                Made with <FaHeart className="heart-icon" /> for better health
              </span>
            </div>
          </Col>
        </Row>
      </Container>
      
      <style jsx>{`
        .modern-footer {
          position: relative;
          background: var(--bg-tertiary);
          margin-top: 5rem;
          overflow: hidden;
        }
        
        .footer-wave {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120px;
          z-index: 1;
        }
        
        .footer-wave svg {
          width: 100%;
          height: 100%;
        }
        
        .footer-content {
          position: relative;
          z-index: 2;
          padding: 4rem 0 2rem;
        }
        
        .footer-brand {
          margin-bottom: 2rem;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .footer-logo {
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }
        
        .footer-logo:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.3);
        }
        
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        
        .brand-title {
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        
        .brand-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
          margin: 0;
        }
        
        .footer-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
        }
        
        .social-link {
          width: 40px;
          height: 40px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        
        .footer-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-weight: 600;
          font-size: 1.125rem;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 30px;
          height: 2px;
          background: var(--primary);
          border-radius: 1px;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links li {
          margin-bottom: 0.75rem;
        }
        
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .footer-link:hover {
          color: var(--primary);
          transform: translateX(4px);
        }
        
        .footer-link::before {
          content: '';
          width: 0;
          height: 1px;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        
        .footer-link:hover::before {
          width: 16px;
        }
        
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .contact-icon {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.875rem;
          flex-shrink: 0;
        }
        
        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .contact-label {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }
        
        .contact-value {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.4;
        }
        
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          margin: 3rem 0 2rem;
        }
        
        .footer-bottom {
          padding-top: 1rem;
        }
        
        .copyright {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin: 0;
        }
        
        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          justify-content: flex-end;
        }
        
        .footer-bottom-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        .footer-bottom-link:hover {
          color: var(--primary);
        }
        
        .made-with {
          color: var(--text-muted);
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .heart-icon {
          color: #ef4444;
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Dark mode adjustments */
        [data-theme="dark"] .modern-footer {
          background: #0a0a0a;
        }
        
        [data-theme="dark"] .footer-wave path {
          fill: var(--primary);
          opacity: 0.1;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .footer-content {
            padding: 3rem 0 1.5rem;
          }
          
          .footer-bottom-links {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
            margin-top: 1rem;
          }
          
          .brand-logo {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }
          
          .social-links {
            justify-content: center;
          }
          
          .contact-item {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }
        }
      `}</style>
    </footer>
  );
}
