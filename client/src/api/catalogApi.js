import { api } from "./client";

export const getCourses = (params = {}) => api.get("/courses", { params: { page: 1, limit: 12, sortBy: "code", order: "asc", ...params } });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const getCourseReviews = (id, params = {}) => api.get(`/courses/${id}/reviews`, { params: { page: 1, limit: 8, sortBy: "recent", order: "desc", ...params } });
export const getFaculties = (params = {}) => api.get("/faculty", { params: { page: 1, limit: 12, sortBy: "name", order: "asc", ...params } });
export const getFaculty = (id) => api.get(`/faculty/${id}`);
export const getFacultyReviews = (id, params = {}) => api.get(`/faculty/${id}/reviews`, { params: { page: 1, limit: 8, sortBy: "recent", order: "desc", ...params } });
