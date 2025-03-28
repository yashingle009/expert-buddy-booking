
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This is a placeholder for actual authentication logic
    // Simulate sign-in with a timeout
    setTimeout(() => {
      setIsLoading(false);
      
      // Create user object with email and a generated name from email
      const firstName = email.split('@')[0].split('.')[0];
      const lastName = email.split('@')[0].split('.')[1] || '';
      
      // For sign-in, simulate checking if this user is an expert
      // In a real app, this would be retrieved from your database
      const userType = email.includes('expert') ? 'expert' : 'user';
      
      // Sign in the user
      signIn({
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : '',
        email: email,
        userType: userType
      });
      
      toast.success("Signed in successfully");
      
      // Redirect based on user type
      if (userType === "expert") {
        navigate("/expert-dashboard");
      } else {
        navigate("/profile");
      }
    }, 1000);
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
