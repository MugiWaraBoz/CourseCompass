import { api } from "@/api/client";

/**
 * FACULTY API FUNCTIONS (public - no authentication required)
 * 
 * These functions fetch faculty data from the backend.
 * All are public endpoints - no JWT token needed.
 */

// Get paginated list of faculty with optional filters
// GET /faculty
export async function getFaculty(params = {}) {
  try {
    const response = await api.get("/faculty", {
      params: {
        page: 1,
        limit: 9,
        sortBy: "name",
        order: "asc",
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to load faculty:", error);
    throw error;
  }
}

// Get single faculty member by MongoDB ID
// GET /faculty/:facultyId
export async function getFacultyById(facultyId) {
  try {
    const response = await api.get(`/faculty/${facultyId}`);
    // This endpoint returns faculty object directly in response.data
    return response.data;
  } catch (error) {
    console.error(`Failed to load faculty member ${facultyId}:`, error);
    throw error;
  }
}

// Get paginated reviews for a specific faculty member
// GET /faculty/:facultyId/reviews
export async function getFacultyReviews(facultyId, params = {}) {
  try {
    const response = await api.get(`/faculty/${facultyId}/reviews`, {
      params: {
        page: 1,
        limit: 5,
        sortBy: "createdAt",
        order: "desc",
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to load reviews for faculty ${facultyId}:`, error);
    throw error;
  }
}
