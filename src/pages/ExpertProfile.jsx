import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  Calendar,
  Share2,
  MessageSquare,
  Video,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ExpertProfile = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedCommunicationType, setSelectedCommunicationType] = useState("video");
  const [selectedService, setSelectedService] = useState(null);
  
  // Mock expert data - in a real app this would come from an API
  const expert = {
    id: expertId,
    name: "Dr. Sarah Mitchell",
    title: "Business Strategy Consultant",
    rating: 4.9,
    reviews: 328,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    experience: "15 Years Experience",
    education: "Harvard MBA",
    stats: [
      {
        label: "Consultations",
        value: "1,200+"
      },
      {
        label: "Success Rate",
        value: "98%"
      },
      {
        label: "Avg. Response",
        value: "2 Hours"
      }
    ],
    about: "With 15 years of experience in business strategy and corporate consulting, I specialize in helping companies navigate complex market challenges and achieve sustainable growth. Former McKinsey consultant and Harvard Business School graduate.",
    services: [
      {
        id: "1",
        name: "Business Strategy",
        price: "$299/hour",
        icon: "🏢"
      },
      {
        id: "2",
        name: "Market Analysis",
        price: "$249/hour",
        icon: "📊"
      },
      {
        id: "3",
        name: "Leadership Coaching",
        price: "$199/hour",
        icon: "🏆"
      }
    ],
    availability: {
      dates: [
        { day: "Thu", date: "27", label: "Today" },
        { day: "Fri", date: "28", label: "" },
        { day: "Sat", date: "29", label: "" },
        { day: "Sun", date: "30", label: "" },
        { day: "Mon", date: "31", label: "" },
        { day: "Tue", date: "1", label: "" }
      ],
      timeSlots: [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM"
      ]
    },
    clientReviews: [
      {
        id: "1",
        name: "Emily Thompson",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        comment: "Dr. Sarah provided exceptional insights during our consultation. Her strategic recommendations were exactly what our business needed."
      },
      {
        id: "2",
        name: "James Wilson",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        rating: 5,
        comment: "Incredibly knowledgeable and insightful. The market analysis Sarah provided helped us identify key growth opportunities."
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

  const handleCommunicationTypeSelect = (type) => {
    setSelectedCommunicationType(type);
  };

  const handleBookConsultation = () => {
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot first");
      return;
    }
    
    toast.success(`Consultation booked with ${expert.name} for ${selectedDate} at ${selectedTimeSlot}`);
    // In a real app, this would navigate to a booking confirmation page
  };

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId === selectedService ? null : serviceId);
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="pb-24 flex flex-col">
      {/* Expert header with image background */}
      <div 
        className="relative h-[340px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${expert.image})`,
        }}
      >
        {/* Top navigation */}
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white"
              onClick={() => toast.info("Profile shared!")}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Expert info at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h1 className="text-2xl font-bold">{expert.name}</h1>
          <p className="text-white/90 mb-2">{expert.title}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {renderStars(expert.rating)}
            </div>
            <span className="text-sm">{expert.rating} ({expert.reviews} reviews)</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-white/20 text-white border-transparent">
              {expert.experience}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white border-transparent">
              {expert.education}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
        {expert.stats.map((stat, index) => (
          <div key={index} className="p-4 text-center">
            <div className="font-bold">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* About section */}
      <div className="px-5 py-4 bg-white dark:bg-gray-900">
        <h2 className="text-xl font-bold mb-3">About</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {expert.about}
        </p>
      </div>
      
      {/* Services section - now scrollable */}
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-3">Services</h2>
        <ScrollArea className="h-[150px] w-full">
          <div className="pr-4">
            {expert.services.map((service) => (
              <Card 
                key={service.id} 
                className={`bg-white dark:bg-gray-900 border mb-3 shadow-sm transition-all duration-200 cursor-pointer ${
                  selectedService === service.id 
                    ? "border-booking-secondary ring-2 ring-booking-secondary/20" 
                    : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                }`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent className="p-4 flex items-center">
                  <div className="text-3xl mr-4">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-booking-secondary font-semibold">{service.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Schedule appointment section */}
      <div className="px-5 py-4 bg-white dark:bg-gray-900">
        <h2 className="text-xl font-bold mb-3">Schedule Appointment</h2>
        
        {/* Communication type selection */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button
            variant="outline"
            className={`flex items-center justify-center gap-2 ${
              selectedCommunicationType === "video" 
                ? "bg-booking-secondary text-white border-booking-secondary" 
                : "bg-white dark:bg-gray-800"
            }`}
            onClick={() => handleCommunicationTypeSelect("video")}
          >
            <Video size={16} />
            <span>Video</span>
          </Button>
          <Button
            variant="outline"
            className={`flex items-center justify-center gap-2 ${
              selectedCommunicationType === "voice" 
                ? "bg-booking-secondary text-white border-booking-secondary" 
                : "bg-white dark:bg-gray-800"
            }`}
            onClick={() => handleCommunicationTypeSelect("voice")}
          >
            <Phone size={16} />
            <span>Voice</span>
          </Button>
          <Button
            variant="outline"
            className={`flex items-center justify-center gap-2 ${
              selectedCommunicationType === "message" 
                ? "bg-booking-secondary text-white border-booking-secondary" 
                : "bg-white dark:bg-gray-800"
            }`}
            onClick={() => handleCommunicationTypeSelect("message")}
          >
            <MessageSquare size={16} />
            <span>Message</span>
          </Button>
        </div>
        
        {/* Date selection */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {expert.availability.dates.map((date, index) => (
            <div 
              key={index}
              className={`cursor-pointer rounded-lg text-center p-2 ${
                selectedDate === date.day
                  ? "bg-booking-secondary text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
              onClick={() => handleDateSelect(date.day)}
            >
              <div className="text-xs mb-1">{date.day}</div>
              <div className="font-bold">{date.date}</div>
              {date.label && (
                <div className="text-xs mt-1 bg-white/20 rounded-full px-1">
                  {date.label}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Time slot selection */}
        <div className="grid grid-cols-3 gap-2">
          {expert.availability.timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`cursor-pointer border rounded-lg py-2 px-3 text-center ${
                selectedTimeSlot === slot
                  ? "border-booking-secondary text-booking-secondary"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => handleTimeSlotSelect(slot)}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent reviews section */}
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-3">Recent Reviews</h2>
        <div className="space-y-3">
          {expert.clientReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.name}</div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Book consultation button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Button 
          className="w-full bg-booking-secondary"
          onClick={handleBookConsultation}
        >
          Book Consultation
        </Button>
      </div>
    </div>
  );
};

export default ExpertProfile;
