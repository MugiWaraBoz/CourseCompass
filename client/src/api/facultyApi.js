import axios from "axios";

async function getFaculty() {
  try {
    const response = await axios.get("http://localhost:3000/api/faculty");
    console.log(response.data);
  } catch (error) {
    console.error("Failed to load courses:", error);
  }
}