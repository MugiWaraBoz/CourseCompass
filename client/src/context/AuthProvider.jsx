import { useEffect, useState } from "react";
import { getCurrentStudent, updateCurrentStudent } from "@/api/authApi";
import { AuthContext } from "@/context/authContext";

// Keys used to store authentication data in browser localStorage
const TOKEN_KEY = "courseCompassToken";
const STUDENT_KEY = "courseCompassStudent";

/**
 * Safely read and parse the stored student profile from localStorage.
 * Returns null if data is missing, corrupted, or invalid.
 */
function readStoredStudent() {
  try {
    const storedStudent = JSON.parse(localStorage.getItem(STUDENT_KEY)) || null;
    if (!storedStudent) return null;
    return sanitizeStudent(storedStudent);
  } catch {
    // If JSON is invalid, remove the corrupted data
    localStorage.removeItem(STUDENT_KEY);
    return null;
  }
}

/**
 * Remove sensitive fields (password, apiKey) from student object
 * to prevent accidental exposure in the browser.
 */
function sanitizeStudent(student) {
  if (!student) return null;
  const safeStudent = { ...student };
  delete safeStudent.password;
  delete safeStudent.apiKey;
  return safeStudent;
}

function AuthProvider({ children }) {
  // State for the currently logged-in student (null if not logged in)
  const [student, setStudent] = useState(readStoredStudent);
  // State for the JWT token (null if not logged in)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // Loading state: true while we verify the token on app startup
  const [authLoading, setAuthLoading] = useState(() => Boolean(token));

  // On app startup, if a token exists, verify it with the backend
  useEffect(() => {
    // If no token, nothing to verify
    if (!token) return;

    let active = true; // Prevent state updates if component unmounts

    // Verify the stored JWT is still valid by fetching current student profile
    getCurrentStudent(token)
      .then((response) => {
        if (!active) return;

        // Extract student from response (handles different response formats)
        const currentStudent = sanitizeStudent(
          response?.data?.student ?? response?.data ?? null,
        );
        if (currentStudent) {
          // Update state and localStorage with fresh data
          setStudent(currentStudent);
          localStorage.setItem(STUDENT_KEY, JSON.stringify(currentStudent));
        }
      })
      .catch(() => {
        if (!active) return;

        // Token is invalid/expired: clear all auth data and log out
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STUDENT_KEY);
        setToken(null);
        setStudent(null);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    // Cleanup function: runs when component unmounts or token changes
    return () => {
      active = false;
    };
  }, [token]);

  /**
   * Called by login/register pages after successful authentication.
   * Saves token and student data to localStorage and updates React state.
   */
  function signIn(authResponse) {
    const nextToken = authResponse?.token;
    const nextStudent = sanitizeStudent(authResponse?.data?.student);

    if (!nextToken || !nextStudent) {
      throw new Error("The login response was incomplete.");
    }

    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(STUDENT_KEY, JSON.stringify(nextStudent));
    setToken(nextToken);
    setStudent(nextStudent);
  }

  /**
   * Log the student out: clear localStorage and reset state.
   */
  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_KEY);
    setToken(null);
    setStudent(null);
    setAuthLoading(false);
  }

  /**
   * Update student profile (name, CGPA, photo) on the backend
   * and sync the updated data to localStorage and React state.
   */
  async function updateProfile(profileData) {
    if (!token) throw new Error("You must be logged in to update your profile.");

    const response = await updateCurrentStudent(token, profileData);
    const updatedStudent = sanitizeStudent(response?.data?.student);

    if (!updatedStudent) {
      throw new Error("The profile update response was incomplete.");
    }

    localStorage.setItem(STUDENT_KEY, JSON.stringify(updatedStudent));
    setStudent(updatedStudent);
    return response;
  }

  // Value object passed to all components via AuthContext
  const value = {
    student,           // Current student object (or null)
    token,             // JWT token (or null)
    authLoading,       // True while verifying token on startup
    isAuthenticated: Boolean(token && student), // Convenience boolean
    signIn,            // Function to log in
    signOut,           // Function to log out
    updateProfile,     // Function to update profile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
