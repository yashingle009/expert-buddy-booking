
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const AuthWrapper = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-booking-secondary"></div>
      </div>
    );
  }

  // If not signed in, redirect to sign-in page
  if (!isSignedIn) {
    toast.error("Please sign in to access this page");
    return <Navigate to="/sign-in" replace />;
  }

  // If signed in, render the children
  return <>{children}</>;
};

export default AuthWrapper;
