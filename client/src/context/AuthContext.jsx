import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "@/api/studentApi";

const AuthContext = createContext(null);
const TOKEN_KEY = "courseCompassToken";
const STUDENT_KEY = "courseCompassStudent";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STUDENT_KEY));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ data }) => {
        const safeStudent = { ...data.data.student };
        delete safeStudent.password;
        setStudent(safeStudent);
        localStorage.setItem(STUDENT_KEY, JSON.stringify(safeStudent));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STUDENT_KEY);
        setToken(null);
        setStudent(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function startSession(nextToken, nextStudent) {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(STUDENT_KEY, JSON.stringify(nextStudent));
    setToken(nextToken);
    setStudent(nextStudent);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_KEY);
    setToken(null);
    setStudent(null);
  }

  function updateStudent(nextStudent) {
    const safeStudent = { ...nextStudent };
    delete safeStudent.password;
    setStudent(safeStudent);
    localStorage.setItem(STUDENT_KEY, JSON.stringify(safeStudent));
  }

  return (
    <AuthContext.Provider
      value={{ token, student, loading, startSession, logout, updateStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
