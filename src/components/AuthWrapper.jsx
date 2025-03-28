
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

// This is a placeholder authentication wrapper until you implement a new auth system
const AuthWrapper = ({ children }) => {
  // For now, we'll assume the user is authenticated
  // You'll need to replace this with actual authentication logic later
  const isAuthenticated = true;

  if (!isAuthenticated) {
    toast.error("Please sign in to access this page");
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
