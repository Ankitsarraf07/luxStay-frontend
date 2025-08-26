import axios from 'axios';

// Create an instance of axios with a base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token if available
API.interceptors.request.use(
  (config) => {
    // You can add logic here if needed, such as adding tokens from localStorage
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response issues
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.log('Unauthorized access. Please login.');
      // You could add redirection here if needed
    }
    return Promise.reject(error);
  }
);

export default API;
