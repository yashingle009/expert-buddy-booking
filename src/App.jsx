
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import ExpertProfile from "./pages/ExpertProfile";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AuthWrapper from "./components/AuthWrapper";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="expert-buddy-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:categoryId" element={<Categories />} />
                <Route path="/expert/:expertId" element={<ExpertProfile />} />
              </Route>
              
              {/* Auth Routes */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Layout />}>
                <Route path="/bookings" element={
                  <AuthWrapper>
                    <Bookings />
                  </AuthWrapper>
                } />
                <Route path="/profile" element={
                  <AuthWrapper>
                    <Profile />
                  </AuthWrapper>
                } />
              </Route>
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
