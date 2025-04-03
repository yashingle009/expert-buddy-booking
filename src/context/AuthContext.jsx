
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Check local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      // Check if profile is complete (has more than just basic info)
      setIsProfileComplete(
        !!(parsedUser.phone || parsedUser.location || parsedUser.bio)
      );
    }
  }, []);

  // Sign in function
  const signIn = async (userData) => {
    try {
      console.log("Signing in with user data:", userData);
      
      // Ensure isExpert flag is properly set based on userType
      const updatedUserData = {
        ...userData,
        isExpert: userData.userType === "expert"
      };
      
      // First, save basic user information
      setUser(updatedUserData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      
      // Check if profile is complete
      setIsProfileComplete(
        !!(updatedUserData.phone || updatedUserData.location || updatedUserData.bio)
      );
      
      return updatedUserData;
    } catch (error) {
      console.error("Error in signIn:", error);
      throw error;
    }
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsProfileComplete(false);
    localStorage.removeItem("user");
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsProfileComplete(true);
    
    return updatedUser;
  };

  // Upload and save profile image
  const uploadProfileImage = async (file) => {
    try {
      if (!user || !file) {
        console.error("Missing user or file for upload");
        return null;
      }
      
      // For now, we'll use a placeholder for the image URL
      // In a production app, you would upload to Firebase Storage
      const imageUrl = URL.createObjectURL(file);
      
      // Update the user's profile with the new image URL
      const updatedUser = { ...user, avatarUrl: imageUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return imageUrl;
    } catch (error) {
      console.error("Error in uploadProfileImage:", error);
      throw error;
    }
  };

  // Update user data directly
  const updateUserData = async (userData) => {
    // Ensure isExpert flag is properly set based on userType
    const updatedUserData = {
      ...userData,
      isExpert: userData.userType === "expert"
    };
    
    // Update local state
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    
    return updatedUserData;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isProfileComplete, 
        signIn, 
        signOut, 
        updateProfile,
        uploadProfileImage,
        updateUserData,
        isExpert: user?.isExpert || user?.userType === "expert",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
