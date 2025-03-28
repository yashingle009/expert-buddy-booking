
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
  console.log("User saved to local storage:", userData);
};

// Get a user by email from the stored users array
export const getUserByEmail = (email) => {
  const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  const user = existingUsers.find(user => user.email === email) || null;
  console.log("Found user by email:", email, user);
  return user;
};

// Update a specific field for a user in storage
export const updateUserInStorage = (email, updates) => {
  const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  const userIndex = existingUsers.findIndex(user => user.email === email);
  
  if (userIndex >= 0) {
    existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates };
    localStorage.setItem("allUsers", JSON.stringify(existingUsers));
    console.log("Updated user in storage:", existingUsers[userIndex]);
    return existingUsers[userIndex];
  }
  
  return null;
};

// Remove a user from the stored users array
export const removeUserFromStorage = (email) => {
  const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
  const filteredUsers = existingUsers.filter(user => user.email !== email);
  localStorage.setItem("allUsers", JSON.stringify(filteredUsers));
  console.log("Removed user from storage:", email);
};
