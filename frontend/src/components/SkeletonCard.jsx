import React from "react";

export default function SkeletonCard({ lines = 3, height = "200px" }) {
  return (
    <div className="skeleton-card" style={{ height }}>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        {Array.from({ length: lines }, (_, index) => (
          <div 
            key={index} 
            className={`skeleton-line ${index === lines - 1 ? 'skeleton-last' : ''}`}
          ></div>
        ))}
        <div className="skeleton-button"></div>
      </div>
      
      <style jsx>{`
        .skeleton-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.5rem;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .skeleton-line {
          height: 1rem;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: skeleton-shimmer 1.5s ease-in-out infinite;
        }
        
        .skeleton-title {
          height: 1.5rem;
          width: 60%;
        }
        
        .skeleton-last {
          width: 80%;
        }
        
        .skeleton-button {
          height: 2.5rem;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: 12px;
          animation: skeleton-shimmer 1.5s ease-in-out infinite;
          margin-top: 1rem;
        }
        
        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes skeleton-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        [data-theme="dark"] .skeleton-card {
          background: #1a1a1a;
          border: 1px solid #262626;
        }
        
        [data-theme="dark"] .skeleton-line,
        [data-theme="dark"] .skeleton-button {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}
