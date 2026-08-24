import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

/**
 * ProtectedRoute
 * A wrapper component that gates access to its children behind authentication.
 * If the user is not logged in they are redirected to /login.
 * The originally requested path is saved in navigation state so the login page
 * can return them to the same place after a successful login.
 */
function ProtectedRoute({ children }) {
  // useLocation() provides the current URL info (pathname, search, etc.)
  const location = useLocation();

  // useAuth() returns auth state from the context provider higher up the tree
  const { isAuthenticated, authLoading } = useAuth();

  // While the app is still validating the stored JWT (e.g. on first page load)
  // show a non-flash loading indicator instead of bouncing to login.
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

  // Remember the requested URL so Login can return the student after authentication.
  // Ternary: if authenticated render the protected content; otherwise redirect to /login.
  // "replace" removes the protected-route entry from history so pressing Back
  // doesn't land on a page that would just redirect again.
  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
}

export default ProtectedRoute;
