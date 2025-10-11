import React from "react";
import { Alert } from "react-bootstrap";
import { FaExclamationTriangle, FaRefresh, FaHome } from "react-icons/fa";

export default function ErrorMessage({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.", 
  onRetry, 
  onGoHome,
  variant = "danger",
  showIcon = true 
}) {
  return (
    <div className="error-message-container">
      <Alert variant={variant} className="error-alert">
        <div className="error-content">
          {showIcon && (
            <div className="error-icon">
              <FaExclamationTriangle />
            </div>
          )}
          
          <div className="error-text">
            <h4 className="error-title">{title}</h4>
            <p className="error-description">{message}</p>
          </div>
        </div>
        
        <div className="error-actions">
          {onRetry && (
            <button 
              className="error-btn error-btn-primary"
              onClick={onRetry}
            >
              <FaRefresh className="me-2" />
              Try Again
            </button>
          )}
          
          {onGoHome && (
            <button 
              className="error-btn error-btn-secondary"
              onClick={onGoHome}
            >
              <FaHome className="me-2" />
              Go Home
            </button>
          )}
        </div>
      </Alert>
      
      <style jsx>{`
        .error-message-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          padding: 2rem;
        }
        
        .error-alert {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        [data-theme="dark"] .error-alert {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        
        .error-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .error-icon {
          width: 50px;
          height: 50px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ef4444;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        
        .error-text {
          flex: 1;
        }
        
        .error-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .error-description {
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }
        
        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .error-btn {
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .error-btn-primary {
          background: #ef4444;
          color: white;
        }
        
        .error-btn-primary:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }
        
        .error-btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        
        .error-btn-secondary:hover {
          background: var(--bg-tertiary);
          transform: translateY(-1px);
        }
        
        @media (max-width: 480px) {
          .error-message-container {
            padding: 1rem;
          }
          
          .error-alert {
            padding: 1.5rem;
          }
          
          .error-content {
            flex-direction: column;
            text-align: center;
          }
          
          .error-actions {
            flex-direction: column;
          }
          
          .error-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
