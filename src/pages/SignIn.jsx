
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getUserByEmail } from "@/utils/userStorage";

const SignInPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
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
      console.log("Signing in with email:", email);
      
      // Get the user from our simulated storage
      const existingUser = getUserByEmail(email);
      
      if (!existingUser) {
        toast.error("User not found. Please sign up first.");
        setIsLoading(false);
        return;
      }
      
      // Get user type from Supabase
      let { data, error } = await supabase
        .from('user_types')
        .select('user_type')
        .eq('id', existingUser.id)
        .single();
      
      if (error) {
        console.error("Error fetching user type:", error);
        // If we can't get the user type from Supabase, try a different approach
        // This ensures compatibility with both previously created users and new ones
        
        // Try getting the user type directly from the existingUser object
        if (existingUser.userType) {
          data = { user_type: existingUser.userType };
          console.log("Using user type from local storage:", existingUser.userType);
        } else {
          // Default to regular user if no type is found
          data = { user_type: "user" };
          console.log("No user type found, defaulting to 'user'");
        }
      } else {
        console.log("Retrieved user type from database:", data.user_type);
      }
      
      // Assign the user type (either from Supabase or fallback)
      existingUser.userType = data.user_type;
      
      // Sign in the user (this will save to localStorage)
      await signIn(existingUser);
      
      toast.success("Signed in successfully");
      
      // Redirect based on user type
      if (existingUser.userType === "expert") {
        navigate("/expert-dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error("Failed to sign in");
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
                {isLoading ? "Signing in..." : "Sign In"}
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
