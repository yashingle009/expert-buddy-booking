
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Camera,
  Edit
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [profileImage, setProfileImage] = useState(null);

  // Handle profile image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully");
    navigate("/sign-in");
  };

  return (
    <div className="page-container animate-fade-in pb-20">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings</p>
      </section>

      {/* Profile Card */}
      <section className="mb-8">
        <div className="neo-card p-6 flex flex-col items-center">
          <div className="relative group mb-4">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md">
                <User size={40} className="text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div className="absolute -bottom-2 right-0 bg-booking-secondary text-white p-2 rounded-full shadow-lg">
              <label htmlFor="profile-image" className="cursor-pointer">
                <Camera size={16} />
                <input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </label>
            </div>
          </div>
          <h2 className="text-xl font-bold">
            {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {user ? user.email : "guest@example.com"}
          </p>
          <button className="mt-4 btn-secondary py-2 px-4 flex items-center">
            <Edit size={16} className="mr-2" />
            Edit Profile
          </button>
        </div>
      </section>

      {/* Settings Sections */}
      <section className="space-y-6">
        {/* Account Settings */}
        <div className="neo-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold">Account Settings</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <User size={20} className="mr-3 text-booking-secondary" />
                <span>Personal Information</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <Mail size={20} className="mr-3 text-booking-secondary" />
                <span>Email & Communications</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <Phone size={20} className="mr-3 text-booking-secondary" />
                <span>Phone Number</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="neo-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold">Payment Methods</h3>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <CreditCard size={24} className="text-booking-secondary" />
            </div>
            <h4 className="font-medium">No Payment Methods</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
              Add a payment method to easily pay for bookings
            </p>
            <button className="mt-4 btn-primary py-2 px-4">
              Add Payment Method
            </button>
          </div>
        </div>
        
        {/* App Settings */}
        <div className="neo-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold">App Settings</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <Bell size={20} className="mr-3 text-booking-secondary" />
                <span>Notifications</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <ShieldCheck size={20} className="mr-3 text-booking-secondary" />
                <span>Privacy & Security</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <HelpCircle size={20} className="mr-3 text-booking-secondary" />
                <span>Help & Support</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Logout */}
        <button 
          className="w-full neo-card p-4 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          <span className="font-medium">Log Out</span>
        </button>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          <p>Expert Buddy v1.0.0</p>
          <p className="mt-1">© 2023 Expert Buddy. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

export default Profile;
