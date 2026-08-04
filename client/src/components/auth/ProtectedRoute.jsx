import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/common/PageState";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingState label="Restoring your session..."/>;
  if (!token) return <Navigate to="/auth/login" replace state={{ from: location.pathname + location.search }}/>;
  return children;
}
