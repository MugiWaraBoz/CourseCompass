import { api } from "@/api/client";

function authenticatedConfig(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

// Ask the backend to validate the student's stored Gemini key.
export async function testGeminiApiKey(token) {
  const response = await api.get("/ai/test", authenticatedConfig(token));
  return response.data;
}

// Generate a course review summary using the student's stored Gemini key.
export async function getCourseAiSummary(token, courseId) {
  const response = await api.get(
    `/ai/${courseId}/reviews/course`,
    authenticatedConfig(token),
  );
  return response.data;
}

// Generate a faculty review summary using the student's stored Gemini key.
export async function getFacultyAiSummary(token, facultyId) {
  const response = await api.get(
    `/ai/${facultyId}/reviews/faculty`,
    authenticatedConfig(token),
  );
  return response.data;
}