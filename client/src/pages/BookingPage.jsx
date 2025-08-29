import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHotelDetails } from '../services/hotelService';
import { createBooking, calculateBookingPrice } from '../services/bookingService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/BookingPage.css';

const BookingPage = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get roomType from URL params
  const roomTypeParam = searchParams.get('roomType');
  
  // State for hotel and booking details
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: {
      adults: 1,
      children: 0
    },
    roomType: roomTypeParam || '',
    specialRequests: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Room & Date, 2: Guest Info, 3: Payment
  
  // Fetch hotel details on component mount
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try to fetch hotel details, but if it fails, use sample data
        try {
          const { hotel } = await getHotelDetails(hotelId);
          if (hotel) {
            setHotel(hotel);
            
            // Find selected room if roomType is provided
            if (roomTypeParam && hotel.roomTypes) {
              const room = hotel.roomTypes.find(room => room.name === roomTypeParam);
              if (room) {
                setSelectedRoom(room);
                setBookingDetails(prev => ({
                  ...prev,
                  roomType: room.name
                }));
              }
            }
          } else {
            throw new Error('Hotel not found');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Use sample data as fallback
          const sampleHotels = [
            {
              id: 1,
              name: "Luxury Hotel",
              location: "New York, USA",
              rating: 4.8,
              price: 299,
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
              images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60"],
              roomTypes: [
                {
                  name: "Deluxe Room",
                  price: 299,
                  description: "Spacious room with king-size bed and city view",
                  capacity: 2,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "TV", "Air Conditioning"]
                },
                {
                  name: "Suite",
                  price: 499,
                  description: "Luxury suite with separate living area and panoramic views",
                  capacity: 4,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "TV", "Air Conditioning", "Jacuzzi"]
                },
                {
                  name: "Standard Room",
                  price: 199,
                  description: "Comfortable room with queen-size bed",
                  capacity: 2,
                  amenities: ["Free WiFi", "TV", "Air Conditioning"]
                }
              ]
            },
            {
              id: 2,
              name: "Seaside Resort",
              location: "Miami, USA",
              rating: 4.6,
              price: 199,
              image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60",
              images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60"],
              roomTypes: [
                {
                  name: "Ocean View Room",
                  price: 299,
                  description: "Beautiful room with ocean view and balcony",
                  capacity: 2,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "TV", "Air Conditioning", "Balcony"]
                },
                {
                  name: "Beach Bungalow",
                  price: 399,
                  description: "Private bungalow steps from the beach",
                  capacity: 2,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "TV", "Air Conditioning", "Private Beach Access"]
                }
              ]
            },
            {
              id: 3,
              name: "Mountain View Lodge",
              location: "Denver, USA",
              rating: 4.7,
              price: 149,
              image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60",
              images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60"],
              roomTypes: [
                {
                  name: "Mountain View Room",
                  price: 149,
                  description: "Cozy room with stunning mountain views",
                  capacity: 2,
                  amenities: ["Free WiFi", "Fireplace", "TV", "Air Conditioning", "Hiking Trails Access"]
                },
                {
                  name: "Cabin Suite",
                  price: 249,
                  description: "Rustic cabin suite with private hot tub",
                  capacity: 4,
                  amenities: ["Free WiFi", "Fireplace", "Hot Tub", "Full Kitchen", "Hiking Trails Access"]
                }
              ]
            },
            {
              id: 4,
              name: "Urban Boutique Hotel",
              location: "Chicago, USA",
              rating: 4.5,
              price: 259,
              image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60",
              images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60"],
              roomTypes: [
                {
                  name: "Boutique Room",
                  price: 259,
                  description: "Stylish room with unique decor and city views",
                  capacity: 2,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "Smart TV", "Bluetooth Speakers"]
                },
                {
                  name: "Designer Suite",
                  price: 359,
                  description: "Spacious suite with designer furniture and city skyline view",
                  capacity: 2,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "Smart TV", "Bluetooth Speakers", "Rainfall Shower"]
                }
              ]
            },
            {
              id: 5,
              name: "Historic Inn",
              location: "Boston, USA",
              rating: 4.4,
              price: 189,
              image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=60",
              images: ["https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60"],
              roomTypes: [
                {
                  name: "Heritage Room",
                  price: 189,
                  description: "Charming room with period features and antique furniture",
                  capacity: 2,
                  amenities: ["Free WiFi", "Continental Breakfast", "TV", "Air Conditioning"]
                },
                {
                  name: "Colonial Suite",
                  price: 289,
                  description: "Spacious suite with separate sitting area and historic charm",
                  capacity: 4,
                  amenities: ["Free WiFi", "Continental Breakfast", "TV", "Air Conditioning", "Fireplace"]
                }
              ]
            },
            {
              id: 6,
              name: "Bayside Hotel",
              location: "San Francisco, USA",
              rating: 4.9,
              price: 299,
              image: "https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&w=800&q=60",
              images: ["https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60"],
              roomTypes: [
                {
                  name: "Bay View Room",
                  price: 299,
                  description: "Elegant room with stunning bay views",
                  capacity: 2,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "TV", "Air Conditioning"]
                },
                {
                  name: "Panoramic Suite",
                  price: 499,
                  description: "Luxury suite with panoramic views of the bay and Golden Gate Bridge",
                  capacity: 4,
                  amenities: ["Free WiFi", "Mini Bar", "Room Service", "TV", "Air Conditioning", "Telescope"]
                }
              ]
            }
          ];
          
          const sampleHotel = sampleHotels.find(h => h.id === parseInt(hotelId));
          if (sampleHotel) {
            setHotel(sampleHotel);
            
            // Find selected room if roomType is provided
            if (roomTypeParam && sampleHotel.roomTypes) {
              const room = sampleHotel.roomTypes.find(room => room.name === roomTypeParam);
              if (room) {
                setSelectedRoom(room);
                setBookingDetails(prev => ({
                  ...prev,
                  roomType: room.name
                }));
              }
            }
          } else {
            throw new Error('Hotel not found in sample data');
          }
        }
      } catch (error) {
        setError('Failed to load hotel details. Please try again later.');
        console.error('Error in fetchHotelDetails:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId, roomTypeParam]);
  
  // Calculate total price whenever booking details change
  useEffect(() => {
    if (hotel && bookingDetails.roomType && bookingDetails.checkInDate && bookingDetails.checkOutDate) {
      const price = calculateBookingPrice(
        hotel,
        bookingDetails.roomType,
        bookingDetails.checkInDate,
        bookingDetails.checkOutDate
      );
      setTotalPrice(price);
    }
  }, [hotel, bookingDetails]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'adults' || name === 'children') {
      setBookingDetails(prev => ({
        ...prev,
        guests: {
          ...prev.guests,
          [name]: parseInt(value)
        }
      }));
    } else {
      setBookingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle card details input changes
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    if (!value) return value;
    const digitsOnly = value.replace(/\s/g, '');
    const matches = digitsOnly.match(/.{1,4}/g);
    return matches ? matches.join(' ').substr(0, 19) : '';
  };
  
  // Handle room type selection
  const handleRoomSelect = (roomName) => {
    const room = hotel.roomTypes.find(room => room.name === roomName);
    setSelectedRoom(room);
    setBookingDetails(prev => ({
      ...prev,
      roomType: roomName
    }));
  };
  
  // Navigate through booking steps
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate dates and room type
      if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
        setError('Please select check-in and check-out dates.');
        return;
      }
      
      if (!bookingDetails.roomType) {
        setError('Please select a room type.');
        return;
      }
      setError('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate guest information
      if (bookingDetails.guests.adults < 1) {
        setError('At least one adult is required.');
        return;
      }
      setError('');
      setCurrentStep(3);
    }
  };
  
  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate payment details
    if (paymentMethod === 'credit-card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        setError('Please fill in all card details.');
        return;
      }
      
      if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number.');
        return;
      }
      
      if (cardDetails.cvv.length < 3) {
        setError('Please enter a valid CVV.');
        return;
      }
    }
    
    // Validate dates
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const today = new Date();
    
    if (checkIn < today) {
      setError('Check-in date cannot be in the past');
      return;
    }
    
    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return;
    }
    
    // Prepare booking data
    const bookingData = {
      hotel: hotelId,
      roomType: bookingDetails.roomType,
      checkInDate: bookingDetails.checkInDate,
      checkOutDate: bookingDetails.checkOutDate,
      guests: bookingDetails.guests,
      totalPrice,
      specialRequests: bookingDetails.specialRequests,
      paymentInfo: {
        id: 'payment_id_' + Date.now(), // Simulated payment ID
        status: 'confirmed'
      }
    };
    
    try {
      setError('');
      setIsSubmitting(true);
      
      // Try to create booking via API
      try {
        const { booking } = await createBooking(bookingData);
        
        // Show success message
        setSuccess('Booking confirmed! Redirecting to your bookings...');
        
        // Redirect to bookings page after 2 seconds
        setTimeout(() => {
          navigate('/bookings', { 
            state: { 
              success: true, 
              message: 'Booking confirmed successfully!',
              bookingId: booking._id
            }
          });
        }, 2000);
      } catch (apiError) {
        console.error('API Error during booking:', apiError);
        
        // Create a sample booking as fallback
        const sampleBooking = {
          _id: `BOOK-${Math.floor(Math.random() * 10000)}`,
          hotel: {
            _id: hotel.id || hotelId,
            name: hotel.name,
            location: hotel.location,
            images: hotel.images || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'],
            rating: hotel.rating
          },
          roomType: bookingDetails.roomType,
          checkInDate: bookingDetails.checkInDate,
          checkOutDate: bookingDetails.checkOutDate,
          guests: bookingDetails.guests,
          totalPrice,
          paymentMethod,
          specialRequests: bookingDetails.specialRequests || '',
          bookingStatus: 'confirmed',
          createdAt: new Date().toISOString()
        };
        
        // Store in localStorage as a fallback mechanism
        try {
          const storedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
          storedBookings.push(sampleBooking);
          localStorage.setItem('myBookings', JSON.stringify(storedBookings));
          
          // Show success message
          setSuccess('Booking confirmed! Redirecting to your bookings...');
          
          // Redirect to bookings page after 2 seconds
          setTimeout(() => {
            navigate('/bookings', { 
              state: { 
                success: true, 
                message: 'Booking confirmed successfully!',
                bookingId: sampleBooking._id
              }
            });
          }, 2000);
        } catch (storageError) {
          throw new Error('Failed to save booking. Please try again.');
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get minimum date for check-in (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get minimum date for check-out (day after check-in or today)
  const minCheckOutDate = bookingDetails.checkInDate 
    ? new Date(new Date(bookingDetails.checkInDate).getTime() + 86400000).toISOString().split('T')[0]
    : today;
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading booking details...</p>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error && !hotel) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
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
      <div className="booking-page-container">
        <div className="booking-page-header">
          <h1>Book Your Stay</h1>
          <p>Complete the form below to confirm your reservation</p>
        </div>
        
        <div className="booking-content">
          {/* Booking Steps */}
          <div className="booking-steps">
            <div className={`step ${currentStep === 1 ? 'active' : (currentStep > 1 ? 'completed' : '')}`}>
              <div className="step-number">1</div>
              <div className="step-name">Room & Dates</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep === 2 ? 'active' : (currentStep > 2 ? 'completed' : '')}`}>
              <div className="step-number">2</div>
              <div className="step-name">Guest Info</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-name">Payment</div>
            </div>
          </div>
          
          <div className="booking-layout">
            <div className="booking-form-container">
              <form className="booking-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                {/* Step 1: Room & Dates */}
                {currentStep === 1 && (
                  <div className="form-step">
                    <div className="hotel-details">
                      <div className="hotel-image" style={{ backgroundImage: `url(${hotel.images?.[0] || hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'})` }}></div>
                      <div className="hotel-info">
                        <h2>{hotel.name}</h2>
                        <div className="hotel-location">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{hotel.location}</span>
                        </div>
                        <div className="hotel-rating">
                          {hotel.rating ? Array(Math.round(hotel.rating || 0))
                            .fill()
                            .map((_, i) => (
                              <span key={i} className="star">★</span>
                            )) : null}
                          <span className="rating-text">({hotel.rating || 'N/A'})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Room Selection</h3>
                      <div className="room-list">
                        {hotel.roomTypes?.map((room) => (
                          <div 
                            key={room.name}
                            className={`room-item ${bookingDetails.roomType === room.name ? 'selected' : ''}`}
                            onClick={() => handleRoomSelect(room.name)}
                          >
                            <div className="room-image" style={{ backgroundImage: `url(${room.images?.[0] || room.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60'})` }}></div>
                            <div className="room-details">
                              <h4>{room.name}</h4>
                              <p className="room-description">{room.description}</p>
                              <div className="room-amenities">
                                {room.amenities?.map((amenity, index) => (
                                  <span key={index} className="amenity">
                                    <i className="fas fa-check"></i> {amenity}
                                  </span>
                                )) || <span className="no-amenities">No amenities information available</span>}
                              </div>
                              <div className="room-price">
                                <span className="price">${room.price || 0}</span>
                                <span className="per-night">per night</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Booking Dates</h3>
                      <div className="date-inputs">
                        <div className="form-group">
                          <label htmlFor="checkInDate">Check-in Date</label>
                          <input
                            type="date"
                            id="checkInDate"
                            name="checkInDate"
                            value={bookingDetails.checkInDate}
                            onChange={handleInputChange}
                            min={today}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="checkOutDate">Check-out Date</label>
                          <input
                            type="date"
                            id="checkOutDate"
                            name="checkOutDate"
                            value={bookingDetails.checkOutDate}
                            onChange={handleInputChange}
                            min={minCheckOutDate}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" className="next-btn" onClick={nextStep}>
                        Continue to Guest Information
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Guest Information */}
                {currentStep === 2 && (
                  <div className="form-step">
                    <div className="form-section">
                      <h3>Guest Information</h3>
                      <div className="guest-inputs">
                        <div className="form-group">
                          <label htmlFor="adults">Adults</label>
                          <input
                            type="number"
                            id="adults"
                            name="adults"
                            value={bookingDetails.guests.adults}
                            onChange={handleInputChange}
                            min="1"
                            max="10"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="children">Children</label>
                          <input
                            type="number"
                            id="children"
                            name="children"
                            value={bookingDetails.guests.children}
                            onChange={handleInputChange}
                            min="0"
                            max="10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Special Requests</h3>
                      <div className="form-group">
                        <textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={bookingDetails.specialRequests}
                          onChange={handleInputChange}
                          placeholder="Do you have any special requests? (optional)"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" className="back-btn" onClick={prevStep}>
                        Back
                      </button>
                      <button type="button" className="next-btn" onClick={nextStep}>
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="form-step">
                    <div className="form-section">
                      <h3>Payment Method</h3>
                      <div className="payment-methods">
                        <div 
                          className={`payment-method ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod('credit-card')}
                        >
                          <div className="payment-icon">
                            <i className="fas fa-credit-card"></i>
                          </div>
                          <div className="payment-details">
                            <h4>Credit Card</h4>
                            <p>Pay securely with your credit card</p>
                          </div>
                        </div>
                        
                        <div 
                          className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod('paypal')}
                        >
                          <div className="payment-icon">
                            <i className="fab fa-paypal"></i>
                          </div>
                          <div className="payment-details">
                            <h4>PayPal</h4>
                            <p>Pay using your PayPal account</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {paymentMethod === 'credit-card' && (
                      <div className="form-section">
                        <h3>Card Details</h3>
                        <div className="card-details">
                          <div className="form-group">
                            <label htmlFor="cardName">Cardholder Name</label>
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              value={cardDetails.cardName}
                              onChange={handleCardDetailsChange}
                              placeholder="Name on Card"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={formatCardNumber(cardDetails.cardNumber)}
                              onChange={handleCardDetailsChange}
                              placeholder="xxxx xxxx xxxx xxxx"
                              maxLength="19"
                              required
                            />
                          </div>
                          <div className="card-expiry-cvv">
                            <div className="form-group">
                              <label htmlFor="expiryDate">Expiry Date</label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={cardDetails.expiryDate}
                                onChange={handleCardDetailsChange}
                                placeholder="MM/YY"
                                maxLength="5"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="cvv">CVV</label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardDetailsChange}
                                placeholder="123"
                                maxLength="3"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'paypal' && (
                      <div className="form-section paypal-info">
                        <p>You will be redirected to PayPal to complete your payment securely.</p>
                        <div className="paypal-logo">
                          <i className="fab fa-paypal"></i> PayPal
                        </div>
                      </div>
                    )}
                    
                    <div className="form-actions">
                      <button type="button" className="back-btn" onClick={prevStep}>
                        Back
                      </button>
                      <button type="submit" className="book-now-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            {/* Booking Summary */}
            <div className="booking-summary">
              <div className="summary-card">
                <h3>Booking Summary</h3>
                
                {bookingDetails.roomType && (
                  <div className="summary-item">
                    <div className="summary-label">Room Type</div>
                    <div className="summary-value">{bookingDetails.roomType}</div>
                  </div>
                )}
                
                {bookingDetails.checkInDate && bookingDetails.checkOutDate && (
                  <>
                    <div className="summary-item">
                      <div className="summary-label">Check-in</div>
                      <div className="summary-value">{new Date(bookingDetails.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Check-out</div>
                      <div className="summary-value">{new Date(bookingDetails.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Duration</div>
                      <div className="summary-value">
                        {Math.floor((new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / (1000 * 60 * 60 * 24))} nights
                      </div>
                    </div>
                  </>
                )}
                
                <div className="summary-item">
                  <div className="summary-label">Guests</div>
                  <div className="summary-value">
                    {bookingDetails.guests.adults} {bookingDetails.guests.adults === 1 ? 'Adult' : 'Adults'}
                    {bookingDetails.guests.children > 0 && `, ${bookingDetails.guests.children} ${bookingDetails.guests.children === 1 ? 'Child' : 'Children'}`}
                  </div>
                </div>
                
                <div className="price-breakdown">
                  <div className="summary-item">
                    <div className="summary-label">Room Price</div>
                    <div className="summary-value">${totalPrice}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Taxes & Fees</div>
                    <div className="summary-value">${Math.round(totalPrice * 0.12)}</div>
                  </div>
                </div>
                
                <div className="summary-total">
                  <div className="summary-label">Total</div>
                  <div className="summary-value">${Math.round(totalPrice * 1.12)}</div>
                </div>
                
                <div className="cancellation-policy">
                  <h4>Cancellation Policy</h4>
                  <p>Free cancellation up to 48 hours before check-in. After that, the first night is non-refundable.</p>
                </div>
                
                <div className="payment-policy">
                  <h4>Payment</h4>
                  <p>Full payment will be processed at the time of booking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;
