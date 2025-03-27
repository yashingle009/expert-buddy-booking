
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  CheckCircle, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

const ExpertProfile = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState("Today");
  
  // Mock expert data - in a real app this would come from an API
  const expert = {
    id: expertId,
    name: "Rajesh Mehta, CA",
    title: "Senior Tax & Business Consultant",
    rating: 4.9,
    reviews: 253,
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    services: [
      {
        id: "1",
        name: "GST Filing & Compliance",
        price: "₹2,999/month",
        description: "Monthly returns & consultation",
        details: [
          { icon: "Clock", text: "2-3 days" },
          { icon: "Repeat", text: "Monthly" }
        ]
      },
      {
        id: "2",
        name: "Business Audit",
        price: "₹18,000/audit",
        description: "Comprehensive financial review",
        details: [
          { icon: "Clock", text: "5-7 days" },
          { icon: "Calendar", text: "One-time" }
        ]
      }
    ],
    availability: {
      dates: ["Today", "Tomorrow", "Wed, 20 Mar", "Thu, 21 Mar"],
      timeSlots: {
        "Morning": ["09:00 AM", "10:00 AM", "11:00 AM"],
        "Afternoon": ["02:00 PM", "03:00 PM", "04:00 PM"]
      }
    },
    clientReviews: [
      {
        id: "1",
        name: "Priya Sharma",
        rating: 5,
        date: "3 days ago",
        comment: "Excellent service! Mr. Mehta helped in preparing our GST compliance and saved us from penalties. Very professional and knowledgeable."
      },
      {
        id: "2",
        name: "Arun Patel",
        rating: 5,
        date: "1 week ago",
        comment: "Great business audit service. Thorough analysis and valuable recommendations for improving company's growth."
      }
    ]
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookConsultation = () => {
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot first");
      return;
    }
    
    toast.success(`Consultation booked with ${expert.name} for ${selectedDate} at ${selectedTimeSlot}`);
    // In a real app, this would navigate to a booking confirmation page or trigger a booking API call
  };

  const handleGetCertified = () => {
    toast.info("Getting certified with this expert...");
    // This would open a verification/certification process
  };

  const handleMeetNow = () => {
    toast.info("Attempting to schedule an immediate meeting...");
    // This would check for immediate availability and set up a meeting
  };

  if (!expert) {
    return <div className="p-4">Expert not found</div>;
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center p-4 border-b">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">Consultant Profile</h1>
      </div>

      {/* Expert header with image and basic info */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4">
        <div className="flex flex-col items-center">
          <img 
            src={expert.image} 
            alt={expert.name} 
            className="w-24 h-24 rounded-full object-cover mb-3"
          />
          <h1 className="text-xl font-bold">{expert.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{expert.title}</p>
          
          <div className="flex items-center mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium mr-1">{expert.rating}</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">({expert.reviews} reviews)</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn-primary text-sm py-1.5 px-3">
              Get Certified
            </button>
            <button className="btn-secondary text-sm py-1.5 px-3">
              Meet Now
            </button>
          </div>
        </div>
      </div>

      {/* Consultation Services */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Consultation Services</h2>
        
        <div className="space-y-4">
          {expert.services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{service.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{service.price}</p>
                </div>
              </div>
              
              <div className="flex mt-3">
                {service.details.map((detail, index) => (
                  <div key={index} className="flex items-center mr-4 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{detail.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Time Slots */}
      <div className="p-4 border-t">
        <h2 className="text-lg font-semibold mb-3">Available Time Slots</h2>
        
        {/* Date selection */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {expert.availability.dates.map((date) => (
            <button
              key={date}
              onClick={() => handleDateSelect(date)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedDate === date 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {date}
            </button>
          ))}
        </div>
        
        {/* Time slots by section */}
        <div className="space-y-4">
          {Object.entries(expert.availability.timeSlots).map(([section, slots]) => (
            <div key={section}>
              <h3 className="text-sm font-medium mb-2">{section}</h3>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleTimeSlotSelect(slot)}
                    className={`py-2 border rounded-lg flex justify-center items-center ${
                      selectedTimeSlot === slot
                        ? "border-primary text-primary"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Reviews */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Client Reviews</h2>
          <button className="text-sm text-primary">Sort by Latest</button>
        </div>
        
        <div className="space-y-4">
          {expert.clientReviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">{review.name}</h3>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed booking button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t">
        <button 
          onClick={handleBookConsultation}
          className="w-full btn-primary py-3 flex items-center justify-center"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Book Consultation
        </button>
      </div>
    </div>
  );
};

export default ExpertProfile;
