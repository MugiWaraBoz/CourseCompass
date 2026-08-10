// This file contains the request used to load faculty from the backend server.
import axios from "axios";

export async function getFaculty() {
  try {
    // Ask the backend for all faculty members and return only its data.
    const response = await axios.get("http://localhost:3000/api/faculty");
    return response.data;
  } catch (error) {
    console.error("Failed to load faculty:", error);
    throw error;
  }
}
