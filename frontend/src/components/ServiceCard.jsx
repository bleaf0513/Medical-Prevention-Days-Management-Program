import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaArrowRight, FaStethoscope, FaHeartbeat, FaShieldAlt, FaUserMd } from "react-icons/fa";

const serviceIcons = {
  "Centro Antifumo": FaStethoscope,
  "Nutrizionista": FaHeartbeat,
  "Screening Epatite C": FaShieldAlt,
  "Prevenzione Andrologica": FaUserMd,
};

const serviceColors = {
  "Centro Antifumo": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "Nutrizionista": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "Screening Epatite C": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "Prevenzione Andrologica": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
};

export default function ServiceCard({ title, description, actionText = "Book Now", onAction }) {
  const IconComponent = serviceIcons[title] || FaStethoscope;
  const cardGradient = serviceColors[title] || serviceColors["Centro Antifumo"];

  return (
    <div className="service-card-wrapper">
      <Card className="h-100 service-card">
        <div className="service-card-header" style={{ background: cardGradient }}>
          <div className="service-icon-container">
            <IconComponent size={32} className="service-icon" />
          </div>
        </div>
        <Card.Body className="d-flex flex-column text-center p-4">
          <Card.Title className="h5 mb-3 fw-bold text-primary">
            {title}
          </Card.Title>
          <Card.Text className="text-muted mb-4 flex-grow-1">
            {description || "Professional medical services for your health and wellness needs."}
          </Card.Text>
          <Button 
            variant="primary" 
            onClick={onAction}
            className="mt-auto service-btn d-flex align-items-center justify-content-center gap-2"
            style={{ background: cardGradient, border: 'none' }}
          >
            {actionText}
            <FaArrowRight size={14} />
          </Button>
        </Card.Body>
      </Card>
      
      <style jsx>{`
        .service-card-wrapper {
          position: relative;
          height: 100%;
        }
        
        .service-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
          height: 100%;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .service-card-header {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .service-card-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(10px);
        }
        
        .service-icon-container {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }
        
        .service-icon {
          color: white;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        .service-btn {
          border-radius: 12px;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .service-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        
        .service-btn:hover::before {
          left: 100%;
        }
        
        .service-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        /* Dark mode adjustments */
        [data-theme="dark"] .service-card {
          background: #1a1a1a;
          border: 1px solid #262626;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        
        [data-theme="dark"] .service-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        
        /* Animation for card entrance */
        .service-card-wrapper {
          animation: fadeInUp 0.6s ease-out;
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
        
        /* Staggered animation delays */
        .service-card-wrapper:nth-child(1) { animation-delay: 0.1s; }
        .service-card-wrapper:nth-child(2) { animation-delay: 0.2s; }
        .service-card-wrapper:nth-child(3) { animation-delay: 0.3s; }
        .service-card-wrapper:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}
