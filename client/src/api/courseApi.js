import axios from "axios";

async function getCourses() {
  try {
    const response = await axios.get("http://localhost:3000/api/courses");
    console.log(response.data);
  } catch (error) {
    console.error("Failed to load courses:", error);
  }
}