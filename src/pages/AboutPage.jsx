import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <>
      <Header />
      <div className="about-page-container">
        <div className="about-header glass-effect">
          <h1>About LuxStay Hotels</h1>
          <p>Luxury accommodations for memorable experiences</p>
        </div>
        
        <div className="about-content">
          <section className="about-section glass-effect">
            <h2>Our Story</h2>
            <div className="about-section-content">
              <div className="about-text">
                <p>Founded in 2010, LuxStay Hotels began with a simple vision: to create a hotel experience that combines luxury, comfort, and authentic local experiences. What started as a single boutique hotel in Manhattan has grown into a collection of premium properties across the globe.</p>
                <p>Our journey has been driven by a passion for hospitality and a commitment to excellence. We believe that a great hotel stay is more than just a comfortable bed – it's about creating memories that last a lifetime.</p>
              </div>
              <div className="about-image story-image"></div>
            </div>
          </section>
          
          <section className="about-section glass-effect">
            <h2>Our Philosophy</h2>
            <div className="about-section-content reverse">
              <div className="about-image philosophy-image"></div>
              <div className="about-text">
                <p>At LuxStay, we're guided by three core principles:</p>
                <ul>
                  <li><strong>Exceptional Service</strong> - We go above and beyond to anticipate and fulfill our guests' needs.</li>
                  <li><strong>Authentic Experiences</strong> - Each of our properties offers a genuine connection to its location and culture.</li>
                  <li><strong>Sustainability</strong> - We're committed to responsible tourism and minimizing our environmental footprint.</li>
                </ul>
                <p>We believe that luxury doesn't have to come at the expense of sustainability, and we're continuously working to implement eco-friendly practices across all our properties.</p>
              </div>
            </div>
          </section>
          
          <section className="about-section glass-effect">
            <h2>Our Commitment</h2>
            <div className="about-section-content">
              <div className="about-text">
                <p>When you stay at a LuxStay hotel, you can expect:</p>
                <ul>
                  <li>Thoughtfully designed spaces that blend comfort with local character</li>
                  <li>Personalized service from staff who care about making your stay special</li>
                  <li>Curated experiences that connect you with the destination</li>
                  <li>Sustainable practices that respect both the local community and the environment</li>
                </ul>
                <p>Whether you're traveling for business, celebrating a special occasion, or simply exploring a new destination, we're dedicated to making your stay with us exceptional.</p>
              </div>
              <div className="about-image commitment-image"></div>
            </div>
          </section>
          
          <section className="team-section glass-effect">
            <h2>Our Leadership Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-image ceo-image"></div>
                <h3>Sarah Johnson</h3>
                <p className="member-title">Chief Executive Officer</p>
                <p>With over 20 years of experience in luxury hospitality, Sarah leads our global operations with vision and passion.</p>
              </div>
              
              <div className="team-member">
                <div className="member-image coo-image"></div>
                <h3>Michael Chen</h3>
                <p className="member-title">Chief Operations Officer</p>
                <p>Michael ensures that every LuxStay property maintains our high standards of service and quality.</p>
              </div>
              
              <div className="team-member">
                <div className="member-image design-image"></div>
                <h3>Emma Rodriguez</h3>
                <p className="member-title">Head of Design</p>
                <p>Emma's innovative approach to hotel design creates spaces that are both beautiful and functional.</p>
              </div>
              
              <div className="team-member">
                <div className="member-image experience-image"></div>
                <h3>James Park</h3>
                <p className="member-title">Guest Experience Director</p>
                <p>James works tirelessly to ensure every guest has a memorable and personalized experience.</p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="cta-section glass-effect">
          <h2>Experience LuxStay For Yourself</h2>
          <p>Discover the perfect blend of luxury, comfort, and authentic experiences at our hotels worldwide.</p>
          <button className="cta-button">Book Your Stay</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
