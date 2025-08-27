// src/pages/PatientNew.js
import React, { useState } from "react";
import { createPatient } from "../services/patientService";
import { useNavigate } from "react-router-dom";
import "./PatientNew.css";

export default function PatientNew() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Validate required fields
      if (!form.name.trim()) {
        setError("Patient name is required.");
        setSaving(false);
        return;
      }
      if (!form.age || Number(form.age) <= 0) {
        setError("Age is required and must be greater than 0.");
        setSaving(false);
        return;
      }
      if (!form.gender) {
        setError("Gender is required.");
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
        age: Number(form.age),
      };

      await createPatient(payload);
      
      // Navigate to success page
      navigate("/success", {
        state: {
          type: 'patient',
          message: `Patient "${form.name}" has been successfully added to the system.`
        }
      });
    } catch (err) {
      console.error(err);
      setError("Could not create patient. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="patient-new-container">
      <div className="back-navigation">
        <button 
          className="back-btn-dashboard"
          onClick={() => navigate("/")}
          type="button"
        >
          <span>←</span> Back to Dashboard
        </button>
      </div>

      <div className="page-header">
        <div className="header-content">
          <div className="page-title-section">
            <div className="page-icon">👤</div>
            <h1 className="page-title">Add New Patient</h1>
          </div>
        </div>
      </div>

      <div className="patient-new-main">
        <form className="patient-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span>👤</span> Patient Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                className="form-input"
                placeholder="Enter patient name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>🎂</span> Age
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={onChange}
                className="form-input"
                placeholder="Enter age"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>⚧</span> Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className="form-input"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>📞</span> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="form-input"
                placeholder="Enter phone number"
                pattern="[0-9+\-\s\(\)]+"
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
                  <span>💾</span> Create Patient
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
