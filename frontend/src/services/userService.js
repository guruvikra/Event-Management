import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.GET_ALL);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.CREATE, userData);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user timezone
  updateUserTimezone: async (userId, timezone) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.USERS.UPDATE_TIMEZONE(userId), 
        { timezone }
      );
      return response;
    } catch (error) {
      console.error('Error updating user timezone:', error);
      throw error;
    }
  }
};