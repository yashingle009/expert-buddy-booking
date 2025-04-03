
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFirebase } from "@/context/FirebaseContext";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, Clock, BadgeCheck } from "lucide-react";

const ExpertOnboarding = () => {
  const navigate = useNavigate();
  const { user, updateProfile, uploadProfileImage, isExpert } = useAuth();
  const { firestore } = useFirebase();
  const [activeStep, setActiveStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    rate: "",
    bio: "",
    qualifications: "",
    availability: "weekdays"
  });

  // Redirect if not an expert
  if (!isExpert) {
    toast.error("Only experts can access this page");
    navigate("/profile");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
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

  const handleNextStep = () => {
    if (activeStep < 3) setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (activeStep > 1) setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update both collections - main user profile
      await updateDoc(doc(firestore, "users", user.id), {
        bio: formData.bio,
        updatedAt: new Date()
      });
      
      // Update expert-specific data
      await updateDoc(doc(firestore, "experts", user.id), {
        specialization: formData.specialization,
        experience: formData.experience,
        rate: formData.rate,
        bio: formData.bio,
        qualifications: formData.qualifications,
        availability: formData.availability,
        isProfileComplete: true,
        updatedAt: new Date()
      });
      
      // Also update the local user data
      updateProfile({
        ...formData,
        isProfileComplete: true
      });
      
      toast.success("Expert profile created successfully!");
      navigate("/expert-dashboard");
    } catch (error) {
      console.error("Error saving expert profile:", error);
      toast.error("Failed to save expert profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Expert Onboarding</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Set up your profile to start accepting bookings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`flex flex-col items-center relative w-1/3 ${
                  activeStep >= step ? "text-booking-secondary" : "text-gray-400"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  activeStep >= step ? "border-booking-secondary bg-booking-secondary/10" : "border-gray-300"
                }`}>
                  {step === 1 && <Upload size={18} />}
                  {step === 2 && <BadgeCheck size={18} />}
                  {step === 3 && <Clock size={18} />}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Expertise"}
                  {step === 3 && "Availability"}
                </div>
                {step < 3 && (
                  <div className={`absolute top-5 left-[60%] w-[80%] h-0.5 ${
                    activeStep > step ? "bg-booking-secondary" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {user?.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-2 border-background"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Upload className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <label 
                      htmlFor="profile-image" 
                      className="absolute -bottom-2 -right-2 bg-booking-secondary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-booking-secondary/90 transition-colors"
                    >
                      <Upload size={18} />
                      <input 
                        id="profile-image" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange} 
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">Upload a professional profile picture</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Textarea
                    name="bio"
                    placeholder="Tell clients about yourself and your expertise..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="h-40"
                    required
                  />
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Area of Specialization</label>
                  <Select 
                    name="specialization" 
                    value={formData.specialization}
                    onValueChange={(value) => handleSelectChange("specialization", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business Consulting</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Years of Experience</label>
                  <Input
                    name="experience"
                    type="number"
                    placeholder="Years of experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hourly Rate ($)</label>
                  <Input
                    name="rate"
                    type="number"
                    placeholder="Your hourly rate"
                    value={formData.rate}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Qualifications</label>
                  <Textarea
                    name="qualifications"
                    placeholder="List your degrees, certifications, and other qualifications..."
                    value={formData.qualifications}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Availability</label>
                  <Select 
                    name="availability" 
                    value={formData.availability}
                    onValueChange={(value) => handleSelectChange("availability", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays only</SelectItem>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                      <SelectItem value="evenings">Evenings only</SelectItem>
                      <SelectItem value="flexible">Flexible hours</SelectItem>
                      <SelectItem value="fulltime">Full-time availability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Bio:</strong> {formData.bio || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Specialization:</strong> {formData.specialization || "Not selected"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Experience:</strong> {formData.experience || 0} years
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Rate:</strong> ${formData.rate || 0}/hour
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Availability:</strong> {formData.availability || "Not selected"}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {activeStep > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
              )}

              {activeStep < 3 ? (
                <Button type="button" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  Complete Setup
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpertOnboarding;
