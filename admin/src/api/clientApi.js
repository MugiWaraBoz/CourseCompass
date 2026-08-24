import axios from 'axios';

// Create an Axios instance with the base URL and default headers
const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
clientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// The API checks the account and its current role on every protected request.
// If access is revoked, remove the stale session and return to the login page
// instead of leaving the portal visible with a token that can no longer work.
clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && localStorage.getItem('token')) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '/') {
        window.location.replace('/');
      }
    }

    return Promise.reject(error);
  }
);

export default clientApi;
