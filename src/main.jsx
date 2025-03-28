
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Import Clerk Publishable Key
const PUBLISHABLE_KEY = 'pk_test_c3dlZXBpbmctbGVtbWluZy0zMS5jbGVyay5hY2NvdW50cy5kZXYk';

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    clerkJSVersion="5.56.0-snapshot.v20250312225817"
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    afterSignInUrl="/profile"
    afterSignUpUrl="/profile" 
    afterSignOutUrl="/">
    <App />
  </ClerkProvider>
);
