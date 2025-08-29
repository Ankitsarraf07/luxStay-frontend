import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminMessages.css';

const AdminMessagesPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/v1/admin/messages', {
          withCredentials: true
        });
        
        if (response.data.success) {
          setMessages(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch messages');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.response?.data?.message || 'Failed to fetch messages. Please try again later.');
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchMessages();
    }
  }, [user]);

  const handleMarkAsRead = async (id, isRead) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/admin/messages/${id}`, {
        isRead: !isRead
      }, {
        withCredentials: true
      });

      // Update messages in state
      if (response.data.success) {
        setMessages(messages.map(message => 
          message._id === id ? {...message, isRead: !isRead} : message
        ));
      } else {
        setError(response.data.message || 'Failed to update message');
      }

      // Update selected message if it's the one being modified
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({...selectedMessage, isRead: !isRead});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/admin/messages/${id}`, {
        withCredentials: true
      });

      // Remove message from state
      if (response.data.success) {
        setMessages(messages.filter(message => message._id !== id));
      } else {
        setError(response.data.message || 'Failed to delete message');
      }
      
      // Clear selected message if it's the one being deleted
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

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
    <div className="admin-messages-page">
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <Link to="/admin" className="back-to-dashboard">
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="messages-container">
        <div className="messages-list">
          <h2>Messages ({messages.length})</h2>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <p className="no-messages">No messages found.</p>
          ) : (
            <div className="message-items">
              {messages.map(message => (
                <div 
                  key={message._id} 
                  className={`message-item ${!message.isRead ? 'unread' : ''} ${selectedMessage && selectedMessage._id === message._id ? 'selected' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="message-header">
                    <span className="message-sender">{message.name}</span>
                    <span className="message-date">{new Date(message.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="message-subject">{message.subject}</div>
                  <div className="message-preview">
                    {message.message.substring(0, 60)}
                    {message.message.length > 60 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="message-detail">
          {selectedMessage ? (
            <div className="selected-message">
              <div className="message-detail-header">
                <h3>{selectedMessage.subject}</h3>
                <div className="message-actions">
                  <button 
                    className={`mark-button ${selectedMessage.isRead ? 'mark-unread' : 'mark-read'}`}
                    onClick={() => handleMarkAsRead(selectedMessage._id, selectedMessage.isRead)}
                  >
                    {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="message-meta">
                <div><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</div>
                <div><strong>Received:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</div>
                <div><strong>Status:</strong> {selectedMessage.isRead ? 'Read' : 'Unread'}</div>
              </div>
              <div className="message-content">
                <p>{selectedMessage.message}</p>
              </div>
              <div className="message-reply">
                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="reply-button">
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="no-message-selected">
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
