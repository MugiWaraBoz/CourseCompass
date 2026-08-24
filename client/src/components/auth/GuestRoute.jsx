import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

/**
 * GuestRoute
 * Restricts access to unauthenticated users only.
 * If a logged-in user tries to visit a guest page (e.g. /login or /register)
 * they are redirected to the home page instead.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  // Wait for persisted JWT validation before making a navigation decision.
  // Without this guard, the page could briefly flash the login form and then
  // redirect away, which looks like a glitch.
  if (authLoading) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#f8faf9] px-4">
        <div className="text-center">
          <span className="mx-auto block size-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  // If already authenticated, redirect to home; otherwise render the child route content
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default GuestRoute;
