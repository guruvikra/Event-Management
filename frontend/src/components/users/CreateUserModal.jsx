import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore.js';
import './CreateUserModal.css';

const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createUser, error, clearError } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSubmitting(true);
    try {
      await createUser({ username: username.trim() });
      setUsername('');
      onUserCreated?.(); // Call the callback if provided
      onClose();
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Profile</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!username.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;