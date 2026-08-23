import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

// Guest-only routes prevent authenticated students from reopening login/register.
function GuestRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  // Wait for persisted JWT validation before making a navigation decision.
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

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default GuestRoute;
