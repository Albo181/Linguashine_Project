import axios from 'axios';

const baseURL = 'https://linguashineproject-production.up.railway.app';

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
    } catch (error) {
      // Silent fail in production
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
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

