import { api } from "@/api/client";

/**
 * COURSE API FUNCTIONS (public - no authentication required)
 * 
 * These functions fetch course data from the backend.
 * All are public endpoints - no JWT token needed.
 */

// Get paginated list of courses with optional filters
// GET /courses
export async function getCourses(params = {}) {
  try {
    const response = await api.get("/courses", {
      params: { page: 1, limit: 60, sortBy: "code", order: "asc", ...params },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to load courses:", error);
    throw error;
  }
}

// Get single course by MongoDB ID
// GET /courses/:courseId
export async function getCourseById(courseId) {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load course details:", error);
    throw error;
  }
}

// Fetch multiple courses by IDs in parallel (for prerequisites)
// Uses Promise.allSettled so one failure doesn't break all results
export async function getCoursesByIds(courseIds = []) {
  const results = await Promise.allSettled(
    courseIds.map((courseId) => getCourseById(courseId)),
  );

  // Keep only successful results and extract course data
  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value?.data?.course)
    .filter(Boolean);
}

// Get paginated reviews for a specific course
// GET /courses/:courseId/reviews
export async function getCourseReviews(courseId, params = {}) {
  const response = await api.get(`/courses/${courseId}/reviews`, {
    params: {
      sortBy: "recent",
      order: "desc",
      ...params,
    },
  });
  return response.data;
}
