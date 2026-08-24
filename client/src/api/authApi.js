import { api } from "@/api/client";

/**
 * AUTHENTICATION API FUNCTIONS
 * 
 * These functions handle all authentication-related API calls.
 * They use the shared Axios instance which automatically attaches the JWT token.
 * For functions requiring manual token (like changePassword), we pass it explicitly.
 */

// Register a new student account
// POST /auth/register
export async function registerStudent(studentData) {
  const response = await api.post("/auth/register", studentData);
  return response.data;
}

// Log in with email and password
// POST /auth/login - returns { token, student }
export async function loginStudent(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

// Verify email using token from verification link
// GET /auth/verify-email/:token
export async function verifyEmail(token) {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
}

// Request password reset link for university email
// POST /auth/forgot-password
export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

// Reset password using token from reset link
// POST /auth/reset-password/:token
export async function resetPassword(token, passwordData) {
  const response = await api.post(`/auth/reset-password/${token}`, passwordData);
  return response.data;
}

// Change password for logged-in student (requires current password)
// PATCH /auth/change-password
export async function changePassword(token, passwordData) {
  const response = await api.patch("/auth/change-password", passwordData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

/**
 * REVIEW API FUNCTIONS (require authentication)
 */

// Create a new review for a course and faculty member
// POST /reviews
export async function createReview(token, reviewData) {
  const response = await api.post("/reviews", reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Get reviews written by the current student
// GET /students/me/reviews
export async function getCurrentStudentReviews(token, params = {}) {
  const response = await api.get("/students/me/reviews", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: 1, limit: 20, ...params },
  });
  return response.data;
}

// Update an existing review (must be the author)
// PATCH /reviews/:reviewId
export async function updateReview(token, reviewId, reviewData) {
  const response = await api.patch(`/reviews/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Delete a review (must be the author)
// DELETE /reviews/:reviewId
export async function deleteReview(token, reviewId) {
  const response = await api.delete(`/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Vote on a review (upvote or downvote)
// POST /reviews/:reviewId/vote
export async function voteReview(token, reviewId, voteType) {
  const response = await api.post(
    `/reviews/${reviewId}/vote`,
    { voteType },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

/**
 * STUDENT PROFILE API FUNCTIONS (require authentication)
 */

// Get current student's profile
// GET /students/me
export async function getCurrentStudent(token) {
  const response = await api.get("/students/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Update current student's profile (name, CGPA, photo URL)
// PATCH /students/me
export async function updateCurrentStudent(token, profileData) {
  const response = await api.patch("/students/me", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Save Gemini API key for AI summaries
// PATCH /students/me/apikey
export async function setGeminiApiKey(token, apiKey) {
  const response = await api.patch(
    "/students/me/apikey",
    { apiKey },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

// Remove stored Gemini API key
// DELETE /students/me/apikey
export async function removeGeminiApiKey(token) {
  const response = await api.delete("/students/me/apikey", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
