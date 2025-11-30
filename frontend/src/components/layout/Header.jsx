import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore.js';
import CreateUserModal from '../users/CreateUserModal.jsx';
import './Header.css';

const Header = () => {
  const { users, selectedUser, setSelectedUser } = useUserStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    const user = users.find(u => u._id === userId);
    setSelectedUser(user);
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Event Management</h1>
          <p className="header-subtitle">Create and manage events across multiple timezones</p>
        </div>
        
        <div className="header-right">
          <div className="user-selector">
            <label htmlFor="user-select" className="user-selector-label">
              Select current profile
            </label>
            <div className="user-selector-wrapper">
              <select 
                id="user-select"
                className="user-select"
                value={selectedUser?._id || ''}
                onChange={handleUserSelect}
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <button 
                className="add-user-btn"
                onClick={handleCreateUser}
                title="Add new profile"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </header>
  );
};

export default Header;