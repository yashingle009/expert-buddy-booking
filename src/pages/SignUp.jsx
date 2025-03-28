
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    
    // This is a placeholder for actual registration logic
    // Simulate sign-up with a timeout
    setTimeout(() => {
      setIsLoading(false);
      
      // Sign in the user with the provided information
      signIn({
        firstName,
        lastName,
        email
      });
      
      toast.success("Account created successfully");
      navigate("/profile");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-booking-secondary">Expert</span> Buddy
          </h1>
          <p className="mt-2 text-sm text-gray-500">Create your account</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
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
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            <p>
              Already have an account?{" "}
              <Link to="/sign-in" className="text-booking-secondary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
