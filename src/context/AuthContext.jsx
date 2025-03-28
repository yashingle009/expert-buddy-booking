
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const signIn = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    // Check if profile is complete
    setIsProfileComplete(
      !!(userData.phone || userData.location || userData.bio)
    );
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsProfileComplete(false);
    localStorage.removeItem("user");
  };

  // Update user profile
  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsProfileComplete(true);
  };

  // Upload and save profile image
  const uploadProfileImage = async (file) => {
    try {
      if (!user || !file) {
        console.error("Missing user or file for upload");
        return null;
      }
      
      // Log for debugging
      console.log("Starting profile image upload for user:", user.id);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log("Uploading to path:", filePath, "in bucket: profileimages");

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('profileimages')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Error uploading image:", error);
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: publicURLData } = supabase.storage
        .from('profileimages')
        .getPublicUrl(filePath);

      const imageUrl = publicURLData.publicUrl;
      console.log("Image uploaded successfully. URL:", imageUrl);

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
        isExpert: user?.userType === "expert"
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
