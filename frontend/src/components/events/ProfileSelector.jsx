import React, { useState } from 'react';
import './ProfileSelector.css';

const ProfileSelector = ({ users, selectedProfiles, onSelectionChange, onAddProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (user) => {
    const isSelected = selectedProfiles.some(p => p._id === user._id);
    
    if (isSelected) {
      onSelectionChange(selectedProfiles.filter(p => p._id !== user._id));
    } else {
      onSelectionChange([...selectedProfiles, user]);
    }
  };

  const getDisplayText = () => {
    if (selectedProfiles.length === 0) {
      return 'Select profiles...';
    }
    if (selectedProfiles.length === 1) {
      return selectedProfiles[0].username;
    }
    return `${selectedProfiles.length} profiles selected`;
  };

  return (
    <div className="profile-selector">
      <div 
        className="selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selector-text">{getDisplayText()}</span>
        <span className="selector-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="selector-dropdown">
          {selectedProfiles.length > 0 && (
            <div className="selected-profiles">
              {selectedProfiles.map(profile => (
                <div key={profile._id} className="selected-profile-chip">
                  <span className="profile-check">✓</span>
                  <span className="profile-name">{profile.username}</span>
                </div>
              ))}
            </div>
          )}

          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="users-list">
            {filteredUsers.map(user => {
              const isSelected = selectedProfiles.some(p => p._id === user._id);
              return (
                <div
                  key={user._id}
                  className={`user-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleUserToggle(user)}
                >
                  <div className="user-checkbox">
                    {isSelected && <span className="checkmark">✓</span>}
                  </div>
                  <span className="user-name">{user.username}</span>
                </div>
              );
            })}
            
            {filteredUsers.length === 0 && (
              <div className="no-users">No users found</div>
            )}
          </div>

          <div className="add-profile-section">
            <button 
              type="button"
              className="add-profile-btn"
              onClick={() => {
                setIsOpen(false); // Close the dropdown
                onAddProfile?.(); // Trigger the add profile function
              }}
            >
              <span className="add-icon">+</span>
              Add Profile
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="selector-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileSelector;