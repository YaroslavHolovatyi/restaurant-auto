import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../../store/store";
import { getAuthToken } from "../../utils/authUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "cook" | "waiter";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const token = getAuthToken();
  const userRole = user.profile?.role;

  // Check if user is authenticated
  const isAuthenticated = user.isLoggedIn && token !== null;

  // Check if user has required role (if specified)
  const hasRequiredRole = requiredRole ? userRole === requiredRole : true;

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    // Redirect to main page if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
