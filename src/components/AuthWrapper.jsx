
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.error("Please sign in to access this page");
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
