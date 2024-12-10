import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('API Client baseURL:', baseURL);

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include CSRF token
apiClient.interceptors.request.use(async (config) => {
  // Only get CSRF token for non-GET requests
  if (config.method !== 'get') {
    try {
      // Get CSRF token from cookie endpoint
      const response = await axios.get(`${baseURL}/users/api/get-csrf-token/`, {
        withCredentials: true
      });
      const csrfToken = response.data.csrfToken;
      config.headers['X-CSRFToken'] = csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }
  return config;
});

export default apiClient;
