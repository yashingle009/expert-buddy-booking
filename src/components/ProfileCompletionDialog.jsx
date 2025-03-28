
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
import { User, Phone, MapPin, FileText } from "lucide-react";

const ProfileCompletionDialog = ({ open, onOpenChange }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    bio: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
