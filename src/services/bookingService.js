import API from './api';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await API.post('/booking/new', bookingData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get single booking details
export const getBookingDetails = async (id) => {
  try {
    const response = await API.get(`/booking/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get all bookings for the logged-in user
export const getMyBookings = async () => {
  try {
    const response = await API.get('/bookings/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Cancel a booking
export const cancelBooking = async (id) => {
  try {
    const response = await API.put(`/booking/cancel/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Calculate booking price (helper function)
export const calculateBookingPrice = (hotel, roomType, checkInDate, checkOutDate) => {
  if (!hotel || !roomType || !checkInDate || !checkOutDate) {
    return 0;
  }
  
  // Find the selected room type
  const room = hotel.roomTypes.find(room => room.name === roomType);
  
  if (!room) {
    return 0;
  }
  
  // Calculate number of nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  if (nights <= 0) {
    return 0;
  }
  
  // Calculate total price
  return room.price * nights;
};
