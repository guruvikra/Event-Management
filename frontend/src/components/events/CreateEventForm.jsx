import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore.js';
import { useEventStore } from '../../store/eventStore.js';
import { useTimezones } from '../../hooks/useTimezones.js';
import ProfileSelector from './ProfileSelector.jsx';
import DateTimePicker from './DateTimePicker.jsx';
import CreateUserModal from '../users/CreateUserModal.jsx';
import './CreateEventForm.css';

const CreateEventForm = ({ onEventCreated, currentUser }) => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const { users, fetchUsers } = useUserStore();
  const { createEvent, error, clearError } = useEventStore();
  const { timezones } = useTimezones();

  // Set default dates to today and default end time to be after start time
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setEndTime('10:00'); // Set end time to be after start time (09:00)
  }, []);

  // Validation helper - simplified
  const validateDateTime = () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      return { isValid: false, message: 'Please fill in all date and time fields' };
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Only check if end time is after start time
    if (endDateTime <= startDateTime) {
      return { isValid: false, message: 'End time must be after start time' };
    }

    return { isValid: true, message: '' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if current user is selected first
    if (!currentUser) {
      console.log('No current user selected');
      return;
    }
    
    // Basic validation - show errors but don't prevent submission
    if (selectedProfiles.length === 0) {
      console.log('No profiles selected');
      return;
    }
    
    if (!selectedTimezone) {
      console.log('No timezone selected');
      return;
    }

    // Date/time validation - only prevent if there are actual errors
    const validation = validateDateTime();
    if (!validation.isValid) {
      console.log('Date/time validation failed:', validation.message);
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    setIsSubmitting(true);
    clearError();

    try {
      await createEvent({
        profiles: selectedProfiles.map(p => p._id),
        timeZone: selectedTimezone, // This will be the display name like "Eastern Time (ET)"
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        createdBy: currentUser._id
      });

      // Reset form
      setSelectedProfiles([]);
      setSelectedTimezone('');
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setEndDate(today);
      setStartTime('09:00');
      setEndTime('09:00');

      onEventCreated?.();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProfile = () => {
    setShowCreateUserModal(true);
  };

  const handleUserCreated = () => {
    setShowCreateUserModal(false);
    fetchUsers(); // Refresh the users list
  };

  return (
    <div className="create-event-form">
      <h2 className="form-title">Create Event</h2>
      
      <form onSubmit={handleSubmit} className="event-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!currentUser && (
          <div className="error-message">
            ⚠ Please select a current profile from the header dropdown first
          </div>
        )}

        <div className="form-section">
          <label className="form-label">Profiles</label>
          <ProfileSelector
            users={users}
            selectedProfiles={selectedProfiles}
            onSelectionChange={setSelectedProfiles}
            onAddProfile={handleAddProfile}
          />
          {selectedProfiles.length === 0 && (
            <div className="datetime-validation">
              <span className="validation-error">⚠ Please select at least one profile</span>
            </div>
          )}
        </div>

        <div className="form-section">
          <label className="form-label">Timezone</label>
          <select
            className="form-select"
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            required
          >
            <option value="">Select timezone...</option>
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          {!selectedTimezone && (
            <div className="datetime-validation">
              <span className="validation-error">⚠ Please select a timezone</span>
            </div>
          )}
        </div>

        <div className="form-section">
          <label className="form-label">Start Date & Time</label>
          <DateTimePicker
            date={startDate}
            time={startTime}
            onDateChange={setStartDate}
            onTimeChange={setStartTime}
          />
        </div>

        <div className="form-section">
          <label className="form-label">End Date & Time</label>
          <DateTimePicker
            date={endDate}
            time={endTime}
            onDateChange={setEndDate}
            onTimeChange={setEndTime}
          />
          {/* Show validation message for time comparison */}
          <div className="datetime-validation">
            {(() => {
              // Only show validation if we have both start and end times to compare
              if (startDate && startTime && endDate && endTime) {
                const startDateTime = new Date(`${startDate}T${startTime}`);
                const endDateTime = new Date(`${endDate}T${endTime}`);
                
                if (endDateTime <= startDateTime) {
                  return <span className="validation-error">⚠ End time must be after start time</span>;
                } else {
                  return <span className="validation-success">✓ Valid time range</span>;
                }
              }
              return null; // Don't show anything if fields are incomplete
            })()}
          </div>
        </div>

        <button 
          type="submit" 
          className="create-btn"
          disabled={isSubmitting || !currentUser}
        >
          <span className="btn-icon">+</span>
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>

      <CreateUserModal 
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default CreateEventForm;