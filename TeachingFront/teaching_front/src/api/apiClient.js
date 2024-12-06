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

// Function to get CSRF token
export const fetchCSRFToken = async () => {
  try {
    // Make a GET request to Django's CSRF endpoint
    await apiClient.get('/users/csrf/');
    
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (!csrfToken) {
      console.error('Failed to get CSRF token from cookies after fetch');
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
          csrfToken = await fetchCSRFToken();
        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
        }
      }

      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
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
