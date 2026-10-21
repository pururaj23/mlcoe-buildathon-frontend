import React from "react";
import RegistrationForm from "./components/RegistrationForm";
import "./styles/App.css";

export default function App() {
  return (
    <div className="app-wrapper">
      
      {/* Top Navbar */}
      <nav className="cyber-navbar">
        {/* Logo on the left */}
        <div className="nav-left">
          <div className="logo-image">
            <img
              src="/mlcoelogo.png"
              alt="MLCOE Logo"
              className="logo"
            />
          </div>
        </div>

        {/* Center Title */}
        <span className="nav-title">MLCOE BUILDATHON 2026</span>

        {/* Contact on the right */}
        <div className="nav-right">
          <a href="#contact-footer" className="nav-contact-btn">
            <span className="bell-icon">🔔</span>
            <span className="contact-text">CONTACT</span>
          </a>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="main-layout">
        <div className="info-panel">
          <div className="brand-header">
            <h4>Presents</h4>
            <h1 className="title-glow">
              BID TO
              <br />
              BUILD
            </h1>
            <p className="subtitle">Where Strategy Meets Creation</p>
          </div>

          <div className="domains-section">
            <h5>DOMAINS</h5>
            
            <div className="domain-card">
              <div className="domain-icon">🎯</div>
              <div className="domain-text">
                <h6>ESTIMATION & PLANNING</h6>
                <p>Estimation & Planning</p>
              </div>
            </div>
            
            <div className="domain-card">
              <div className="domain-icon">📐</div>
              <div className="domain-text">
                <h6>DESIGN & ARCHITECTURE</h6>
                <p>Design & Architecture</p>
              </div>
            </div>
            
            <div className="domain-card">
              <div className="domain-icon">📄</div>
              <div className="domain-text">
                <h6>STRATEGIC BIDDING</h6>
                <p>Strategic Bidding</p>
              </div>
            </div>
          </div>

          <div className="event-details">
            <div className="detail-row">
              <span>📅 DATE:</span> 27TH OCTOBER 2026
            </div>
            <div className="detail-row">
              <span>🕒 TIME:</span> 11:00 AM ONWARDS
            </div>
            <div className="detail-row">
              <span>📍 VENUE:</span> MAIN AUDITORIUM FIRST FLOOR
            </div>
          </div>
        </div>

        <div className="form-panel-wrapper">
          <RegistrationForm />
        </div>
      </div>

      {/* Footer / Contact Info */}
      <footer id="contact-footer" className="cyber-footer">
        <div className="footer-line-accent"></div>
        <div className="footer-content">
          <div className="footer-label">
            EVENT COORDINATORS 
          </div>
          <div className="contacts-grid">
            <div className="contact-card">
              <span className="contact-name">Aman Sir</span>
              <a href="tel:+919026037405" className="contact-number">
                📞 90260 37405
              </a>
            </div>
            <div className="contact-divider">||</div>
            <div className="contact-card">
              <span className="contact-name">Adeed Sir</span>
              <a href="tel:+919889856170" className="contact-number">
                📞 9889856170
              </a>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}