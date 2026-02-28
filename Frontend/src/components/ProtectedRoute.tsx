import { Navigate } from "react-router-dom";
import { authAPI } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const isAuthenticated = authAPI.isAuthenticated();
  const userRole = authAPI.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "verifier":
        return <Navigate to="/verifier" replace />;
      case "accountancy":
        return <Navigate to="/accountancy" replace />;
      default:
        return <Navigate to="/student" replace />;
    }
  }

  return <>{children}</>;
};
