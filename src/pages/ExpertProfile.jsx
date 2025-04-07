
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/context/FirebaseContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, Star, Award, BookOpen, User } from "lucide-react";

const ExpertProfile = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { firestore } = useFirebase();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if booking tab should be active
  const searchParams = new URLSearchParams(location.search);
  const showBooking = searchParams.get('booking') === 'true';
  const [activeTab, setActiveTab] = useState(showBooking ? "booking" : "about");
  
  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        setLoading(true);
        if (!expertId) return;
        
        const expertDocRef = doc(firestore, "experts", expertId);
        const expertDoc = await getDoc(expertDocRef);
        
        if (expertDoc.exists()) {
          setExpert({ id: expertDoc.id, ...expertDoc.data() });
          console.log("Fetched expert:", { id: expertDoc.id, ...expertDoc.data() });
        } else {
          console.log("No expert found with ID:", expertId);
          // Could redirect to 404 page here
        }
      } catch (error) {
        console.error("Error fetching expert data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpertData();
  }, [expertId, firestore]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-8"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  if (!expert) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Expert Not Found</h1>
        <p className="mb-6">We couldn't find the expert you're looking for.</p>
        <Button onClick={() => navigate('/experts')}>
          Back to Experts Directory
        </Button>
      </div>
    );
  }
  
  const { 
    firstName = '', 
    lastName = '',
    specialization = '',
    experience = '',
    rate = '',
    bio = 'No bio available',
    qualifications = '',
    availability = '',
    avatarUrl 
  } = expert;
  
  // Calculate initials for avatar fallback
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Expert Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={`${firstName} ${lastName}`} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-booking-secondary"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-booking-secondary text-white flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold">{firstName} {lastName}</h1>
            <p className="text-booking-secondary font-medium text-lg">{specialization}</p>
            
            <div className="flex items-center mt-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-500 ml-2">(5.0)</span>
              <span className="text-sm text-gray-500 ml-2">• 42 Reviews</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {rate && (
                <div className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  <span>${rate}/hr</span>
                </div>
              )}
              
              {experience && (
                <div className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  <Award className="mr-1 h-4 w-4" />
                  <span>{experience} years experience</span>
                </div>
              )}
              
              {availability && (
                <div className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Available {availability}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setActiveTab("booking")} className="w-full md:w-auto">
              <CalendarDays className="mr-2 h-4 w-4" />
              Book a Session
            </Button>
          </div>
        </div>
      </div>
      
      {/* Expert Details */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="about" className="flex-1">
            <User className="mr-2 h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">
            <Star className="mr-2 h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex-1">
            <CalendarDays className="mr-2 h-4 w-4" />
            Book a Session
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">About Me</h2>
              <p className="whitespace-pre-line">{bio}</p>
            </div>
            
            {qualifications && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Qualifications & Credentials
                </h2>
                <p className="whitespace-pre-line">{qualifications}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-2">Reviews Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're currently collecting reviews for this expert. Be one of the first to book a session and leave your feedback!
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="booking" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-2">Booking Feature Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We're working on implementing our booking system. Please check back soon or contact the expert directly.
            </p>
            <Button>
              Contact Expert
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpertProfile;
