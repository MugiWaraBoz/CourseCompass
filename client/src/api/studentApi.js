import { api } from "./client";

export const getMe = () => api.get("/students/me");
export const updateMe = (payload) => api.patch("/students/me", payload);
export const getMyReviews = (params = {}) => api.get("/students/me/reviews", { params: { page: 1, limit: 8, ...params } });
