// src/config.js

const config = {
  apiBaseUrl: import.meta.env.VITE_BACKEND_URL || 'https://linguashineproject-production.up.railway.app',
  wsBaseUrl: import.meta.env.VITE_WS_URL || 'wss://linguashineproject-production.up.railway.app',
};

export default config;
