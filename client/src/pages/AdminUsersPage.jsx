import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminUsers.css';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/users', {
          withCredentials: true
        });
        
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleEditRole = (user) => {
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleSaveRole = async () => {
    try {
      await axios.put(`/api/v1/admin/user/${editingUser._id}`, {
        role: newRole
      }, {
        withCredentials: true
      });

      // Update users in state
      setUsers(users.map(u => 
        u._id === editingUser._id ? {...u, role: newRole} : u
      ));
      
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/admin/user/${userId}`, {
        withCredentials: true
      });

      // Remove user from state
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
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
    <div className="admin-users-page">
      <div className="admin-header">
        <h1>Manage Users</h1>
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

      <div className="users-container">
        <div className="users-header">
          <h2>All Users ({users.length})</h2>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <p className="no-users">No users found.</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className={u._id === user._id ? 'current-user' : ''}>
                    <td>{u._id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      {editingUser && editingUser._id === u._id ? (
                        <select value={newRole} onChange={handleRoleChange}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                      )}
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {editingUser && editingUser._id === u._id ? (
                        <div className="edit-actions">
                          <button 
                            className="save-button"
                            onClick={handleSaveRole}
                          >
                            Save
                          </button>
                          <button 
                            className="cancel-button"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="user-actions">
                          {u._id !== user._id && (
                            <>
                              <button 
                                className="edit-button"
                                onClick={() => handleEditRole(u)}
                              >
                                Edit Role
                              </button>
                              <button 
                                className="delete-button"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {u._id === user._id && (
                            <span className="self-tag">Current User</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
