import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to access this page.</p>
        <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveSection('messages')}
          >
            Contact Messages
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveSection('hotels')}
          >
            Manage Hotels
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveSection('bookings')}
          >
            Manage Bookings
          </button>
          <button 
            className={`admin-nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            Manage Users
          </button>
        </nav>
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-user">
            <span>Welcome, {user.name}</span>
          </div>
        </div>
        <div className="admin-main">
          {activeSection === 'dashboard' && <AdminDashboardContent />}
          {activeSection === 'messages' && <AdminMessagesContent />}
          {activeSection === 'hotels' && <AdminHotelsContent />}
          {activeSection === 'bookings' && <AdminBookingsContent />}
          {activeSection === 'users' && <AdminUsersContent />}
        </div>
      </div>
    </div>
  );
};

const AdminDashboardContent = () => (
  <div className="dashboard-overview">
    <h2>Dashboard Overview</h2>
    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3>Total Users</h3>
          {/* <p className="count">{stats?.totalUsers || '--'}</p> */}
      </div>
      <div className="dashboard-card">
        <h3>Total Hotels</h3>
        <p className="count">--</p>
      </div>
      <div className="dashboard-card">
        <h3>Total Bookings</h3>
        <p className="count">--</p>
      </div>
      <div className="dashboard-card">
        <h3>New Messages</h3>
        <p className="count">--</p>
      </div>
    </div>
    <div className="dashboard-actions">
      <h3>Quick Actions</h3>
      <div className="action-buttons">
        <Link to="/admin/messages" className="action-button">
          View Messages
        </Link>
        <Link to="/admin/hotels" className="action-button">
          Manage Hotels
        </Link>
        <Link to="/admin/bookings" className="action-button">
          Manage Bookings
        </Link>
        <Link to="/admin/users" className="action-button">
          Manage Users
        </Link>
      </div>
    </div>
  </div>
);

const AdminMessagesContent = () => (
  <div className="admin-section">
    <h2>Contact Messages</h2>
    <p>This section will show all contact messages. Implementation coming soon.</p>
    <Link to="/admin/messages" className="view-all-btn">
      View All Messages
    </Link>
  </div>
);

const AdminHotelsContent = () => (
  <div className="admin-section">
    <h2>Manage Hotels</h2>
    <p>This section will allow you to manage hotel listings. Implementation coming soon.</p>
    <Link to="/admin/hotels" className="view-all-btn">
      Manage All Hotels
    </Link>
  </div>
);

const AdminBookingsContent = () => (
  <div className="admin-section">
    <h2>Manage Bookings</h2>
    <p>This section will allow you to manage customer bookings. Implementation coming soon.</p>
    <Link to="/admin/bookings" className="view-all-btn">
      Manage All Bookings
    </Link>
  </div>
);

const AdminUsersContent = () => (
  <div className="admin-section">
    <h2>Manage Users</h2>
    <p>This section will allow you to manage user accounts. Implementation coming soon.</p>
    <Link to="/admin/users" className="view-all-btn">
      Manage All Users
    </Link>
  </div>
);

export default AdminDashboardPage;
