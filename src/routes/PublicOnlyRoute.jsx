import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={(location.state?.from && location.state.from !== "/login") ? location.state.from : "/dashboard"} replace />;
  }

  return children;
}
