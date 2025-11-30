import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

export const eventService = {
  // Create new event
  createEvent: async (eventData) => {
    try {
      const response = await api.post(API_ENDPOINTS.EVENTS.CREATE, eventData);
      return response;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Get events for a specific user
  getUserEvents: async (userId, params = {}) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.EVENTS.GET_USER_EVENTS(userId),
        { params }
      );
      return response;
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  },

  // Update existing event
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.EVENTS.UPDATE(eventId),
        eventData
      );
      return response;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }
};