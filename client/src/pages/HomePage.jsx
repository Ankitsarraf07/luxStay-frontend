import React from 'react';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import Footer from '../components/Footer';
import { APP_DESCRIPTION } from '../utils/constants';
import BackgroundImage from '../utils/Images/Background.jpg';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      
      <div className="hero-section" style={{ backgroundImage: `url(${BackgroundImage})` }}>
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>{APP_DESCRIPTION}</p>
          <SearchBox />
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2>Why Choose LuxStay</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Best Price Guarantee</h3>
              <p>Find a lower price? We'll match it and give you an additional 10% off.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Booking</h3>
              <p>Your payment and personal information are always protected.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Luxury Selection</h3>
              <p>Handpicked premium accommodations for an unforgettable experience.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>24/7 Support</h3>
              <p>Our customer service team is available around the clock.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="destinations-section">
        <div className="container">
          <h2>Popular Destinations</h2>
          
          <div className="destinations-grid">
            <div className="destination-card">
              <div className="destination-img paris"></div>
              <h3>Paris</h3>
              <p>5,234 properties</p>
            </div>
            
            <div className="destination-card">
              <div className="destination-img new-york"></div>
              <h3>New York</h3>
              <p>3,157 properties</p>
            </div>
            
            <div className="destination-card">
              <div className="destination-img tokyo"></div>
              <h3>Tokyo</h3>
              <p>2,847 properties</p>
            </div>
            
            <div className="destination-card">
              <div className="destination-img rome"></div>
              <h3>Rome</h3>
              <p>4,129 properties</p>
            </div>
            
            <div className="destination-card">
              <div className="destination-img bali"></div>
              <h3>Bali</h3>
              <p>1,985 properties</p>
            </div>
            
            <div className="destination-card">
              <div className="destination-img dubai"></div>
              <h3>Dubai</h3>
              <p>2,634 properties</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
