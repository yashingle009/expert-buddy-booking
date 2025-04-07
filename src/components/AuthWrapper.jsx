
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ProfileCompletionDialog from "./ProfileCompletionDialog";

const AuthWrapper = ({ children, expertOnly = false }) => {
  const { isAuthenticated, isProfileComplete, isExpert, user } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Show the dialog if the user is authenticated but hasn't completed their profile
    if (isAuthenticated && !isProfileComplete) {
      setShowProfileDialog(true);
    }
  }, [isAuthenticated, isProfileComplete]);

  // Debug logs to help diagnose expert recognition issues
  console.log("AuthWrapper - user:", user);
  console.log("AuthWrapper - isExpert:", isExpert);
  console.log("AuthWrapper - userType:", user?.userType);
  console.log("AuthWrapper - location:", location.pathname);

  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    toast.error("Please sign in to access this page");
    return <Navigate to="/sign-in" replace />;
  }

  // If the route is expert-only and the user is not an expert
  if (expertOnly && !isExpert) {
    console.log("User is not an expert but trying to access expert-only page");
    toast.error("This page is only for experts");
    return <Navigate to="/profile" replace />;
  }
  
  // If the user is an expert and tries to access user-only pages
  if (!expertOnly && isExpert && location.pathname === "/profile") {
    console.log("Expert trying to access user profile, redirecting to expert dashboard");
    return <Navigate to="/expert-dashboard" replace />;
  }

  return (
    <>
      {children}
      <ProfileCompletionDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog} 
      />
    </>
  );
};

export default AuthWrapper;
