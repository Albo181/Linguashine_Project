import axios from 'axios';

// Use relative URL when in production, full URL in development
const baseURL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URL in production to go through our proxy
  : 'http://localhost:8080'; // Development URL

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor to handle CSRF token
apiClient.interceptors.request.use(
  config => {
    // Get CSRF token from cookie if it exists
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    // For POST/PUT/DELETE requests, ensure CSRF token is set
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
      if (!csrfToken) {
        console.warn('No CSRF token found for', config.method.toUpperCase(), 'request');
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Authentication error:', error.response?.data);
      // Clear any stale auth state here if needed
    }
    if (error.response?.status === 403) {
      console.log('CSRF or permission error:', error.response?.data);
      // Maybe try to refresh CSRF token here
    }
    return Promise.reject(error);
  }
);

export default apiClient;
