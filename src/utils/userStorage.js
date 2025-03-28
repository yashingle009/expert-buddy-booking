
/**
 * Utility functions for managing user data in localStorage for demo purposes
 * In a real app, this would be handled by Supabase Auth
 */

// Add a user to the stored users array
export const addUserToStorage = (userData) => {
  const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  
  // Check if user already exists
  const existingUserIndex = existingUsers.findIndex(user => user.email === userData.email);
  
  if (existingUserIndex >= 0) {
    // Update existing user
    existingUsers[existingUserIndex] = userData;
  } else {
    // Add new user
    existingUsers.push(userData);
  }
  
  localStorage.setItem("allUsers", JSON.stringify(existingUsers));
};

// Get a user by email from the stored users array
export const getUserByEmail = (email) => {
  const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  return existingUsers.find(user => user.email === email) || null;
};

// Remove a user from the stored users array
export const removeUserFromStorage = (email) => {
  const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  const filteredUsers = existingUsers.filter(user => user.email !== email);
  localStorage.setItem("allUsers", JSON.stringify(filteredUsers));
};
