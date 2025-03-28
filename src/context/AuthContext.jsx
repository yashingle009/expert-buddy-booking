
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

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isProfileComplete, 
        signIn, 
        signOut, 
        updateProfile 
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
