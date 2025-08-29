import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject ? formData.subject.trim() : 'New message from LuxStay Contact Form',
          message: formData.message.trim()
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError(data.message || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="contact-page">
      <Header />
      
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Our Location</h3>
              <p> 123 Booking Street, muzaffarpur City</p>
              <p> pin code 842001</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>Phone Number</h3>
              <p>+91 (xxxxxxxxxx)</p>
              <p>+91 (xxxxxxxxxx)</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email Address</h3>
              <p>info@luxstay.com</p>
              <p>support@luxstay.com</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Working Hours</h3>
              <p>Monday - Friday: 9AM - 6PM</p>
              <p>Saturday - Sunday: 10AM - 4PM</p>
            </div>
          </div>
          
          <div className="contact-form-container">
            {success ? (
              <div className="success-message">
                <h2>Thank You!</h2>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
                <button 
                  className="send-another-btn"
                  onClick={() => setSuccess(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter message subject"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
