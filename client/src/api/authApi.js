import { api } from "./client";

export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });
export const resetPassword = (token, payload) =>
  api.post(`/auth/reset-password/${token}`, payload);
export const changePassword = (payload) =>
  api.post("/auth/change-password", payload);
