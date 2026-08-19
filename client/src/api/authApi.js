import { api } from "@/api/client";

// Register a student using the fields accepted by POST /auth/register.
export async function registerStudent(studentData) {
  const response = await api.post("/auth/register", studentData);
  return response.data;
}

// Exchange valid student credentials for profile data and a JWT.
export async function loginStudent(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

// Verify a newly registered student's email using the link token.
export async function verifyEmail(token) {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
}

// Request a short-lived password-reset link for a registered university email.
export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

// Replace a forgotten password using the short-lived token from the reset link.
export async function resetPassword(token, passwordData) {
  const response = await api.post(`/auth/reset-password/${token}`, passwordData);
  return response.data;
}

// Change the password for the currently authenticated student session.
export async function changePassword(token, passwordData) {
  const response = await api.patch("/auth/change-password", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Submit one authenticated review for a selected course and faculty member.
export async function createReview(token, reviewData) {
  const response = await api.post("/reviews", reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Load reviews created by the currently authenticated student.
export async function getCurrentStudentReviews(token, params = {}) {
  const response = await api.get("/students/me/reviews", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page: 1, limit: 20, ...params },
  });

  return response.data;
}

// Update one review owned by the authenticated student.
export async function updateReview(token, reviewId, reviewData) {
  const response = await api.patch(`/reviews/${reviewId}`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Delete one review owned by the authenticated student.
export async function deleteReview(token, reviewId) {
  const response = await api.delete(`/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Toggle or switch the authenticated student's vote on one review.
export async function voteReview(token, reviewId, voteType) {
  const response = await api.post(
    `/reviews/${reviewId}/vote`,
    { voteType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

// Verify a JWT and load the currently authenticated student profile.
export async function getCurrentStudent(token) {
  const response = await api.get("/students/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// Update the editable fields of the currently authenticated student profile.
export async function updateCurrentStudent(token, profileData) {
  const response = await api.patch("/students/me", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
