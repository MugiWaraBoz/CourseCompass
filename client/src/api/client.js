import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("courseCompassToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || fallback;
}

export function isEmptyResponse(error) {
  return error?.response?.status === 404 && error?.response?.data?.error?.code === "NOT_FOUND";
}
