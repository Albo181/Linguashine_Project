import axios from 'axios';

// Always use the production URL when running locally
const baseURL = 'https://linguashineproject-production.up.railway.app';

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
        
        const csrfToken = response.data.csrfToken;
        
        if (!csrfToken) {
          console.error(`Attempt ${i + 1}/${retries}: No CSRF token in response`);
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
      // Don't modify headers if it's a multipart/form-data request
      if (config.headers['Content-Type'] === 'multipart/form-data') {
        const token = await fetchCSRFToken();
        config.headers['X-CSRFToken'] = token;
        return config;
      }

      // For other requests, proceed with default JSON content type
      const token = await fetchCSRFToken();
      config.headers['X-CSRFToken'] = token;
      config.headers['Content-Type'] = 'application/json';
      return config;
    } catch (error) {
      console.error('Failed to fetch CSRF token in interceptor:', error);
    }

    // Log the final request configuration
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
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
    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export default apiClient;
