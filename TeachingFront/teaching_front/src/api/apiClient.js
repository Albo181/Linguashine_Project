import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://linguashineproject-production.up.railway.app';
console.log('Using API URL:', baseURL);

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // For GET requests, we don't need to do anything special
    if (config.method === 'get') {
      return config;
    }

    try {
      // For non-GET requests, ensure we have a CSRF token
      const response = await axios.get(`${baseURL}/users/api/get-csrf-token/`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
      
      if (response.data.csrfToken) {
        config.headers['X-CSRFToken'] = response.data.csrfToken;
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log('Authentication error:', error.response?.status);
      // You might want to redirect to login or handle unauthorized access
    }
    return Promise.reject(error);
  }
);

export default apiClient;