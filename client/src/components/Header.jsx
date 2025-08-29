import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS, HOTEL_NAME } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Logo from '../utils/Images/Logo.png';
import '../styles/Header.css';

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            {/* <img src={Logo} alt={HOTEL_NAME} className="logo" /> */}
            <h1 id="hotel-name">{HOTEL_NAME}</h1>
          </Link>
        </div>
        <nav className="navigation">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/bookings">Bookings</Link>
            </li>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <>
              <Link to="/profile" className="profile-link">
                <div className="profile-btn">
                  {user.name ? user.name.split(' ')[0] : 'Profile'}
                </div>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-link">
                  <div className="admin-btn">Admin</div>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
