
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Phone, MapPin, FileText, Camera } from "lucide-react";

const ProfileCompletionDialog = ({ open, onOpenChange }) => {
  const { user, updateProfile, uploadProfileImage } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    bio: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        await uploadProfileImage(file);
        toast.success("Profile image uploaded");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update profile with the new information
    updateProfile(formData);
    
    // Close the dialog
    onOpenChange(false);
    
    // Show success message
    toast.success("Profile updated successfully!");
  };

  const handleSkip = () => {
    onOpenChange(false);
    toast("You can complete your profile later in the profile section");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Welcome {user?.firstName}! Add a few more details to complete your profile.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative mb-4">
                {user?.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-background"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <label 
                  htmlFor="dialog-profile-image" 
                  className="absolute -bottom-2 -right-2 bg-booking-secondary text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-booking-secondary/90 transition-colors"
                >
                  <Camera size={14} />
                  <input 
                    id="dialog-profile-image" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Add a profile picture</p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Phone className="h-4 w-4 text-muted-foreground ml-auto" />
              <div className="col-span-3">
                <Input
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <MapPin className="h-4 w-4 text-muted-foreground ml-auto" />
              <div className="col-span-3">
                <Input
                  name="location"
                  placeholder="Your location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <FileText className="h-4 w-4 text-muted-foreground ml-auto" />
              <div className="col-span-3">
                <Input
                  name="bio"
                  placeholder="A short bio about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button type="submit">Save Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionDialog;
