import { api } from "@/api/client";

/**
 * AI API FUNCTIONS (require authentication)
 * 
 * These functions call the backend's AI endpoints which use the student's
 * stored Gemini API key to generate review summaries.
 */

// Helper to create auth headers for requests requiring JWT
function authenticatedConfig(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

// Test if the student's stored Gemini API key is valid
// GET /ai/test
export async function testGeminiApiKey(token) {
  const response = await api.get("/ai/test", authenticatedConfig(token));
  return response.data;
}

// Generate AI summary of reviews for a specific course
// GET /ai/:courseId/reviews/course
export async function getCourseAiSummary(token, courseId) {
  const response = await api.get(
    `/ai/${courseId}/reviews/course`,
    authenticatedConfig(token),
  );
  return response.data;
}

// Generate AI summary of reviews for a specific faculty member
// GET /ai/:facultyId/reviews/faculty
export async function getFacultyAiSummary(token, facultyId) {
  const response = await api.get(
    `/ai/${facultyId}/reviews/faculty`,
    authenticatedConfig(token),
  );
  return response.data;
}