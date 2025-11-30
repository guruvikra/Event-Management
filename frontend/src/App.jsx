import React, { useEffect, useState } from 'react';
import { useUserStore } from './store/userStore.js';
import { useEventStore } from './store/eventStore.js';
import Header from './components/layout/Header.jsx';
import CreateEventForm from './components/events/CreateEventForm.jsx';
import EventsList from './components/events/EventsList.jsx';
import './App.css';

function App() {
  const { users, selectedUser, fetchUsers } = useUserStore();
  const { events, fetchUserEvents } = useEventStore();
  const [currentTimezone, setCurrentTimezone] = useState('Eastern Time (ET)');

  // Load users on app start
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Load events when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserEvents(selectedUser._id, currentTimezone);
    }
  }, [selectedUser, fetchUserEvents, currentTimezone]);

  const handleEventCreated = () => {
    // Refresh events after creating a new one
    if (selectedUser) {
      fetchUserEvents(selectedUser._id, currentTimezone);
    }
  };

  const handleEventUpdated = () => {
    // Refresh events after updating
    if (selectedUser) {
      fetchUserEvents(selectedUser._id, currentTimezone);
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="content-container">
          <div className="content-grid">
            <div className="left-column">
              <CreateEventForm 
                onEventCreated={handleEventCreated} 
                currentUser={selectedUser}
              />
            </div>
            
            <div className="right-column">
              <EventsList 
                events={events}
                loading={false}
                onEventUpdated={handleEventUpdated}
                selectedUser={selectedUser}
                currentTimezone={currentTimezone}
                onTimezoneChange={setCurrentTimezone}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;