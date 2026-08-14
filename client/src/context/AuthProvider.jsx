import { useEffect, useState } from "react";
import { getCurrentStudent, updateCurrentStudent } from "@/api/authApi";
import { AuthContext } from "@/context/authContext";

const TOKEN_KEY = "courseCompassToken";
const STUDENT_KEY = "courseCompassStudent";

// Read cached profile data defensively because localStorage can contain invalid JSON.
function readStoredStudent() {
  try {
    const storedStudent = JSON.parse(localStorage.getItem(STUDENT_KEY)) || null;
    if (!storedStudent) return null;

    return sanitizeStudent(storedStudent);
  } catch {
    localStorage.removeItem(STUDENT_KEY);
    return null;
  }
}

// Protect the browser session from sensitive fields accidentally returned by APIs.
function sanitizeStudent(student) {
  if (!student) return null;

  const safeStudent = { ...student };
  delete safeStudent.password;
  return safeStudent;
}

function AuthProvider({ children }) {
  const [student, setStudent] = useState(readStoredStudent);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(() => Boolean(token));

  useEffect(() => {
    if (!token) return;

    let active = true;

    // Validate persisted JWTs on application startup instead of trusting stale data.
    getCurrentStudent(token)
      .then((response) => {
        if (!active) return;

        const currentStudent = sanitizeStudent(
          response?.data?.student ?? response?.data ?? null,
        );
        if (currentStudent) {
          setStudent(currentStudent);
          localStorage.setItem(STUDENT_KEY, JSON.stringify(currentStudent));
        }
      })
      .catch(() => {
        if (!active) return;

        // Invalid or expired credentials are removed so the app returns to signed-out state.
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STUDENT_KEY);
        setToken(null);
        setStudent(null);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  // Login pages pass the successful API response here to establish one shared session.
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

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_KEY);
    setToken(null);
    setStudent(null);
    setAuthLoading(false);
  }

  // Update the backend and synchronize every component with its returned profile.
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

  const value = {
    student,
    token,
    authLoading,
    isAuthenticated: Boolean(token && student),
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
