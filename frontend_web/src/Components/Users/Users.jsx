import React, { useState, useEffect, useCallback } from 'react';
import './users.css';
import api from '../../services/api';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Attempt to strip potential non-numeric characters before parsing
  const cleanedString = String(dateString).replace(/[^0-9T:.\-Z\s]/g, '');
  const date = new Date(cleanedString);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // New states for confirmation and alerts (replacing alert/confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' }); // {text: 'Success', type: 'success'}

  // 🟢 REFACTORED: Use api.get
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/users.php');
      const data = response.data;
      
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // Handle cases where API is successful but returns no users or failure message
        setUsers([]);
        setError(data.message || 'Failed to retrieve user list.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ❌ REPLACED: Handles triggering the confirmation modal
  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };
  
  // 🟢 NEW: Executes the delete after confirmation
  const confirmDelete = async (id) => {
    setConfirmDeleteId(null); // Close confirmation modal
    try {
      // 🟢 REFACTORED: Use api.post
      const response = await api.post('/delete_user.php', { id });
      const data = response.data;

      if (data.success) {
        fetchUsers();
        setMessage({ text: data.message || "User deleted successfully!", type: 'success' });
      } else {
        setMessage({ text: data.message || "Failed to delete user.", type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || "Network error: Failed to delete user.", type: 'error' });
    }
  };


  // 🟢 REFACTORED: Use api.post
  const handleSaveUser = async (user, isEdit = false) => {
    const endpoint = isEdit ? '/update_user.php' : '/add_user.php';
    
    try {
      const response = await api.post(endpoint, user);
      const data = response.data;
      
      if (data.success) {
        fetchUsers();
        setShowAddModal(false);
        setEditingUser(null);
        setMessage({ text: data.message || `User ${isEdit ? 'updated' : 'added'} successfully!`, type: 'success' });
      } else {
        setMessage({ text: data.message || "Failed to save user.", type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || "Network error: Failed to save user.", type: 'error' });
    }
  };

  // Render loading/error
  if (isLoading) return <div className="users-container">Loading users...</div>;
  if (error && users.length === 0) return <div className="users-container error-message">Error: {error}</div>;

  return (
    <div className="users-container">
      <h2 className="table-title">User Management ({users.length} total)</h2>
      <div className='table-actions'>
        <button className='add-btn' onClick={() => setShowAddModal(true)}>Add User ➕</button>
        <button className='refresh-btn' onClick={fetchUsers} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh Data 🔄'}
        </button>
      </div>

      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Last Login</th>
              <th>Last Logout</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{formatDate(u.created_at)}</td>
                <td>{formatDate(u.updated_at)}</td>
                <td>{formatDate(u.last_logged_in)}</td>
                <td>{formatDate(u.last_logged_out)}</td>
              <td className="action-cell">
                <button className="action-btn edit-btn" onClick={() => setEditingUser(u)}>✏️ Edit</button>
                {/* ❌ REPLACED: Calls local handleDelete function */}
                <button className="action-btn delete-btn" onClick={() => handleDelete(u.id)}>🗑️ Delete</button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALS --- */}

      {/* Message/Alert Modal (replaces alert) */}
      {message.text && (
          <MessageModal
              message={message.text}
              type={message.type}
              onClose={() => setMessage({ text: '', type: '' })}
          />
      )}

      {/* Confirmation Modal (replaces window.confirm) */}
      {confirmDeleteId && (
          <ConfirmDeleteModal
              userId={confirmDeleteId}
              onConfirm={confirmDelete}
              onCancel={() => setConfirmDeleteId(null)}
          />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <UserModal
          title="Add User"
          onClose={() => setShowAddModal(false)}
          onSave={(user) => handleSaveUser(user, false)}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <UserModal
          title="Edit User"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(user) => handleSaveUser(user, true)}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------
// HELPER MODAL COMPONENTS
// ----------------------------------------------------

// Modal Component for Add/Edit
const UserModal = ({ title, user = {}, onClose, onSave }) => {
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState(''); // Local validation message

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationMessage('');

    if (!username || !email || (!user.id && !password)) {
      setValidationMessage("Username, Email, and Password (for new user) are required.");
      return;
    }
    
    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setValidationMessage("Please enter a valid email address.");
        return;
    }

    const payload = { id: user.id, username, email };
    if (password) payload.password = password;
    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal user-modal">
        <h3>{title}</h3>
        {validationMessage && <p className="modal-error">{validationMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            aria-label="Username"
          />

          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            aria-label="Email"
          />

          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder={user.id ? "Leave blank to keep current" : "Required for new user"} 
            aria-label="Password"
            required={!user.id}
          />

          <div className="modal-buttons">
            <button type="submit" className="save-btn">Save 💾</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel ❌</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Component for Delete Confirmation (Replaces window.confirm)
const ConfirmDeleteModal = ({ userId, onConfirm, onCancel }) => (
    <div className="modal-overlay">
        <div className="modal confirm-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to permanently delete User ID: <strong>{userId}</strong>?</p>
            <div className="modal-buttons">
                <button className="confirm-btn delete-btn" onClick={() => onConfirm(userId)}>Yes, Delete</button>
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    </div>
);

// Modal Component for Alerts (Replaces window.alert)
const MessageModal = ({ message, type, onClose }) => {
    const icon = type === 'success' ? '✅' : '🚨';
    const title = type === 'success' ? 'Success' : 'Error';

    return (
        <div className="modal-overlay">
            <div className={`modal message-modal ${type}`}>
                <h3>{icon} {title}</h3>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="ok-btn" onClick={onClose}>OK</button>
                </div>
            </div>
        </div>
    );
};

export default Users;