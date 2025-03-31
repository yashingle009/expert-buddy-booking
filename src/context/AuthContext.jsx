
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoadingUserType, setIsLoadingUserType] = useState(false);

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

  // Fetch user type from Supabase when user changes
  useEffect(() => {
    const getUserTypeFromSupabase = async () => {
      if (!user?.email) return;

      try {
        setIsLoadingUserType(true);
        console.log("Fetching user type for:", user.email);
        
        // Using email as identifier since we don't have real auth.uid() yet
        const { data, error } = await supabase
          .from('user_types')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user type:", error);
          return;
        }

        if (data) {
          console.log("User type from database:", data.user_type);
          // Update user object with user type from database
          const updatedUser = { 
            ...user, 
            userType: data.user_type 
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error in getUserTypeFromSupabase:", error);
      } finally {
        setIsLoadingUserType(false);
      }
    };

    if (user?.id) {
      getUserTypeFromSupabase();
    }
  }, [user?.id]);

  // Sign in function
  const signIn = async (userData) => {
    try {
      console.log("Signing in with user data:", userData);
      
      // First, save basic user information
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Check if profile is complete
      setIsProfileComplete(
        !!(userData.phone || userData.location || userData.bio)
      );
      
      return userData;
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
    
    // Also update the profiles table in Supabase
    try {
      // Check if a profile exists for this user
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (existingProfile) {
        // Update existing profile
        await supabase
          .from('profiles')
          .update({
            full_name: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim(),
            bio: updatedUser.bio,
            avatar_url: updatedUser.avatarUrl,
            expertise: updatedUser.expertise,
            is_expert: updatedUser.userType === 'expert',
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } else {
        // Create new profile
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim(),
            bio: updatedUser.bio,
            avatar_url: updatedUser.avatarUrl,
            expertise: updatedUser.expertise,
            is_expert: updatedUser.userType === 'expert',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      console.log("Profile updated in Supabase");
    } catch (error) {
      console.error("Error updating profile in Supabase:", error);
    }
    
    return updatedUser;
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
      
      // Update profile in Supabase
      try {
        await supabase
          .from('profiles')
          .update({ avatar_url: imageUrl })
          .eq('id', user.id);
      } catch (updateError) {
        console.error("Error updating avatar in Supabase:", updateError);
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error in uploadProfileImage:", error);
      throw error;
    }
  };

  // Update user data directly
  const updateUserData = async (userData) => {
    // Update local state
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Update profile in Supabase
    if (userData.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            bio: userData.bio,
            avatar_url: userData.avatarUrl,
            expertise: userData.expertise,
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.id);
      } catch (error) {
        console.error("Error in updateUserData:", error);
      }
    }
    
    return userData;
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
        isExpert: user?.userType === "expert",
        isLoadingUserType
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
