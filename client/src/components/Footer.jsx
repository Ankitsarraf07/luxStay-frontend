import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS, COPYRIGHT_TEXT } from '../utils/constants';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About LuxStay</h3>
          <p>Discover the perfect accommodation for your next adventure with LuxStay. We offer the best selection of hotels, resorts, and vacation rentals worldwide.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@luxstay.com</p>
          <p>Phone: +91(xxxxxxxx)</p>
          <p>Address: 123 Booking Street, muzaffarpur City, pin code 842001</p>
        </div>
        
        <div className="footer-section">
          <h3>Subscribe</h3>
          <p>Subscribe to our newsletter for the latest deals and offers.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">{COPYRIGHT_TEXT}</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
