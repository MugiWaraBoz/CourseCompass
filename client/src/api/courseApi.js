// This file contains the request used to load courses from the backend server.
import axios from "axios";

export async function getCourses() {
  try {
    // Ask the backend for all available courses and return only its data.
    const response = await axios.get("http://localhost:3000/api/courses");
    return response.data;
  } catch (error) {
    console.error("Failed to load courses:", error);
    throw error;
  }
}
