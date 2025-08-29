import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';
import { removeFromFavorites } from '../services/hotelService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/FavoritesPage.css';

const FavoritesPage = () => {
  const { user, refreshUserData } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch user favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const { user } = await getUserProfile();
        setFavorites(user.favorites || []);
      } catch (error) {
        setError('Failed to load favorites. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);
  
  // Handle removing a hotel from favorites
  const handleRemoveFavorite = async (hotelId) => {
    try {
      await removeFromFavorites(hotelId);
      
      // Remove from local state
      setFavorites(favorites.filter(hotel => hotel._id !== hotelId));
      
      // Refresh user data in context
      await refreshUserData();
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };
  
  return (
    <>
      <Header />
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorite Hotels</h1>
        </div>
        
        <div className="favorites-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading favorites...</p>
            </div>
          ) : error ? (
            <div className="favorites-error">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="no-favorites">
              <h2>No favorites yet</h2>
              <p>Start exploring hotels and add them to your favorites!</p>
              <Link to="/hotels" className="explore-button">Explore Hotels</Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map(hotel => (
                <div className="favorite-card" key={hotel._id}>
                  <div 
                    className="favorite-image" 
                    style={{ backgroundImage: `url(${hotel?.images?.[0] || hotel?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'})` }}
                  >
                    <button 
                      className="remove-favorite" 
                      onClick={() => handleRemoveFavorite(hotel._id)}
                      aria-label="Remove from favorites"
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  
                  <div className="favorite-details">
                    <h3>{hotel.name}</h3>
                    <p className="favorite-location">{hotel.location}</p>
                    <div className="favorite-rating">
                      <span className="rating-value">{hotel.rating}</span>
                      <span className="rating-text">
                        {hotel.rating >= 4.5 ? 'Exceptional' : 
                         hotel.rating >= 4 ? 'Excellent' : 
                         hotel.rating >= 3.5 ? 'Very Good' : 
                         hotel.rating >= 3 ? 'Good' : 'Average'}
                      </span>
                      <span className="review-count">({hotel.numReviews} reviews)</span>
                    </div>
                    <div className="favorite-price">
                      <span className="price-value">${hotel.price}</span>
                      <span className="price-text">per night</span>
                    </div>
                    <div className="favorite-actions">
                      <Link to={`/hotel/${hotel._id}`} className="view-details">
                        View Details
                      </Link>
                      <Link to={`/booking/${hotel._id}`} className="book-now">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FavoritesPage;
