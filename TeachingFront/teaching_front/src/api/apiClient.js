import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://linguashineproject-production.up.railway.app';
console.log('Using API URL:', baseURL);

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: false,  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Simplified error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;