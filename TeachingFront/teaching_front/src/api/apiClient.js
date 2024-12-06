import axios from 'axios';

// In production, use relative paths to go through our proxy
// In development, use localhost
const baseURL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative paths to go through our proxy
  : 'http://localhost:8080';

console.log('API Client baseURL:', baseURL);

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Function to get CSRF token
export const fetchCSRFToken = async () => {
  try {
    // Make a GET request to Django's CSRF endpoint
    const response = await apiClient.get('/users/api/get-csrf-token/');
    console.log('CSRF token response:', response.data);
    
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (!csrfToken) {
      console.error('Failed to get CSRF token from cookies after fetch');
    } else {
      console.log('Successfully retrieved CSRF token');
    }
    
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Add request interceptor to handle CSRF token
apiClient.interceptors.request.use(
  async config => {
    // For POST/PUT/DELETE requests, ensure CSRF token is set
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
      // Get existing CSRF token
      let csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      // If no token exists, try to fetch it
      if (!csrfToken) {
        try {
          console.log('No CSRF token found, fetching new one...');
          csrfToken = await fetchCSRFToken();
        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
        }
      }

      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
        console.log('Added CSRF token to request headers');
      } else {
        console.error('No CSRF token available for', config.method.toUpperCase(), 'request');
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
      console.error('Authentication error:', error.response?.data);
    }
    if (error.response?.status === 403) {
      console.error('CSRF or permission error:', error.response?.data);
      // Try to fetch a new CSRF token on 403 errors
      fetchCSRFToken().catch(err => 
        console.error('Failed to refresh CSRF token:', err)
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
