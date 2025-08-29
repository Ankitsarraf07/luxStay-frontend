import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile, updatePassword } from '../services/authService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, refreshUserData, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Set initial profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.id]: e.target.value
    });
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value
    });
  };
  
  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setProfileSuccess(false);
    setProfileError('');
    
    try {
      setProfileLoading(true);
      
      await updateProfile(profileData);
      await refreshUserData(); // Refresh user data in context
      
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      setProfileError(error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setPasswordSuccess(false);
    setPasswordError('');
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    
    try {
      setPasswordLoading(true);
      
      await updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset form
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Account Settings</h1>
        </div>
        
        <div className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button 
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
          </div>
          
          <div className="profile-panel">
            {activeTab === 'profile' && (
              <div className="profile-form-container">
                <h2>Edit Profile</h2>
                
                {profileError && <div className="profile-error">{profileError}</div>}
                {profileSuccess && <div className="profile-success">Profile updated successfully!</div>}
                
                <form className="profile-form" onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  
                  <div className="form-action">
                    <button 
                      type="submit" 
                      className="profile-button"
                      disabled={profileLoading}
                    >
                      {profileLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'password' && (
              <div className="profile-form-container">
                <h2>Change Password</h2>
                
                {passwordError && <div className="profile-error">{passwordError}</div>}
                {passwordSuccess && <div className="profile-success">Password updated successfully!</div>}
                
                <form className="profile-form" onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label htmlFor="oldPassword">Current Password</label>
                    <input
                      type="password"
                      id="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="form-action">
                    <button 
                      type="submit" 
                      className="profile-button"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          <div className="logout-container">
            {user && user.role === 'admin' && (
              <Link to="/admin" className="admin-button">
                Admin Panel
              </Link>
            )}
            <button 
              className="logout-button" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
