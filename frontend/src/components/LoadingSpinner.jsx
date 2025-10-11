import React from "react";
import { Spinner } from "react-bootstrap";

export default function LoadingSpinner({ size = "md", variant = "primary", text = "Loading..." }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-content">
        <Spinner 
          animation="border" 
          size={size} 
          variant={variant}
          className="loading-spinner"
        />
        {text && <p className="loading-text">{text}</p>}
      </div>
      
      <style jsx>{`
        .loading-spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          padding: 2rem;
        }
        
        .loading-content {
          text-align: center;
        }
        
        .loading-spinner {
          margin-bottom: 1rem;
        }
        
        .loading-text {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
