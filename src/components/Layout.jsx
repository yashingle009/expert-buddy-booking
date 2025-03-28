
import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  Grid3x3, 
  CalendarDays, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Bell, 
  HelpCircle, 
  Moon, 
  Sun,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navigationItems = [
    { name: "Home", path: "/", icon: <Home size={24} /> },
    { name: "Categories", path: "/categories", icon: <Grid3x3 size={24} /> },
    { name: "My Bookings", path: "/bookings", icon: <CalendarDays size={24} /> },
    { name: "Profile", path: "/profile", icon: <User size={24} /> },
  ];

  const drawerItems = [
    { name: "Account Settings", icon: <Settings size={24} /> },
    { name: "Notifications", icon: <Bell size={24} /> },
    { name: "Help Center", icon: <HelpCircle size={24} /> },
  ];

  // Check if the current path is an expert profile page
  const isExpertProfilePage = location.pathname.startsWith('/expert/');

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border h-16 flex items-center px-4">
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleDrawer} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold">
              <span className="text-booking-secondary">Expert</span> Buddy
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {isAuthenticated ? (
              <div 
                className="h-8 w-8 bg-booking-secondary text-white rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0) || ''}
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/sign-in')}
                className="flex items-center space-x-1"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-auto pb-16">
        <Outlet />
      </main>

      {/* Bottom Navigation - conditionally rendered */}
      {!isExpertProfilePage && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-border h-16">
          <div className="grid grid-cols-4 h-full max-w-screen-xl mx-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive ? "text-booking-secondary scale-105" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1 font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}

      {/* Side Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDrawer}
      />
      
      <div 
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-semibold">
              <span className="text-booking-secondary">Expert</span> Buddy
            </h2>
            <button 
              onClick={toggleDrawer}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto py-4">
            {isAuthenticated ? (
              <div className="px-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-booking-secondary text-white rounded-full flex items-center justify-center">
                    <span className="font-medium">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0) || ''}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 mb-6 flex flex-col space-y-2">
                <Button onClick={() => { toggleDrawer(); navigate('/sign-in'); }}>
                  Sign In
                </Button>
                <Button variant="outline" onClick={() => { toggleDrawer(); navigate('/sign-up'); }}>
                  Create Account
                </Button>
              </div>
            )}

            <div className="space-y-1 px-3">
              {drawerItems.map((item) => (
                <button
                  key={item.name}
                  onClick={toggleDrawer}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
              
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                >
                  <LogOut size={24} />
                  <span>Logout</span>
                </button>
              )}
              
              <div className="mt-4 px-3 py-3 flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  <span>Dark Mode</span>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === "dark" ? "bg-booking-secondary" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-border">
            <p className="text-sm text-gray-500 dark:text-gray-400">Expert Buddy v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
