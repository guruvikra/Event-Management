import { create } from 'zustand';
import { userService } from '../services/userService.js';

export const useUserStore = create((set, get) => ({
  // State
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  // Actions
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await userService.getAllUsers();
      set({ 
        users: response.data || [], 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.createUser(userData);
      const currentUsers = get().users;
      set({ 
        users: [...currentUsers, response.data], 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  updateUserTimezone: async (userId, timezone) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.updateUserTimezone(userId, timezone);
      const currentUsers = get().users;
      const updatedUsers = currentUsers.map(user => 
        user._id === userId ? { ...user, timezone } : user
      );
      set({ 
        users: updatedUsers, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  clearError: () => {
    set({ error: null });
  },

  // Helper getters
  getUserById: (id) => {
    const users = get().users;
    return users.find(user => user._id === id);
  }
}));