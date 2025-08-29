import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/BookingsPage.css';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const location = useLocation();
  
  // Display success message from navigation state (e.g., after successful booking)
  useEffect(() => {
    if (location.state?.success && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear success message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  // Fetch user bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        
        let userBookings = [];
        
        // Try to fetch bookings from API
        try {
          const { bookings } = await getMyBookings();
          userBookings = bookings || [];
        } catch (apiError) {
          console.error('API Error:', apiError);
          // If API fails, try to get bookings from localStorage
          try {
            const storedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
            userBookings = storedBookings;
          } catch (storageError) {
            console.error('Storage Error:', storageError);
            throw new Error('Could not retrieve your bookings. Please try again later.');
          }
        }
        
        setBookings(userBookings);
        
        // Set default active tab based on booking availability
        if (userBookings && userBookings.length > 0) {
          const upcoming = userBookings.filter(b => 
            b.bookingStatus === 'confirmed' && new Date(b.checkInDate) > new Date()
          );
          
          if (upcoming.length > 0) {
            setActiveTab('upcoming');
          } else {
            const current = userBookings.filter(b => 
              b.bookingStatus === 'confirmed' && 
              new Date(b.checkInDate) <= new Date() && 
              new Date(b.checkOutDate) >= new Date()
            );
            
            if (current.length > 0) {
              setActiveTab('current');
            } else {
              setActiveTab('past');
            }
          }
        }
      } catch (error) {
        setError('Failed to load bookings. Please try again later.');
        console.error('Error in fetchBookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setActionLoading(true);
        
        // Try to cancel via API first
        try {
          await cancelBooking(bookingId);
        } catch (apiError) {
          console.error('API Error during cancellation:', apiError);
          // If API fails, update localStorage as fallback
          try {
            const storedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
            const updatedBookings = storedBookings.map(booking => 
              booking._id === bookingId 
                ? { ...booking, bookingStatus: 'cancelled' } 
                : booking
            );
            localStorage.setItem('myBookings', JSON.stringify(updatedBookings));
          } catch (storageError) {
            console.error('Storage Error:', storageError);
            throw new Error('Failed to cancel booking. Please try again later.');
          }
        }
        
        // Update booking status in local state
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, bookingStatus: 'cancelled' } 
            : booking
        ));
        
        // Close details modal if the canceled booking was selected
        if (selectedBooking && selectedBooking._id === bookingId) {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }
        
        setSuccessMessage('Booking cancelled successfully');
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert(error.message || 'Failed to cancel booking. Please try again later.');
      } finally {
        setActionLoading(false);
      }
    }
  };
  
  // Open booking details modal
  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };
  
  // Close booking details modal
  const closeBookingDetails = () => {
    setShowDetailsModal(false);
    // Wait for animation to complete before clearing the selected booking
    setTimeout(() => setSelectedBooking(null), 300);
  };
  
  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Group bookings by status
  const upcomingBookings = bookings.filter(booking => 
    booking.bookingStatus === 'confirmed' && new Date(booking.checkInDate) > new Date()
  );
  
  const currentBookings = bookings.filter(booking => 
    booking.bookingStatus === 'confirmed' && 
    new Date(booking.checkInDate) <= new Date() && 
    new Date(booking.checkOutDate) >= new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.bookingStatus === 'completed' || 
    (booking.bookingStatus === 'confirmed' && new Date(booking.checkOutDate) < new Date())
  );
  
  const cancelledBookings = bookings.filter(booking => 
    booking.bookingStatus === 'cancelled'
  );
  
  // Render booking card function for reusability
  const renderBookingCard = (booking, status) => {
    return (
      <div className="booking-card" key={booking._id}>
        <div className={`booking-status-indicator ${status}`}></div>
        <div className="booking-card-content">
          <div className="booking-hotel-info">
            <div 
              className="booking-hotel-image" 
              style={{ backgroundImage: `url(${booking.hotel?.images?.[0] || booking.hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'})` }}
            />
            <div>
              <h3>{booking.hotel.name}</h3>
              <p className="booking-location">
                <i className="fas fa-map-marker-alt"></i> {booking.hotel.location}
              </p>
            </div>
          </div>
          
          <div className="booking-summary">
            <div className="booking-dates">
              <div className="check-in">
                <div className="date-label">Check-in</div>
                <div className="date-value">{formatDate(booking.checkInDate)}</div>
              </div>
              <div className="date-separator"><i className="fas fa-arrow-right"></i></div>
              <div className="check-out">
                <div className="date-label">Check-out</div>
                <div className="date-value">{formatDate(booking.checkOutDate)}</div>
              </div>
            </div>
            
            <div className="booking-info-row">
              <div className="booking-info-item">
                <span className="info-icon"><i className="fas fa-bed"></i></span>
                <span className="info-text">{booking.roomType}</span>
              </div>
              <div className="booking-info-item">
                <span className="info-icon"><i className="fas fa-user-friends"></i></span>
                <span className="info-text">
                  {booking.guests.adults} {booking.guests.adults === 1 ? 'Adult' : 'Adults'}
                  {booking.guests.children > 0 && `, ${booking.guests.children} ${booking.guests.children === 1 ? 'Child' : 'Children'}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="booking-price-actions">
            <div className="booking-price">
              <span className="price-label">Total</span>
              <span className="price-value">${booking.totalPrice}</span>
            </div>
            
            <div className="booking-actions">
              <button 
                className="details-btn"
                onClick={() => openBookingDetails(booking)}
              >
                View Details
              </button>
              {status === 'upcoming' && (
                <button 
                  className="cancel-booking-btn"
                  onClick={() => handleCancelBooking(booking._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Header />
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>View and manage all your hotel reservations</p>
        </div>
        
        {successMessage && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>{successMessage}</p>
          </div>
        )}
        
        <div className="bookings-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="bookings-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">
                <i className="fas fa-suitcase"></i>
              </div>
              <h2>No bookings yet</h2>
              <p>Start exploring hotels and make your first booking!</p>
              <Link to="/hotels" className="explore-button">Explore Hotels</Link>
            </div>
          ) : (
            <div className="bookings-tabs-container">
              <div className="bookings-tab-header">
                <button 
                  className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming <span className="count-badge">{upcomingBookings.length}</span>
                </button>
                <button 
                  className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
                  onClick={() => setActiveTab('current')}
                >
                  Current <span className="count-badge">{currentBookings.length}</span>
                </button>
                <button 
                  className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                  onClick={() => setActiveTab('past')}
                >
                  Past <span className="count-badge">{pastBookings.length}</span>
                </button>
                <button 
                  className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cancelled')}
                >
                  Cancelled <span className="count-badge">{cancelledBookings.length}</span>
                </button>
              </div>
              
              <div className="booking-tab-content">
                {/* Upcoming Bookings Tab */}
                {activeTab === 'upcoming' && (
                  <div className="booking-section">
                    {upcomingBookings.length === 0 ? (
                      <div className="no-bookings-in-category">
                        <p>You don't have any upcoming bookings.</p>
                        <Link to="/hotels" className="find-hotels-btn">Find Hotels</Link>
                      </div>
                    ) : (
                      <div className="bookings-list">
                        {upcomingBookings.map(booking => renderBookingCard(booking, 'upcoming'))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Current Bookings Tab */}
                {activeTab === 'current' && (
                  <div className="booking-section">
                    {currentBookings.length === 0 ? (
                      <div className="no-bookings-in-category">
                        <p>You don't have any current stays.</p>
                        <Link to="/hotels" className="find-hotels-btn">Find Hotels</Link>
                      </div>
                    ) : (
                      <div className="bookings-list">
                        {currentBookings.map(booking => renderBookingCard(booking, 'current'))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Past Bookings Tab */}
                {activeTab === 'past' && (
                  <div className="booking-section">
                    {pastBookings.length === 0 ? (
                      <div className="no-bookings-in-category">
                        <p>You don't have any past bookings.</p>
                        <Link to="/hotels" className="find-hotels-btn">Find Hotels</Link>
                      </div>
                    ) : (
                      <div className="bookings-list">
                        {pastBookings.map(booking => renderBookingCard(booking, 'past'))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Cancelled Bookings Tab */}
                {activeTab === 'cancelled' && (
                  <div className="booking-section">
                    {cancelledBookings.length === 0 ? (
                      <div className="no-bookings-in-category">
                        <p>You don't have any cancelled bookings.</p>
                      </div>
                    ) : (
                      <div className="bookings-list">
                        {cancelledBookings.map(booking => renderBookingCard(booking, 'cancelled'))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="booking-details-modal">
          <div className="modal-overlay" onClick={closeBookingDetails}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeBookingDetails}>×</button>
            <div className="modal-header">
              <h2>Booking Details</h2>
            </div>
            <div className="modal-body">
              <div className="booking-hotel-card">
                <div 
                  className="booking-hotel-image-large" 
                  style={{ backgroundImage: `url(${selectedBooking.hotel?.images?.[0] || selectedBooking.hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'})` }}
                />
                <div className="booking-hotel-details">
                  <h3>{selectedBooking.hotel.name}</h3>
                  <p className="hotel-location">
                    <i className="fas fa-map-marker-alt"></i> {selectedBooking.hotel.location}
                  </p>
                  <div className="hotel-rating">
                    {Array(Math.round(selectedBooking.hotel.rating || 0))
                      .fill()
                      .map((_, i) => (
                        <span key={i} className="star">★</span>
                      ))}
                    <span className="rating-text">({selectedBooking.hotel.rating})</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-details-section">
                <h4>Reservation Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Booking ID</div>
                    <div className="detail-value">{selectedBooking._id}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Status</div>
                    <div className={`detail-value status-${selectedBooking.bookingStatus}`}>
                      {selectedBooking.bookingStatus.charAt(0).toUpperCase() + selectedBooking.bookingStatus.slice(1)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Check-in Date</div>
                    <div className="detail-value">{formatDate(selectedBooking.checkInDate)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Check-out Date</div>
                    <div className="detail-value">{formatDate(selectedBooking.checkOutDate)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Room Type</div>
                    <div className="detail-value">{selectedBooking.roomType}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Guests</div>
                    <div className="detail-value">
                      {selectedBooking.guests.adults} {selectedBooking.guests.adults === 1 ? 'Adult' : 'Adults'}
                      {selectedBooking.guests.children > 0 && `, ${selectedBooking.guests.children} ${selectedBooking.guests.children === 1 ? 'Child' : 'Children'}`}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedBooking.specialRequests && (
                <div className="booking-details-section">
                  <h4>Special Requests</h4>
                  <p className="special-requests">{selectedBooking.specialRequests}</p>
                </div>
              )}
              
              <div className="booking-details-section">
                <h4>Payment Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Total Amount</div>
                    <div className="detail-value price">${selectedBooking.totalPrice}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Payment Status</div>
                    <div className="detail-value status-confirmed">Paid</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <Link 
                to={`/hotel/${selectedBooking.hotel._id}`} 
                className="view-hotel-details-btn"
              >
                View Hotel Details
              </Link>
              
              {selectedBooking.bookingStatus === 'confirmed' && 
               new Date(selectedBooking.checkInDate) > new Date() && (
                <button 
                  className="cancel-booking-btn"
                  onClick={() => handleCancelBooking(selectedBooking._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default BookingsPage;
