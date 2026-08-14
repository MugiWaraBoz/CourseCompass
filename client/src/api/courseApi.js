// This file contains the request used to load courses from the backend server.
import { api } from "@/api/client";

export async function getCourses(params = {}) {
  try {
    // Ask the backend for all available courses and return only its data.
    const response = await api.get("/courses", {
      params: { page: 1, limit: 60, sortBy: "code", order: "asc", ...params },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to load courses:", error);
    throw error;
  }
}

export async function getCourseById(courseId) {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load course details:", error);
    throw error;
  }
}