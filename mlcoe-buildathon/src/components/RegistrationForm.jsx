import React, { useState } from 'react';
import {
  BRANCH_OPTIONS,
  GENDER_OPTIONS,
  RESIDENCE_OPTIONS,
  validateField,
  validateRegistrationForm,
} from '../utils/validation';
import '../styles/RegistrationForm.css';

const INITIAL_FORM_STATE = {
  name: '',
  studentNo: '',
  email: '',
  phoneNo: '',
  gender: 'Male',
  branch: 'CSE',
  residence: 'DayScholar',
  unstopId: '',
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Frontend-only state for UI compliance
  const [isDeclared, setIsDeclared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState({ type: null, msg: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedVal = name === 'phoneNo' ? value.replace(/[\s-]/g, '') : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: sanitizedVal };
      if (touched[name]) {
        setFieldErrors(prevErr => ({ ...prevErr, [name]: validateField(name, sanitizedVal, updated) }));
      }
      return updated;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value, formData) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDeclared) return;

    const validationErrors = validateRegistrationForm(formData);
    setFieldErrors(validationErrors);

    const allTouched = Object.keys(formData).reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setApiResponse({ type: null, msg: null });

    const payload = {
      name: formData.name.trim(),
      studentNo: formData.studentNo.trim(),
      email: formData.email.trim().toLowerCase(),
      gender: formData.gender,
      branch: formData.branch,
      phoneNo: formData.phoneNo.trim(),
      residence: formData.residence,
      unstopId: formData.unstopId.trim(),
    };

    try {
      const response = await fetch('/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 201) {
        setApiResponse({ type: 'success', msg: 'Registration Successful! Identity verified.' });
        setFormData(INITIAL_FORM_STATE);
        setTouched({});
        setIsDeclared(false);
      } else {
        setApiResponse({ type: 'error', msg: data.message || `Error Code: ${response.status}. Proxy denied.` });
      }
    } catch (err) {
      setApiResponse({ type: 'error', msg: 'Uplink Failed. Check network connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-form-container">
      <div className="form-header">
        <div>
          <h2>BID TO BUILD<br/>REGISTRATION</h2>
          <p>Register your team to strategize, bid, and construct.</p>
        </div>
      </div>

      {apiResponse.msg && (
        <div className={`api-banner ${apiResponse.type}`}>
          {apiResponse.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-input ${touched.name && fieldErrors.name ? 'error' : ''}`}
              placeholder="Suryansh Singh"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
          </div>

          {/* Student Number */}
          <div className="form-group">
            <label className="form-label">Student Number</label>
            <input
              type="text"
              name="studentNo"
              className={`form-input ${touched.studentNo && fieldErrors.studentNo ? 'error' : ''}`}
              placeholder="25164040"
              value={formData.studentNo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.studentNo && fieldErrors.studentNo && <span className="error-text">{fieldErrors.studentNo}</span>}
          </div>

          {/* Unstop ID (Replaced 'Roll Number' to maintain backend exact fields) */}
          <div className="form-group">
            <label className="form-label">Unstop ID</label>
            <input
              type="text"
              name="unstopId"
              className={`form-input ${touched.unstopId && fieldErrors.unstopId ? 'error' : ''}`}
              placeholder="username_unstop"
              value={formData.unstopId}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.unstopId && fieldErrors.unstopId && <span className="error-text">{fieldErrors.unstopId}</span>}
          </div>

          {/* College Email */}
          <div className="form-group">
            <label className="form-label">College Email</label>
            <input
              type="email"
              name="email"
              className={`form-input ${touched.email && fieldErrors.email ? 'error' : ''}`}
              placeholder="akash25164040@akgec.ac.in"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phoneNo"
              maxLength="10"
              className={`form-input ${touched.phoneNo && fieldErrors.phoneNo ? 'error' : ''}`}
              placeholder="+91 98765 43210"
              value={formData.phoneNo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.phoneNo && fieldErrors.phoneNo && <span className="error-text">{fieldErrors.phoneNo}</span>}
          </div>

          {/* Segmented Gender Control */}
          <div className="form-group">
            <label className="form-label">Gender</label>
            <div className="segmented-control">
              {GENDER_OPTIONS.map((option) => (
                <label key={option} className="segment-label">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </div>
            {touched.gender && fieldErrors.gender && <span className="error-text">{fieldErrors.gender}</span>}
          </div>

          {/* Branch Dropdown */}
          <div className="form-group">
            <label className="form-label">Branch</label>
            <select
              name="branch"
              className={`form-select ${touched.branch && fieldErrors.branch ? 'error' : ''}`}
              value={formData.branch}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {BRANCH_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {touched.branch && fieldErrors.branch && <span className="error-text">{fieldErrors.branch}</span>}
          </div>

          {/* Segmented Residence Control */}
          <div className="form-group">
            <label className="form-label">Residence</label>
            <div className="segmented-control">
              {RESIDENCE_OPTIONS.map((option) => (
                <label key={option} className="segment-label">
                  <input
                    type="radio"
                    name="residence"
                    value={option}
                    checked={formData.residence === option}
                    onChange={handleChange}
                  />
                  {option === 'DayScholar' ? 'Day Scholar' : 'Hostler'}
                </label>
              ))}
            </div>
            {touched.residence && fieldErrors.residence && <span className="error-text">{fieldErrors.residence}</span>}
          </div>

          {/* Declaration Checkbox */}
          <div className="form-group full-width">
            <label className="declaration-group">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={isDeclared}
                onChange={(e) => setIsDeclared(e.target.checked)}
              />
              <span className="declaration-text">
                I hereby declare that all the information provided is true to my knowledge and agree to abide by the rules and regulations of MLCOE.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-group full-width">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting || !isDeclared}
            >
              {isSubmitting ? 'PROCESSING...' : 'REGISTER NOW →'}
            </button>
            <div className="sys-footer">
              SYSTEM READY | INITIATING PROXY (SECURITY: ENCRYPTED)
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}