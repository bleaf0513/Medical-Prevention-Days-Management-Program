import React from "react";

export default function LogoCarousel3D() {
  const images = [
    "/assets/img (1).jpg",
    "/assets/img (2).jpg", 
    "/assets/img (3).jpg",
    "/assets/img (4).jpg",
    "/assets/img (5).jpg",
    "/assets/img (6).jpg",
    "/assets/img (7).jpg",
    "/assets/img (8).jpg",
    "/assets/img (9).jpg",
    "/assets/img (10).jpg",
    "/assets/img (11).jpg",
    "/assets/img (12).jpg"
  ];

  return (
    <div className="marquee-section">
      <div className="marquee-container">
        <div className="marquee-track">
          {images.map((image, index) => (
            <div key={index} className="marquee-item">
              <img src={image} alt={`Medical ${index + 1}`} />
            </div>
          ))}
          {images.map((image, index) => (
            <div key={`duplicate-${index}`} className="marquee-item">
              <img src={image} alt={`Medical ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-section {
          position: relative;
          padding: 80px 0;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        [data-theme="dark"] .marquee-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .marquee-container {
          position: relative;
          width: 100%;
          height: 300px;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .marquee-track {
          display: flex;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          animation: marquee 40s linear infinite;
          transform-style: preserve-3d;
        }

        .marquee-item {
          position: relative;
          width: 250px;
          height: 180px;
          margin: 0 15px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .marquee-item:nth-child(odd) {
          transform: rotateY(25deg) rotateX(10deg);
          animation: float1 8s ease-in-out infinite;
        }

        .marquee-item:nth-child(even) {
          transform: rotateY(-25deg) rotateX(-10deg);
          animation: float2 8s ease-in-out infinite;
        }

        .marquee-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8) contrast(1.1) saturate(1.2);
          transition: all 0.4s ease;
        }

        .marquee-item:hover {
          transform: rotateY(0deg) rotateX(0deg) scale(1.1) translateZ(50px);
          z-index: 10;
          box-shadow: 0 35px 70px rgba(0, 0, 0, 0.25);
        }

        .marquee-item:hover img {
          filter: brightness(1) contrast(1.3) saturate(1.4);
        }

        @keyframes marquee {
          0% {
            transform: translateY(-50%) translateX(0);
          }
          100% {
            transform: translateY(-50%) translateX(-50%);
          }
        }

        @keyframes float1 {
          0%, 100% {
            transform: rotateY(25deg) rotateX(10deg) translateY(0px);
          }
          50% {
            transform: rotateY(25deg) rotateX(10deg) translateY(-15px);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: rotateY(-25deg) rotateX(-10deg) translateY(0px);
          }
          50% {
            transform: rotateY(-25deg) rotateX(-10deg) translateY(15px);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .marquee-container {
            height: 250px;
          }
          
          .marquee-item {
            width: 180px;
            height: 140px;
            margin: 0 10px;
          }
        }

        @media (max-width: 480px) {
          .marquee-container {
            height: 200px;
          }
          
          .marquee-item {
            width: 140px;
            height: 110px;
            margin: 0 8px;
          }
        }
      `}</style>
    </div>
  );
}