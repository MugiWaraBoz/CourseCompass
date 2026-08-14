import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

// Protected routes require a validated student session before rendering children.
function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, authLoading } = useAuth();

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
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}

export default ProtectedRoute;
