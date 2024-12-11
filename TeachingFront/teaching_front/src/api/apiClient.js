import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://linguashineproject-production.up.railway.app';
console.log('Using API URL:', baseURL); // Debug log

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfToken = null;

// Add a request interceptor to include CSRF token
apiClient.interceptors.request.use(async (config) => {
  if (!csrfToken) {
    try {
      // Get CSRF token from cookie endpoint
      const response = await axios.get(`${baseURL}/users/api/get-csrf-token/`, {
        withCredentials: true
      });
      csrfToken = response.data.csrfToken;
      console.log('Got CSRF token:', csrfToken); // Debug log
    } catch (error) {
      console.error('Error getting CSRF token:', error); // Debug log
    }
  }
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
});

// Add a response interceptor to handle 403/401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data); // Debug log
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Clear token and try to get a new one
      csrfToken = null;
      try {
        const response = await axios.get(`${baseURL}/users/api/get-csrf-token/`, {
          withCredentials: true
        });
        csrfToken = response.data.csrfToken;
        // Retry the original request
        const config = error.config;
        config.headers['X-CSRFToken'] = csrfToken;
        return axios(config);
      } catch (retryError) {
        console.error('Error refreshing CSRF token:', retryError); // Debug log
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;