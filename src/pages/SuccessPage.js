// src/pages/SuccessPage.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SuccessPage.css";

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, message } = location.state || { type: 'patient', message: 'Success!' };

  useEffect(() => {
    // Auto-redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="success-page-container">
      <div className="success-card">
        <div className="success-icon">
          {type === 'patient' ? '👤' : '📅'}
          <div className="success-checkmark">✓</div>
        </div>
        
        <h1 className="success-title">
          {type === 'patient' ? 'Patient Saved Successfully!' : 'Appointment Saved Successfully!'}
        </h1>
        
        <p className="success-message">{message}</p>
        
        <div className="success-animation">
          <div className="pulse-ring"></div>
          <div className="pulse-ring pulse-ring-delay"></div>
        </div>
        
        <div className="redirect-info">
          <p>Redirecting to dashboard in <span id="countdown">3</span> seconds...</p>
        </div>
        
        <button 
          className="go-home-btn"
          onClick={handleGoHome}
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
}
