import React from 'react';
import './EventCard.css';

const EventCard = ({ event, onEdit, onViewLogs }) => {
  const formatProfiles = () => {
    if (!event.profiles || event.profiles.length === 0) {
      return 'No profiles';
    }
    
    // Handle both populated and non-populated profiles
    const profileNames = event.profiles.map(profile => {
      if (typeof profile === 'string') {
        return profile; // If it's just an ID
      }
      return profile.username || profile.name || 'Unknown';
    });
    
    return profileNames.join(', ');
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Invalid date';
    
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatFullDateTime = (dateTime) => {
    if (!dateTime) return 'Unknown';
    
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return 'Invalid time';
    
    try {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid time';
    }
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <div className="event-profiles">
          <span className="profiles-icon">👥</span>
          <span className="profiles-text">{formatProfiles()}</span>
        </div>
      </div>

      <div className="event-times">
        <div className="time-item">
          <span className="time-label">Start:</span>
          <div className="time-details">
            <span className="time-date">{formatDateTime(event.startTime)}</span>
            <span className="time-clock">🕐 {formatTime(event.startTime)}</span>
          </div>
        </div>

        <div className="time-item">
          <span className="time-label">End:</span>
          <div className="time-details">
            <span className="time-date">{formatDateTime(event.endTime)}</span>
            <span className="time-clock">🕐 {formatTime(event.endTime)}</span>
          </div>
        </div>
      </div>

      <div className="event-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Created:</span>
          <span className="metadata-value">
            {event.createdAt ? formatFullDateTime(event.createdAt) : 'Unknown'}
          </span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Updated:</span>
          <span className="metadata-value">
            {event.updatedAt ? formatFullDateTime(event.updatedAt) : 'Unknown'}
          </span>
        </div>
      </div>

      <div className="event-actions">
        <button 
          className="action-btn edit-btn"
          onClick={onEdit}
        >
          <span className="btn-icon">✏️</span>
          Edit
        </button>
        <button 
          className="action-btn logs-btn"
          onClick={onViewLogs}
        >
          <span className="btn-icon">📋</span>
          View Logs
        </button>
      </div>
    </div>
  );
};

export default EventCard;