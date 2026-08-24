import axios from "axios";

/**
 * Shared Axios instance used by all frontend API modules.
 * 
 * - baseURL: Reads from VITE_API_URL environment variable, falls back to localhost:3000
 * - headers: Default Content-Type for JSON requests
 * 
 * Axios is used instead of fetch() for:
 *   - Automatic JSON parsing
 *   - Request/response interceptors (for auth headers)
 *   - Better error handling with response.data
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: automatically attaches JWT token to every request.
 * 
 * Reads the token from localStorage and adds it as an Authorization header.
 * This runs before every API call, so components don't need to manually add tokens.
 * Public endpoints still work because the backend ignores the header if not needed.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("courseCompassToken");

  // Only add header if token exists and header isn't already set
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
