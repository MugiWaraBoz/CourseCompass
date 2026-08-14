// Frontend requests for the public faculty endpoints.
import { api } from "@/api/client";

// Load a paginated faculty list with optional backend query parameters.
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

// Load the complete public profile for one faculty member by MongoDB ID.
export async function getFacultyById(facultyId) {
  try {
    const response = await api.get(`/faculty/${facultyId}`);

    // This endpoint places the faculty object directly inside `data`.
    return response.data;
  } catch (error) {
    console.error(`Failed to load faculty member ${facultyId}:`, error);
    throw error;
  }
}

// Load public reviews for one faculty member.
// Review submission is intentionally excluded until JWT authentication is added.
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
