import API from './api';

// Get all hotels
export const getAllHotels = async () => {
  try {
    const response = await API.get('/hotels');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get single hotel details
export const getHotelDetails = async (id) => {
  try {
    const response = await API.get(`/hotel/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Search hotels with filters
export const searchHotels = async (searchParams) => {
  try {
    // Convert searchParams object to URL params
    const params = new URLSearchParams();
    
    for (const key in searchParams) {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    }
    
    const response = await API.get(`/hotels/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Add hotel to favorites
export const addToFavorites = async (hotelId) => {
  try {
    const response = await API.post(`/hotel/favorite/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Remove hotel from favorites
export const removeFromFavorites = async (hotelId) => {
  try {
    const response = await API.delete(`/hotel/unfavorite/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get featured hotels
export const getFeaturedHotels = async () => {
  try {
    // Use the search endpoint with a filter for featured hotels
    const response = await API.get('/hotels/search?featured=true');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
