import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from './DatePicker';
import '../styles/SearchBox.css';

const SearchBox = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // In a real application, this would navigate to search results with query params
    navigate(`/hotels?location=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="search-box">
      <h2>Find your perfect stay</h2>
      <p>Search deals on hotels, homes, and much more...</p>
      
      <form onSubmit={handleSearch}>
        <div className="search-container">
          <div className="search-input">
            <label>Where are you going?</label>
            <input
              type="text"
              placeholder="Enter destination"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="dates-container">
            <DatePicker 
              label="Check-in Date" 
              initialDate={checkIn} 
              onChange={setCheckIn} 
            />
            
            <DatePicker 
              label="Check-out Date" 
              initialDate={checkOut} 
              onChange={setCheckOut}
              minDate={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="guests-input">
            <label>Guests</label>
            <select 
              value={guests} 
              onChange={(e) => setGuests(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
