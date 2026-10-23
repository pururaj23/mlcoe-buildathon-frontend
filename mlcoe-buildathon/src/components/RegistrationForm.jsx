import React, { useState } from 'react';
import {
  BRANCH_OPTIONS,
  GENDER_OPTIONS,
  RESIDENCE_OPTIONS,
  YEAR_OPTIONS,
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
  year: '1st Year',
  universityRollNo: '',
  residence: 'DayScholar',
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDeclared, setIsDeclared] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // API Response States
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedVal = name === 'phoneNo' ? value.replace(/[\s-]/g, '') : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: sanitizedVal };
      
      // Clear universityRollNo if switched back to 1st Year
      if (name === 'year' && value === '1st Year') {
        updated.universityRollNo = '';
        setFieldErrors(prevErr => ({ ...prevErr, universityRollNo: '' }));
      }

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

    setServerErrors([]);
    setSuccessMessage("");

    const validationErrors = validateRegistrationForm(formData);
    setFieldErrors(validationErrors);

    const allTouched = Object.keys(formData).reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    // Prepare payload exactly as backend expects
    const payload = {
      name: formData.name.trim(),
      studentNo: formData.studentNo.trim().toUpperCase(),
      email: formData.email.trim().toLowerCase(),
      gender: formData.gender,
      branch: formData.branch,
      year: formData.year,
      phoneNo: formData.phoneNo.trim(),
      residence: formData.residence,
    };

    // Only attach roll number if 2nd Year
    if (formData.year === '2nd Year') {
      payload.universityRollNo = formData.universityRollNo.trim();
    }

    try {
      const response = await fetch('/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json().catch(() => ({}));

      if (response.ok || response.status === 201) {
        setSuccessMessage(data.message || 'Registration Successful! Identity verified.');
        setFormData(INITIAL_FORM_STATE);
        setTouched({});
        setIsDeclared(false);
      } else if (response.status === 400 && data.errors) {
        setServerErrors(data.errors);
      } else if (response.status === 429) {
        setServerErrors([data.error || 'Rate limit exceeded. Please wait 5 minutes before trying again.']);
      } else if (response.status === 409) {
        setServerErrors([data.message || 'A student with this information is already registered.']);
      } else {
        setServerErrors([data.message || `Error Code: ${response.status}. Proxy denied.`]);
      }
    } catch (err) {
      setServerErrors(['Uplink Failed. Please check your network connection.']);
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
        <div className="form-icon">👥</div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="api-banner success">
          {successMessage}
        </div>
      )}

      {/* Error Array Notification */}
      {serverErrors.length > 0 && (
        <div className="api-banner error" style={{ textAlign: 'left' }}>
          <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
            {serverErrors.map((err, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-input ${touched.name && fieldErrors.name ? 'error' : ''}`}
              placeholder="Johnathan Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Student Number</label>
            <input
              type="text"
              name="studentNo"
              className={`form-input ${touched.studentNo && fieldErrors.studentNo ? 'error' : ''}`}
              placeholder="e.g. 25164060 or 2612001"
              value={formData.studentNo}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textTransform: 'uppercase' }}
            />
            {touched.studentNo && fieldErrors.studentNo && <span className="error-text">{fieldErrors.studentNo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">College Email</label>
            <input
              type="email"
              name="email"
              className={`form-input ${touched.email && fieldErrors.email ? 'error' : ''}`}
              placeholder="john25164060@akgec.ac.in"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ textTransform: 'lowercase' }}
            />
            {touched.email && fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
          </div>

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

          <div className="form-group">
            <label className="form-label">Year of Study</label>
            <div className="segmented-control">
              {YEAR_OPTIONS.map((option) => (
                <label key={option} className="segment-label">
                  <input
                    type="radio"
                    name="year"
                    value={option}
                    checked={formData.year === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </div>
            {touched.year && fieldErrors.year && <span className="error-text">{fieldErrors.year}</span>}
          </div>

          {formData.year === '2nd Year' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <label className="form-label">University Roll No</label>
              <input
                type="text"
                name="universityRollNo"
                className={`form-input ${touched.universityRollNo && fieldErrors.universityRollNo ? 'error' : ''}`}
                placeholder="10 to 15 digits"
                value={formData.universityRollNo}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.universityRollNo && fieldErrors.universityRollNo ? (
                <span className="error-text">{fieldErrors.universityRollNo}</span>
              ) : (
                <span className="error-text" style={{ color: 'var(--neon-cyan)' }}>Mandatory for 2nd Year</span>
              )}
            </div>
          )}

          {formData.year === '1st Year' && (
             <div className="form-group">
                {/* Empty spacer block to maintain grid alignment when Roll No is hidden */}
             </div>
          )}

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

          <div className="form-group full-width">
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

          <div className="form-group full-width">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting || !isDeclared}
            >
              {isSubmitting ? 'PROCESSING...' : 'REGISTER NOW →'}
            </button>
            <div className="sys-footer">
              <p>© 2026 MLCOE Buildathon.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}