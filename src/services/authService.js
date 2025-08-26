import API from './api';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/login', credentials);
    
    // Store user info in localStorage if needed
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await API.get('/logout');
    
    // Clear local storage
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await API.get('/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await API.put('/me/update', userData);
    
    // Update local storage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    const response = await API.put('/password/update', passwordData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

// Check if user is logged in
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
