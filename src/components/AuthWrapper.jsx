
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ProfileCompletionDialog from "./ProfileCompletionDialog";

const AuthWrapper = ({ children, expertOnly = false }) => {
  const { isAuthenticated, isProfileComplete, isExpert } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  useEffect(() => {
    // Show the dialog if the user is authenticated but hasn't completed their profile
    if (isAuthenticated && !isProfileComplete) {
      setShowProfileDialog(true);
    }
  }, [isAuthenticated, isProfileComplete]);

  if (!isAuthenticated) {
    toast.error("Please sign in to access this page");
    return <Navigate to="/sign-in" replace />;
  }

  // If the route is expert-only and the user is not an expert
  if (expertOnly && !isExpert) {
    toast.error("This page is only for experts");
    return <Navigate to="/profile" replace />;
  }
  
  // If the user is an expert and tries to access user-only pages
  if (!expertOnly && isExpert && window.location.pathname === "/profile") {
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
