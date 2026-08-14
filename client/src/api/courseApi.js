// This file contains the request used to load courses from the backend server.
import { api } from "@/api/client";

// Load a paginated course list with optional backend query parameters.
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

// Load one course using its MongoDB ID.
export async function getCourseById(courseId) {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load course details:", error);
    throw error;
  }
}

// Resolve prerequisite IDs in parallel. Successful requests are preserved
// even if one prerequisite request fails.
export async function getCoursesByIds(courseIds = []) {
  const results = await Promise.allSettled(
    courseIds.map((courseId) => getCourseById(courseId)),
  );

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value?.data?.course)
    .filter(Boolean);
}

// Load a paginated review list for one course.
// Reading reviews is public; posting and voting will require authentication later.
export async function getCourseReviews(courseId, params = {}) {
  const response = await api.get(`/courses/${courseId}/reviews`, {
    params: {
      page: 1,
      limit: 5,
      sortBy: "recent",
      order: "desc",
      ...params,
    },
  });

  return response.data;
}
