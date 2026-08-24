import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

/**
 * Custom hook to access authentication state and functions from AuthContext.
 * 
 * Usage:
 *   const { student, token, isAuthenticated, signIn, signOut, updateProfile } = useAuth();
 * 
 * Throws an error if used outside of AuthProvider (ensures proper setup).
 */
export function useAuth() {
  const context = useContext(AuthContext);

  // This check helps catch setup mistakes early during development
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
