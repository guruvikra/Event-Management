// API Configuration - Easy to switch between local and hosted
const API_CONFIG = {
  // Local development
    LOCAL: 'http://localhost:1111/api/v1',
    
    // Production/Hosted (replace with your hosted URL when ready)
    PRODUCTION: 'https://event-management-ntm3.onrender.com/api/v1',
    
    // Current environment
    CURRENT: 'PRODUCTION' // Change to 'PRODUCTION' when deploying
};

export const API_BASE_URL = API_CONFIG[API_CONFIG.CURRENT];

// API Endpoints
export const API_ENDPOINTS = {
    // Users
    USERS: {
        GET_ALL: '/users',
        CREATE: '/users/create',
        UPDATE_TIMEZONE: (id) => `/users/timezone/${id}`
    },
    
    // Events
    EVENTS: {
        CREATE: '/events/create',
        GET_USER_EVENTS: (id) => `/events/get/${id}`,
        UPDATE: (id) => `/events/update/${id}`
    },
    
    // Timezones
    TIMEZONES: {
        GET_ALL: '/timeZones',
        GET_BY_KEY: (key) => `/timeZones/${key}`
    }
};

// Helper function to switch API environment
export const switchApiEnvironment = (env) => {
    if (env === 'LOCAL' || env === 'PRODUCTION') {
        API_CONFIG.CURRENT = env;
        console.log(`API switched to: ${API_CONFIG[env]}`);
    }
};