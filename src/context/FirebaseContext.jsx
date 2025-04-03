
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  app, 
  auth, 
  firestore, 
  storage 
} from '@/integrations/firebase/client';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { toast } from 'sonner';

const FirebaseContext = createContext(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Firebase Auth methods
  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in with Firebase successfully");
      return userCredential.user;
    } catch (error) {
      console.error("Firebase sign in error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created with Firebase successfully");
      return userCredential.user;
    } catch (error) {
      console.error("Firebase sign up error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out from Firebase");
    } catch (error) {
      console.error("Firebase sign out error:", error);
      toast.error(error.message);
    }
  };

  const value = {
    firebaseUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    app,
    auth,
    firestore,
    storage
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
