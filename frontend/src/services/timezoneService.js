import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

export const timezoneService = {
  // Get all available timezones
  getAllTimezones: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.TIMEZONES.GET_ALL);
      return response;
    } catch (error) {
      console.error('Error fetching timezones:', error);
      throw error;
    }
  },

  // Get timezone by key
  getTimezoneByKey: async (key) => {
    try {
      const response = await api.get(API_ENDPOINTS.TIMEZONES.GET_BY_KEY(key));
      return response;
    } catch (error) {
      console.error('Error fetching timezone by key:', error);
      throw error;
    }
  }
};