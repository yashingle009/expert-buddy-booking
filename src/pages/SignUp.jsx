
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useFirebase } from "@/context/FirebaseContext";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { addUserToStorage } from "@/utils/userStorage";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const { signUpWithEmail, firestore } = useFirebase();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  // If user is already signed in, redirect to profile
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if email already exists
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast.error("Email already in use. Please use a different email.");
        setIsLoading(false);
        return;
      }
      
      // Firebase sign up
      const firebaseUser = await signUpWithEmail(email, password);
      
      // Create user profile in Firestore with proper userType
      const userDocRef = doc(firestore, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        firstName,
        lastName,
        email,
        userType,
        isExpert: userType === "expert",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // If expert, also create an entry in experts collection
      if (userType === "expert") {
        await setDoc(doc(firestore, "experts", firebaseUser.uid), {
          userId: firebaseUser.uid,
          firstName,
          lastName,
          email,
          specialization: "",
          experience: "",
          rate: "",
          bio: "",
          qualifications: "",
          availability: "weekdays",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      // Create user object with proper isExpert flag
      const userData = {
        id: firebaseUser.uid,
        firstName,
        lastName,
        email,
        userType,
        isExpert: userType === "expert"
      };
      
      // Save to local storage (for demo purposes)
      addUserToStorage(userData);
      
      // Sign in the user with our context
      await signIn(userData);
      
      toast.success(`Account created successfully as ${userType === "expert" ? "an expert" : "a user"}`);
      
      // Redirect based on user type
      if (userType === "expert") {
        navigate("/expert-onboarding");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.message || "Failed to create account");
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
            
            <div className="pt-2">
              <label className="block text-sm font-medium mb-3">
                I want to join as:
              </label>
              <RadioGroup 
                value={userType} 
                onValueChange={setUserType}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expert" id="expert" />
                  <Label htmlFor="expert">Expert</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up with Firebase"}
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
