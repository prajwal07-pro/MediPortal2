// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PatientNew from "./pages/PatientNew";
import AppointmentNew from "./pages/AppointmentNew";
import SuccessPage from "./pages/SuccessPage";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="doctor-card">
        {/* Doctor Profile Section */}
        <div className="doctor-profile">
          <div className="doctor-image-container">
            <img 
              src="/1517622887538.jpg" 
              alt="Dr. Bharat Chougule" 
              className="doctor-image"
            />
          </div>
          <div className="doctor-details">
            <h1 className="doctor-name">Dr. Bharat Chougule</h1>
            <div className="doctor-info">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span className="info-text">Hindalaga Clinic</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <span className="info-text">+91 99026 86173</span>
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/patient/new")}
          >
            Add New Patient
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate("/appointment/new")}
          >
            New Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient/new" element={<PatientNew />} />
        <Route path="/appointment/new" element={<AppointmentNew />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}
