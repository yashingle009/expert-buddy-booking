
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  Award, 
  Briefcase, 
  ThumbsUp, 
  ArrowLeft, 
  Share, 
  Heart,
  CheckCircle2,
  ChevronDown,
  MessageCircle
} from "lucide-react";

const ExpertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  const mockExpert = {
    id,
    name: "Dr. Sarah Johnson",
    specialty: "Tax Consultant",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    price: "$120/hour",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    experience: "12 years",
    description: "Dr. Sarah Johnson is a certified tax consultant with over 12 years of experience. She specializes in personal and business tax planning, compliance, and consulting services. Dr. Johnson has helped hundreds of clients navigate complex tax situations, optimize their tax strategies, and ensure compliance with changing tax laws. She holds a Ph.D. in Taxation and is a Certified Public Accountant (CPA).",
    availability: [
      { day: "Mon", date: "Jun 12", slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Tue", date: "Jun 13", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Wed", date: "Jun 14", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Thu", date: "Jun 15", slots: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"] },
      { day: "Fri", date: "Jun 16", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
    ],
    packages: [
      { id: "1", name: "Basic Consultation", duration: "45 min", price: "$120", description: "Initial consultation to discuss your tax needs" },
      { id: "2", name: "Tax Planning Session", duration: "90 min", price: "$220", description: "Comprehensive tax planning and strategy session" },
      { id: "3", name: "Business Tax Package", duration: "3 hours", price: "$500", description: "Complete business tax analysis and optimization" },
    ],
    qualifications: [
      "Ph.D. in Taxation",
      "Certified Public Accountant (CPA)",
      "Master of Business Administration (MBA)",
      "Certified Tax Planner",
    ],
    testimonials: [
      { id: "1", name: "John Doe", rating: 5, comment: "Dr. Johnson helped me save thousands on my business taxes. Her advice was invaluable!", date: "May 15, 2023", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: "2", name: "Jane Smith", rating: 5, comment: "Extremely knowledgeable and professional. She explained complex tax concepts in an easy-to-understand way.", date: "Apr 28, 2023", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: "3", name: "Robert Williams", rating: 4, comment: "Great consultation that helped me restructure my investments for better tax outcomes.", date: "Apr 12, 2023", avatar: "https://randomuser.me/api/portraits/men/62.jpg" },
    ],
  };

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setExpert(mockExpert);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-booking-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="page-container">
        <div className="neo-card p-8 flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold">Expert Not Found</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
            We couldn't find the expert you're looking for
          </p>
          <button 
            onClick={() => navigate("/categories")}
            className="mt-4 btn-primary"
          >
            Browse Experts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Expert Header */}
      <div className="relative h-72">
        <img 
          src={expert.image} 
          alt={expert.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Nav Buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-lg text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-white/20 backdrop-blur-lg text-white">
              <Share size={24} />
            </button>
            <button className="p-2 rounded-full bg-white/20 backdrop-blur-lg text-white">
              <Heart size={24} />
            </button>
          </div>
        </div>
        
        {/* Expert Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h1 className="text-2xl font-bold">{expert.name}</h1>
          <p>{expert.specialty}</p>
          <div className="flex items-center mt-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{expert.rating}</span>
            <span className="ml-1">({expert.reviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex overflow-x-auto no-scrollbar">
          {["about", "services", "reviews", "availability"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "text-booking-secondary border-b-2 border-booking-secondary" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="page-container">
        {activeTab === "about" && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="neo-card p-4 flex flex-col items-center justify-center text-center">
                <Briefcase size={24} className="text-booking-secondary mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Experience</span>
                <span className="font-medium">{expert.experience}</span>
              </div>
              <div className="neo-card p-4 flex flex-col items-center justify-center text-center">
                <MapPin size={24} className="text-booking-secondary mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                <span className="font-medium">{expert.location}</span>
              </div>
              <div className="neo-card p-4 flex flex-col items-center justify-center text-center">
                <Clock size={24} className="text-booking-secondary mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Rate</span>
                <span className="font-medium">{expert.price}</span>
              </div>
            </div>
            
            {/* About */}
            <div className="neo-card p-6">
              <h2 className="text-xl font-bold mb-3">About</h2>
              <p className={`text-gray-700 dark:text-gray-300 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                {expert.description}
              </p>
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-booking-secondary font-medium mt-2"
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            </div>
            
            {/* Qualifications */}
            <div className="neo-card p-6">
              <h2 className="text-xl font-bold mb-3">Qualifications</h2>
              <div className="space-y-3">
                {expert.qualifications.map((qualification, index) => (
                  <div key={index} className="flex items-center">
                    <Award size={18} className="text-booking-secondary mr-2 shrink-0" />
                    <span>{qualification}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Book Button */}
            <div className="mt-8">
              <button 
                onClick={() => navigate(`/book/${expert.id}`)}
                className="w-full btn-primary py-4 flex items-center justify-center"
              >
                <Calendar size={20} className="mr-2" />
                Book a Session
              </button>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold my-4">Service Packages</h2>
            
            {expert.packages.map((pkg) => (
              <div key={pkg.id} className="neo-card p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{pkg.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock size={14} className="mr-1" />
                      {pkg.duration}
                    </div>
                    <p className="mt-3 text-gray-700 dark:text-gray-300">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{pkg.price}</div>
                    <button 
                      onClick={() => navigate(`/book/${expert.id}?package=${pkg.id}`)}
                      className="mt-3 btn-primary py-2 px-4"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="neo-card p-6 mt-4">
              <h3 className="font-bold text-lg">Need something specific?</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Contact {expert.name} to discuss custom services tailored to your needs.
              </p>
              <button className="mt-4 btn-secondary py-2 flex items-center justify-center">
                <MessageCircle size={18} className="mr-2" />
                Send Message
              </button>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center my-4">
              <h2 className="text-xl font-bold">Client Reviews</h2>
              <div className="flex items-center">
                <Star size={18} className="fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-bold">{expert.rating}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">({expert.reviews})</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {expert.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="neo-card p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-bold">{testimonial.name}</h3>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, index) => (
                            <Star 
                              key={index} 
                              size={14} 
                              className={index < testimonial.rating 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.date}
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 dark:text-gray-300">{testimonial.comment}</p>
                  <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <ThumbsUp size={14} className="mr-1" />
                    Helpful
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full btn-secondary py-3 mt-4 flex items-center justify-center">
              <ChevronDown size={20} className="mr-2" />
              Load More Reviews
            </button>
          </div>
        )}

        {activeTab === "availability" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold my-4">Available Slots</h2>
            
            <div className="overflow-x-auto no-scrollbar scroll-snap-x">
              <div className="flex space-x-3 pb-4">
                {expert.availability.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center justify-center w-20 h-24 neo-card shrink-0 scroll-snap-center cursor-pointer transition-all duration-200 ${
                      selectedDate === day ? "border-2 border-booking-secondary" : ""
                    }`}
                  >
                    <span className="text-sm font-medium">{day.day}</span>
                    <span className="text-lg font-bold my-1">{day.date}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{day.slots.length} slots</span>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedDate ? (
              <div className="mt-6 space-y-4">
                <h3 className="font-bold">Available Times on {selectedDate.day}, {selectedDate.date}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedDate.slots.map((slot, index) => (
                    <button
                      key={index}
                      className="neo-card p-4 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Clock size={16} className="mr-2" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 neo-card p-6 flex flex-col items-center justify-center">
                <Calendar size={48} className="text-booking-secondary mb-2" />
                <h3 className="font-bold">Select a Date</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
                  Choose a date to see available time slots
                </p>
              </div>
            )}
            
            <div className="mt-8">
              <button 
                onClick={() => navigate(`/book/${expert.id}`)}
                className="w-full btn-primary py-4 flex items-center justify-center"
              >
                <Calendar size={20} className="mr-2" />
                Book a Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertProfile;
