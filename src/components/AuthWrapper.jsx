
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ProfileCompletionDialog from "./ProfileCompletionDialog";

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, isProfileComplete } = useAuth();
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
