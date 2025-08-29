import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedHotels } from '../services/hotelService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/DealsPage.css';

const DealsPage = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showDealModal, setShowDealModal] = useState(false);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedHotels();
        setDeals(data.hotels);
      } catch (err) {
        setError('Failed to load deals. Please try again later.');
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * (discountPercentage / 100));
  };
  
  // Handle view deal click
  const handleViewDeal = (hotel, discount, discountedPrice) => {
    setSelectedDeal({
      ...hotel,
      discount,
      discountedPrice
    });
    setShowDealModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowDealModal(false);
  };
  
  // Book now handler
  const handleBookNow = (hotelId) => {
    navigate(`/booking/${hotelId}`);
  };
  
  // View details handler
  const handleViewDetails = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <>
      <Header />
      <div className="deals-container">
        <div className="deals-hero">
          <div className="deals-hero-content">
            <h1>Limited Time Offers</h1>
            <p>Exclusive deals and special discounts on luxury stays</p>
          </div>
        </div>

        <div className="deals-content">
          <h2 className="deals-section-title">Hot Deals</h2>
          
          {loading ? (
            <div className="deals-loading">
              <div className="loader"></div>
              <p>Finding the best deals for you...</p>
            </div>
          ) : error ? (
            <div className="deals-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : deals.length === 0 ? (
            <div className="no-deals">
              <p>No deals available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="deals-grid">
              {deals.map((hotel) => {
                // Generate random discount between 10% and 30%
                const discount = Math.floor(Math.random() * 21) + 10;
                const discountedPrice = calculateDiscountedPrice(hotel.price, discount);
                
                return (
                  <div key={hotel._id} className="deal-card">
                    <div className="deal-badge">{discount}% OFF</div>
                    <div className="deal-image">
                      <img src={hotel?.images?.[0] || hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'} alt={hotel.name} />
                    </div>
                    <div className="deal-content">
                      <h3>{hotel.name}</h3>
                      <div className="deal-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{hotel.location}</span>
                      </div>
                      <div className="deal-rating">
                        {Array(Math.round(hotel.rating))
                          .fill()
                          .map((_, i) => (
                            <span key={i} className="star">★</span>
                          ))}
                        <span className="rating-number">({hotel.rating})</span>
                      </div>
                      <div className="deal-pricing">
                        <span className="original-price">${hotel.price}</span>
                        <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                      </div>
                      <p className="deal-description">
                        {hotel.description.substring(0, 100)}...
                      </p>
                      <div className="deal-timer">
                        <i className="fas fa-clock"></i>
                        <span>Limited time offer!</span>
                      </div>
                      <button 
                        className="view-deal-btn"
                        onClick={() => handleViewDeal(hotel, discount, discountedPrice.toFixed(2))}
                      >
                        View Deal
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="deals-newsletter">
          <div className="newsletter-content">
            <h2>Get Exclusive Deals</h2>
            <p>Subscribe to our newsletter and never miss a special offer!</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Deal Details Modal */}
      {showDealModal && selectedDeal && (
        <div className="deal-modal-overlay" onClick={closeModal}>
          <div className="deal-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            
            <div className="deal-modal-content">
              <div className="deal-modal-image">
                <img src={selectedDeal.images[0]} alt={selectedDeal.name} />
                <div className="deal-modal-badge">{selectedDeal.discount}% OFF</div>
              </div>
              
              <div className="deal-modal-details">
                <h2>{selectedDeal.name}</h2>
                
                <div className="deal-modal-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{selectedDeal.location}</span>
                </div>
                
                <div className="deal-modal-rating">
                  {Array(Math.round(selectedDeal.rating))
                    .fill()
                    .map((_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                  <span className="rating-number">({selectedDeal.rating})</span>
                </div>
                
                <div className="deal-modal-features">
                  <div className="feature">
                    <i className="fas fa-bed"></i>
                    <span>Luxury Rooms</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-wifi"></i>
                    <span>Free WiFi</span>
                  </div>
                  <div className="feature">
                    <i className="fas fa-utensils"></i>
                    <span>Restaurant</span>
                  </div>
                </div>
                
                <div className="deal-modal-description">
                  <p>{selectedDeal.description}</p>
                </div>
                
                <div className="deal-modal-pricing">
                  <div className="price-details">
                    <div className="original">
                      <span className="label">Original Price</span>
                      <span className="price">${selectedDeal.price}</span>
                    </div>
                    <div className="savings">
                      <span className="label">You Save</span>
                      <span className="price">${(selectedDeal.price - selectedDeal.discountedPrice).toFixed(2)}</span>
                    </div>
                    <div className="discounted">
                      <span className="label">Deal Price</span>
                      <span className="price">${selectedDeal.discountedPrice}</span>
                    </div>
                  </div>
                  
                  <div className="deal-expiration">
                    <i className="fas fa-clock"></i>
                    <span>Offer expires in 48 hours</span>
                  </div>
                </div>
                
                <div className="deal-modal-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(selectedDeal._id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="book-now-btn"
                    onClick={() => handleBookNow(selectedDeal._id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default DealsPage;
