// src/api/apiClient.js
import axios from 'axios';
import config from '../config';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken'
});

export default apiClient;
