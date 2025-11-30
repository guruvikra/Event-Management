import React, { useState, useEffect } from 'react';
import { useTimezones } from '../../hooks/useTimezones.js';
import { useEventStore } from '../../store/eventStore.js';
import EventCard from './EventCard.jsx';
import EditEventModal from './EditEventModal.jsx';
import EventLogsModal from './EventLogsModal.jsx';
import './EventsList.css';

const EventsList = ({ events, loading, onEventUpdated, selectedUser, currentTimezone, onTimezoneChange }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogs, setViewingLogs] = useState(null);
  
  const { timezones } = useTimezones();

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleViewLogs = (event) => {
    setViewingLogs(event);
  };

  const handleEventUpdated = () => {
    setEditingEvent(null);
    onEventUpdated?.();
  };

  if (loading) {
    return (
      <div className="events-list">
        <div className="events-header">
          <h2 className="events-title">Events</h2>
        </div>
        <div className="loading-state">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="events-list">
      <div className="events-header">
        <h2 className="events-title">Events</h2>
        
        <div className="timezone-selector">
          <label className="timezone-label">View in Timezone</label>
          <select
            className="timezone-select"
            value={currentTimezone}
            onChange={(e) => onTimezoneChange?.(e.target.value)}
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="events-content">
        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📅</div>
            <div className="no-events-text">No events found</div>
            {!selectedUser && (
              <div className="no-events-hint">Select a user to view their events</div>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={() => handleEditEvent(event)}
                onViewLogs={() => handleViewLogs(event)}
              />
            ))}
          </div>
        )}
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          isOpen={true}
          onClose={() => setEditingEvent(null)}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {viewingLogs && (
        <EventLogsModal
          event={viewingLogs}
          isOpen={true}
          onClose={() => setViewingLogs(null)}
        />
      )}
    </div>
  );
};

export default EventsList;