import { create } from 'zustand';
import { eventService } from '../services/eventService.js';

export const useEventStore = create((set, get) => ({
  // State
  events: [],
  loading: false,
  error: null,
  selectedEvent: null,

  // Actions
  fetchUserEvents: async (userId, timezone = null) => {
    set({ loading: true, error: null });
    try {
      const params = timezone ? { timeZone: timezone } : {};
      const response = await eventService.getUserEvents(userId, params);
      set({ 
        events: response.data || [], 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true, error: null });
    try {
      const response = await eventService.createEvent(eventData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  updateEvent: async (eventId, eventData) => {
    set({ loading: true, error: null });
    try {
      const response = await eventService.updateEvent(eventId, eventData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  setSelectedEvent: (event) => {
    set({ selectedEvent: event });
  },

  clearError: () => {
    set({ error: null });
  },

  // Helper methods
  getEventById: (id) => {
    const events = get().events;
    return events.find(event => event._id === id);
  }
}));