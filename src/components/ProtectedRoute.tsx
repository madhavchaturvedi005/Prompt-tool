import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // For challenges page, we handle the auth check within the component itself
  // This allows us to show the blurred background
  return <>{children}</>;
};