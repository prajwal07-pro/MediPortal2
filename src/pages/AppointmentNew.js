// src/pages/AppointmentNew.js
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAppointment, isSlotAvailable } from "../services/appointmentService";
import "./AppointmentNew.css";

export default function AppointmentNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  const initialDate = params.get("date") || new Date().toISOString().slice(0, 10);
  const initialName = params.get("patientName") || "";
  const initialPhone = params.get("phone") || "";

  const [form, setForm] = useState({
    date: initialDate,
    time: "",
    patientName: initialName,
    phone: initialPhone,
    reason: "",
    status: "pending",
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Validate required fields
      if (!form.date) {
        setError("Date is required.");
        return;
      }
      if (!form.time) {
        setError("Time is required.");
        return;
      }
      if (!form.patientName.trim()) {
        setError("Patient name is required.");
        return;
      }
      if (!form.reason.trim()) {
        setError("Reason is required.");
        return;
      }

      // Check slot availability
      const free = await isSlotAvailable(form.date, form.time);
      if (!free) {
        setError("This time slot is already taken. Choose a different time.");
        return;
      }

      await createAppointment(form);
      
      // Navigate to success page
      navigate("/success", {
        state: {
          type: 'appointment',
          message: `Appointment for "${form.patientName}" has been scheduled for ${form.date} at ${form.time}.`
        }
      });
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Could not create appointment. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="appointment-new-container">
      <div className="page-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => navigate("/")}
            type="button"
            disabled={saving}
          >
            <span>←</span> Back
          </button>
          <div className="page-title-section">
            <div className="page-icon">📅</div>
            <h1 className="page-title">New Appointment</h1>
          </div>
        </div>
      </div>

      <div className="appointment-new-main">
        <form className="appointment-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="error-alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="date">
                <span>📅</span> Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={onChange}
                className="form-input"
                min={new Date().toISOString().slice(0, 10)}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time">
                <span>🕐</span> Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={form.time}
                onChange={onChange}
                className="form-input"
                min="09:00"
                max="18:00"
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patientName">
                <span>👤</span> Patient Name
              </label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={form.patientName}
                onChange={onChange}
                className="form-input"
                placeholder="Enter patient name"
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                <span>📞</span> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="form-input"
                placeholder="Enter phone number"
                pattern="[0-9+\-\s\(\)]+"
                disabled={saving}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="reason">
                <span>📋</span> Reason for Visit
              </label>
              <textarea
                id="reason"
                name="reason"
                value={form.reason}
                onChange={onChange}
                className="form-textarea"
                placeholder="Describe the reason for the appointment"
                rows="4"
                disabled={saving}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
              disabled={saving}
            >
              <span>×</span> Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner">⟳</span>
                  Creating...
                </>
              ) : (
                <>
                  <span>📅</span> Create Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
