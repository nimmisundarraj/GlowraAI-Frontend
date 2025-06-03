import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { FC } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
