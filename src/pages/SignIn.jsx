
import { SignIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const SignInPage = () => {
  const { isSignedIn } = useUser();

  // If user is already signed in, redirect to profile
  if (isSignedIn) {
    return <Navigate to="/profile" replace />;
  }

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
          <SignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up" 
            redirectUrl="/profile"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
