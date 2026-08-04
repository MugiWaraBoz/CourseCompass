import { api } from "./client";

export const createReview = (payload) => api.post("/reviews", payload);
export const updateReview = (id, payload) => api.patch(`/reviews/${id}`, payload);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const voteReview = (id, voteType) => api.post(`/reviews/${id}/vote`, { voteType });
