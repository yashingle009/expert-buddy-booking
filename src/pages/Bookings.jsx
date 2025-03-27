
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Info
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Bookings = () => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Mock data
  const bookings = {
    upcoming: [
      {
        id: "1",
        expertName: "Dr. Sarah Johnson",
        specialty: "Tax Consultant",
        date: "June 12, 2023",
        time: "2:30 PM",
        duration: "45 minutes",
        location: "Virtual",
        status: "confirmed",
        price: "$120",
        notes: "Please prepare your last year's tax documents for the session.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      },
      {
        id: "2",
        expertName: "Mark Williams",
        specialty: "Business Advisor",
        date: "June 18, 2023",
        time: "10:00 AM",
        duration: "60 minutes",
        location: "Virtual",
        status: "pending",
        price: "$150",
        notes: "Discussion about expanding your business to international markets.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      },
    ],
    past: [
      {
        id: "3",
        expertName: "Rebecca Chen",
        specialty: "Immigration Lawyer",
        date: "May 28, 2023",
        time: "1:00 PM",
        duration: "90 minutes",
        location: "Virtual",
        status: "completed",
        price: "$200",
        notes: "Visa application review and next steps discussion.",
        rating: 5,
        review: "Rebecca was extremely helpful and knowledgeable about the visa process. She answered all my questions clearly and provided excellent guidance.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      },
      {
        id: "4",
        expertName: "James Peterson",
        specialty: "Financial Advisor",
        date: "May 20, 2023",
        time: "11:30 AM",
        duration: "60 minutes",
        location: "Virtual",
        status: "completed",
        price: "$175",
        notes: "Retirement planning session. Please bring current investment portfolio details.",
        rating: 4,
        review: "James provided great advice tailored to my financial situation. I feel more confident about my retirement plan now.",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      },
      {
        id: "5",
        expertName: "Emily Rodriguez",
        specialty: "Estate Planning Attorney",
        date: "May 15, 2023",
        time: "3:00 PM",
        duration: "45 minutes",
        location: "Virtual",
        status: "cancelled",
        price: "$150",
        cancellationReason: "Expert unavailable due to emergency",
        refundStatus: "Processed on May 16, 2023",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      },
    ],
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircle2 size={16} className="mr-1" />
            <span>Confirmed</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center text-yellow-600 dark:text-yellow-400">
            <AlertCircle size={16} className="mr-1" />
            <span>Pending</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center text-booking-secondary">
            <CheckCircle2 size={16} className="mr-1" />
            <span>Completed</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <XCircle size={16} className="mr-1" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <svg 
            key={index} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={index < rating ? "currentColor" : "none"}
            stroke="currentColor"
            className={`w-4 h-4 ${
              index < rating 
                ? "text-yellow-400" 
                : "text-gray-300 dark:text-gray-600"
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container animate-fade-in pb-20">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your appointments with experts</p>
      </section>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {bookings.upcoming.length > 0 ? (
            bookings.upcoming.map((booking) => (
              <Dialog key={booking.id}>
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="flex">
                    <div className="w-1/4 sm:w-1/5">
                      <img 
                        src={booking.image} 
                        alt={booking.expertName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="w-3/4 sm:w-4/5 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{booking.expertName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{booking.specialty}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                          {booking.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                          {booking.time} ({booking.duration})
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                          {booking.location}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-medium">{booking.price}</span>
                        <div className="flex items-center text-booking-secondary">
                          <span className="text-sm font-medium mr-1">View Details</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
                
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                    <DialogDescription>
                      Details of your scheduled appointment
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={booking.image} 
                        alt={booking.expertName} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold">{booking.expertName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.specialty}</p>
                      </div>
                    </div>
                    
                    {getStatusBadge(booking.status)}
                    
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span>{booking.date}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span>{booking.time}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span>{booking.duration}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Location:</span>
                        <span>{booking.location}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className="font-medium">{booking.price}</span>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="pt-2 border-t">
                        <h4 className="font-medium mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter className="sm:justify-between">
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    
                    <div className="flex space-x-2">
                      {booking.status === "confirmed" && (
                        <Button variant="destructive">Cancel</Button>
                      )}
                      
                      {booking.status === "confirmed" && (
                        <Button>Join Session</Button>
                      )}
                      
                      {booking.status === "pending" && (
                        <Button>Confirm</Button>
                      )}
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-center mb-4">
                <Calendar size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any scheduled appointments.</p>
              <Button onClick={() => navigate("/categories")}>
                Find an Expert
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {bookings.past.length > 0 ? (
            bookings.past.map((booking) => (
              <Dialog key={booking.id}>
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="flex">
                    <div className="w-1/4 sm:w-1/5">
                      <img 
                        src={booking.image} 
                        alt={booking.expertName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="w-3/4 sm:w-4/5 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{booking.expertName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{booking.specialty}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                          {booking.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                          {booking.time} ({booking.duration})
                        </div>
                      </div>
                      
                      {booking.status === "completed" && (
                        <div className="mt-2">
                          <div className="flex items-center">
                            <span className="text-sm mr-2">Your Rating:</span>
                            {renderStars(booking.rating)}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-medium">{booking.price}</span>
                        <div className="flex items-center text-booking-secondary">
                          <span className="text-sm font-medium mr-1">View Details</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
                
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Appointment History</DialogTitle>
                    <DialogDescription>
                      Details of your past appointment
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={booking.image} 
                        alt={booking.expertName} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold">{booking.expertName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.specialty}</p>
                      </div>
                    </div>
                    
                    {getStatusBadge(booking.status)}
                    
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span>{booking.date}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span>{booking.time}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span>{booking.duration}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Location:</span>
                        <span>{booking.location}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className="font-medium">{booking.price}</span>
                      </div>
                    </div>
                    
                    {booking.status === "completed" && booking.review && (
                      <div className="pt-2 border-t">
                        <h4 className="font-medium mb-1">Your Review:</h4>
                        <div className="mb-2">{renderStars(booking.rating)}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.review}</p>
                      </div>
                    )}
                    
                    {booking.status === "cancelled" && (
                      <div className="pt-2 border-t">
                        <h4 className="font-medium mb-1">Cancellation Details:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Reason: {booking.cancellationReason}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Refund: {booking.refundStatus}</p>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter className="sm:justify-between">
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    
                    <div className="flex space-x-2">
                      {booking.status === "completed" && !booking.review && (
                        <Button>Leave Review</Button>
                      )}
                      
                      {booking.status === "completed" && (
                        <Button variant="outline">Download Receipt</Button>
                      )}
                      
                      {booking.status === "cancelled" && (
                        <Button onClick={() => navigate(`/expert/${booking.id.split('-')[0]}`)}>
                          Book Again
                        </Button>
                      )}
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-center mb-4">
                <Info size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Past Appointments</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't had any appointments yet.</p>
              <Button onClick={() => navigate("/categories")}>
                Find an Expert
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
