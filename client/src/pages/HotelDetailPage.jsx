import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHotelDetails, addToFavorites, removeFromFavorites } from '../services/hotelService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/HotelDetailPage.css';

const HotelDetailPage = () => {
  const { id } = useParams();
  const { user, refreshUserData } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Fetch hotel details on component mount
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const { hotel } = await getHotelDetails(id);
        setHotel(hotel);
        
        // Make sure images array exists before accessing first element
        if (hotel && hotel.images && hotel.images.length > 0) {
          setMainImage(hotel.images[0]);
        } else if (hotel && hotel.image) {
          // Fallback to single image property if available
          setMainImage(hotel.image);
        } else {
          // Default fallback image
          setMainImage('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60');
        }
        
        // Check if hotel is in user's favorites
        if (user && user.favorites) {
          setIsFavorite(user.favorites.some(favoriteId => favoriteId === hotel._id));
        }
      } catch (error) {
        setError('Failed to load hotel details. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchHotelDetails();
    }
  }, [id, user]);
  
  // Handle changing the main image
  const handleImageChange = (image) => {
    setMainImage(image);
  };
  
  // Handle adding/removing from favorites
  const handleFavoriteToggle = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFromFavorites(hotel._id);
      } else {
        await addToFavorites(hotel._id);
      }
      
      // Toggle favorite state
      setIsFavorite(!isFavorite);
      
      // Refresh user data in context
      await refreshUserData();
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };
  
  // Handle room selection
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading hotel details...</p>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/hotels" className="back-button">Back to Hotels</Link>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!hotel) {
    return null;
  }
  
  return (
    <>
      <Header />
      <div className="hotel-detail-container">
        <div className="hotel-detail-header">
          <div className="hotel-detail-header-content">
            <div className="hotel-detail-title">
              <h1>{hotel.name}</h1>
              <div className="hotel-detail-rating">
                <span className="hotel-rating-value">{hotel.rating}</span>
                <span className="hotel-rating-text">
                  {hotel.rating >= 4.5 ? 'Exceptional' : 
                   hotel.rating >= 4 ? 'Excellent' : 
                   hotel.rating >= 3.5 ? 'Very Good' : 
                   hotel.rating >= 3 ? 'Good' : 'Average'}
                </span>
                <span className="hotel-review-count">({hotel.numReviews} reviews)</span>
              </div>
            </div>
            <button 
              className={`favorite-button ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
          <p className="hotel-detail-location">{hotel.location}</p>
        </div>
        
        <div className="hotel-detail-gallery">
          <div className="main-image-container">
            <img src={mainImage} alt={hotel.name} className="main-image" />
          </div>
          
          <div className="thumbnail-container">
            {hotel?.images ? hotel.images.map((image, index) => (
              <div 
                key={index} 
                className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                onClick={() => handleImageChange(image)}
              >
                <img src={image} alt={`${hotel.name} - View ${index + 1}`} />
              </div>
            )) : <div className="no-thumbnails">No additional images available</div>}
          </div>
        </div>
        
        <div className="hotel-detail-content">
          <div className="hotel-detail-info">
            <div className="hotel-detail-description">
              <h2>About {hotel.name}</h2>
              <p>{hotel.description}</p>
            </div>
            
            <div className="hotel-detail-amenities">
              <h2>Amenities</h2>
              <div className="amenities-list">
                {hotel.amenities.map((amenity, index) => (
                  <div className="amenity-item" key={index}>
                    <span className="amenity-name">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hotel-detail-address">
              <h2>Location</h2>
              <p>
                {hotel.address.street}, {hotel.address.city}, {hotel.address.state}<br />
                {hotel.address.country}, {hotel.address.zipCode}
              </p>
            </div>
          </div>
          
          <div className="hotel-detail-booking">
            <h2>Select a Room</h2>
            
            <div className="room-list">
              {hotel.roomTypes.map((room, index) => (
                <div 
                  key={index} 
                  className={`room-option ${selectedRoom === room ? 'selected' : ''}`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="room-option-header">
                    <h3>{room.name}</h3>
                    <span className="room-price">${room.price} <span className="per-night">per night</span></span>
                  </div>
                  
                  <p className="room-description">{room.description}</p>
                  
                  <div className="room-details">
                    <div className="room-detail">
                      <span className="detail-label">Capacity:</span>
                      <span className="detail-value">{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    
                    <div className="room-detail">
                      <span className="detail-label">Availability:</span>
                      <span className={`detail-value ${room.available ? 'available' : 'unavailable'}`}>
                        {room.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="room-selection">
                    <input 
                      type="radio" 
                      name="roomSelection" 
                      id={`room-${index}`}
                      checked={selectedRoom === room}
                      onChange={() => handleRoomSelect(room)}
                    />
                    <label htmlFor={`room-${index}`}>Select</label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="booking-action">
              <Link 
                to={selectedRoom ? `/booking/${hotel._id}?roomType=${encodeURIComponent(selectedRoom.name)}` : '#'}
                className={`book-now-button ${!selectedRoom ? 'disabled' : ''}`}
                onClick={(e) => !selectedRoom && e.preventDefault()}
              >
                {selectedRoom ? 'Continue to Booking' : 'Select a Room to Book'}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HotelDetailPage;
