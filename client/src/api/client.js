import axios from "axios";

// Shared Axios instance used by every frontend API module.
// VITE_API_URL supports deployed backends; localhost is the development fallback.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the saved student session to requests that require authentication.
// Public endpoints continue to work because the backend can ignore this header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("courseCompassToken");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
