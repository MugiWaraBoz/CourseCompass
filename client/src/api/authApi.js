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
  const response = await api.post("/auth/change-password", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
