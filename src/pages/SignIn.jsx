
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useFirebase } from "@/context/FirebaseContext";
import { doc, getDoc } from "firebase/firestore";

const SignInPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const { signInWithEmail, firestore } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If user is already signed in, redirect to profile
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Signing in with Firebase, email:", email);
      
      // Firebase authentication
      const firebaseUser = await signInWithEmail(email, password);
      
      // Get user information from Firestore to determine user type
      const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }
      
      const userData = userDoc.data();
      console.log("Firestore user data:", userData);
      
      // Create user object from Firebase user and Firestore data
      const userObj = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        userType: userData?.userType || 'user',
        avatarUrl: firebaseUser.photoURL,
        isExpert: userData?.userType === 'expert'
      };
      
      console.log("User object before signIn:", userObj);
      
      // Sign in the user with our context
      await signIn(userObj);
      
      toast.success("Signed in successfully");
      
      // Redirect based on user type
      if (userData?.userType === 'expert') {
        navigate("/expert-dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-booking-secondary">Expert</span> Buddy
          </h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In with Firebase"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-booking-secondary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
