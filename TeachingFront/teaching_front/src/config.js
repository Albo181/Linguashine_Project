// src/config.js

const config = {
  // In production, use relative URLs since we have proxy middleware
  apiBaseUrl: import.meta.env.VITE_BACKEND_URL || '',
  wsBaseUrl: import.meta.env.VITE_WS_URL || 'wss://linguashineproject-production.up.railway.app',
};

export default config;
