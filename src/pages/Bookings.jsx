import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
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
  Info,
  Loader
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
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const Bookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const currentDate = new Date().toISOString();
        
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('bookings')
          .select(`
            id,
            expert_id,
            client_id,
            client_name,
            expert_name,
            expert_specialty,
            date,
            time,
            duration,
            status,
            location,
            price,
            notes,
            service_type,
            created_at,
            expert_image
          `)
          .eq('client_id', user.id)
          .gte('date', currentDate)
          .order('date', { ascending: true });
        
        const { data: pastData, error: pastError } = await supabase
          .from('bookings')
          .select(`
            id,
            expert_id,
            client_id,
            client_name,
            expert_name,
            expert_specialty,
            date,
            time,
            duration,
            status,
            location,
            price,
            notes,
            service_type,
            created_at,
            expert_image,
            rating,
            review,
            cancellation_reason,
            refund_status
          `)
          .eq('client_id', user.id)
          .lt('date', currentDate)
          .order('date', { ascending: false });
        
        if (upcomingError || pastError) {
          console.error("Error fetching bookings:", upcomingError || pastError);
          toast.error("Failed to load your bookings");
          
          setBookings({
            upcoming: [
              {
                id: "1",
                expertName: "Dr. Sarah Johnson",
                specialty: "Tax Consultant",
                date: "June 12, 2023",
                time: "2:30 PM",
                duration: 60,
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
                duration: 30,
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
                duration: 90,
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
                duration: 60,
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
                duration: 45,
                location: "Virtual",
                status: "cancelled",
                price: "$150",
                cancellationReason: "Expert unavailable due to emergency",
                refundStatus: "Processed on May 16, 2023",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
              },
            ]
          });
        } else {
          const formatBookings = (bookingsData) => {
            return bookingsData?.map(booking => ({
              id: booking.id,
              expertName: booking.expert_name || "Expert",
              specialty: booking.expert_specialty || "Consultant",
              date: new Date(booking.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }),
              time: booking.time || "12:00 PM",
              duration: booking.duration || 60,
              location: booking.location || "Virtual",
              status: booking.status || "pending",
              price: booking.price ? `$${booking.price}` : "$0",
              notes: booking.notes || "",
              image: booking.expert_image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
              rating: booking.rating,
              review: booking.review,
              cancellationReason: booking.cancellation_reason,
              refundStatus: booking.refund_status,
              expertId: booking.expert_id
            })) || [];
          };
          
          setBookings({
            upcoming: formatBookings(upcomingData),
            past: formatBookings(pastData)
          });
        }
      } catch (error) {
        console.error("Error in fetchBookings:", error);
        toast.error("Failed to load bookings data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id]);

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

  const handleCancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancellation_reason: 'Cancelled by client'
        })
        .eq('id', bookingId);
      
      if (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking");
        return;
      }
      
      toast.success("Booking cancelled successfully");
      
      setBookings(prev => {
        const updatedUpcoming = prev.upcoming.map(booking => 
          booking.id === bookingId 
            ? {...booking, status: 'cancelled', cancellationReason: 'Cancelled by client'} 
            : booking
        );
        
        return {
          ...prev,
          upcoming: updatedUpcoming
        };
      });
    } catch (error) {
      console.error("Error in handleCancelBooking:", error);
      toast.error("An error occurred while cancelling the booking");
    }
  };

  const handleLeaveReview = (bookingId) => {
    toast.info("Review functionality will be implemented soon");
  };

  const LoadingBookingCard = () => (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="w-1/4 sm:w-1/5">
          <Skeleton className="h-full" />
        </div>
        <CardContent className="w-3/4 sm:w-4/5 p-4">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-24" />
          </div>
          
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="page-container animate-fade-in pb-20">
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your appointments with experts</p>
      </section>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, index) => (
              <LoadingBookingCard key={`loading-upcoming-${index}`} />
            ))
          ) : bookings.upcoming.length > 0 ? (
            bookings.upcoming.map((booking) => (
              <Dialog key={booking.id}>
                <DialogTrigger asChild>
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Expert";
                          }}
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
                            {booking.time} ({booking.duration} min)
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
                </DialogTrigger>
                
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Expert";
                        }}
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
                        <span>{booking.duration} min</span>
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
                        <Button variant="destructive" 
                          onClick={() => handleCancelBooking(booking.id)}>
                          Cancel
                        </Button>
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
          {isLoading ? (
            Array(2).fill(0).map((_, index) => (
              <LoadingBookingCard key={`loading-past-${index}`} />
            ))
          ) : bookings.past.length > 0 ? (
            bookings.past.map((booking) => (
              <Dialog key={booking.id}>
                <DialogTrigger asChild>
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Expert";
                          }}
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
                            {booking.time} ({booking.duration} min)
                          </div>
                        </div>
                        
                        {booking.status === "completed" && booking.rating && (
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
                </DialogTrigger>
                
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Expert";
                        }}
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
                        <span>{booking.duration} min</span>
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
                        <div className="mb-2">{renderStars(booking.rating || 0)}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.review}</p>
                      </div>
                    )}
                    
                    {booking.status === "cancelled" && (
                      <div className="pt-2 border-t">
                        <h4 className="font-medium mb-1">Cancellation Details:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Reason: {booking.cancellationReason || "No reason provided"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Refund: {booking.refundStatus || "Not applicable"}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter className="sm:justify-between">
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    
                    <div className="flex space-x-2">
                      {booking.status === "completed" && !booking.review && (
                        <Button onClick={() => handleLeaveReview(booking.id)}>
                          Leave Review
                        </Button>
                      )}
                      
                      {booking.status === "completed" && (
                        <Button variant="outline">Download Receipt</Button>
                      )}
                      
                      {booking.status === "cancelled" && booking.expertId && (
                        <Button onClick={() => navigate(`/expert/${booking.expertId}`)}>
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
