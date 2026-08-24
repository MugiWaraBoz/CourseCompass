import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

// Provide a small, consistent API for components that need authentication state.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
