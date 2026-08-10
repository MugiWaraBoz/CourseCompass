// This file contains the request used to load courses from the backend server.
import axios from "axios";

export async function getCourses(params = {}) {
  try {
    // Ask the backend for all available courses and return only its data.
    const response = await axios.get("http://localhost:3000/api/courses", {
      params: { page: 1, limit: 60, sortBy: "code", order: "asc", ...params },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to load courses:", error);
    throw error;
  }
}
