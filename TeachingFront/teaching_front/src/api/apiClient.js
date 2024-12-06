import axios from 'axios';

// In production, use relative paths to go through our proxy
// In development, use localhost
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://attractive-upliftment-production.up.railway.app'  // Add explicit production URL
  : 'http://localhost:8000';

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

let csrfTokenPromise = null;

// Function to get CSRF token with retries
export const fetchCSRFToken = async (retries = 3) => {
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  csrfTokenPromise = (async () => {
    for (let i = 0; i < retries; i++) {
      try {
        // Make a GET request to Django's CSRF endpoint
        const response = await axios.get(`${baseURL}/users/api/get-csrf-token/`, {
          withCredentials: true
        });
        console.log('CSRF token response:', response.data);
        
        // Get CSRF token from cookie or response
        const csrfToken = response.data.csrfToken || document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          ?.split('=')[1];
        
        if (!csrfToken) {
          console.error(`Attempt ${i + 1}/${retries}: Failed to get CSRF token`);
          if (i === retries - 1) {
            throw new Error('Failed to get CSRF token after multiple attempts');
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        console.log('Successfully retrieved CSRF token');
        return csrfToken;
      } catch (error) {
        console.error(`Attempt ${i + 1}/${retries}: Error fetching CSRF token:`, error);
        if (i === retries - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  })();

  try {
    return await csrfTokenPromise;
  } finally {
    csrfTokenPromise = null;
  }
};

// Add request interceptor to handle CSRF token
apiClient.interceptors.request.use(
  async config => {
    try {
      // Always try to get CSRF token for all requests
      const csrfToken = await fetchCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
        console.log('Added CSRF token to request headers');
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token in interceptor:', error);
    }

    // Log the final request configuration
    console.log('Request config:', config);
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response error:', error);
    if (error.response?.status === 403) {
      console.error('CSRF token validation failed');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
