import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile,
  isAuthenticated 
} from '../services/authService';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = isAuthenticated();
        
        if (storedUser) {
          // Verify that the token is still valid by fetching user profile
          const { user } = await getUserProfile();
          setUser(user);
        }
      } catch (error) {
        // If there's an error (like token expired), clear local storage
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await registerUser(userData);
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loginUser(credentials);
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      await logoutUser();
      setUser(null);
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    try {
      setLoading(true);
      
      const { user } = await getUserProfile();
      setUser(user);
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to refresh user data');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshUserData,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
