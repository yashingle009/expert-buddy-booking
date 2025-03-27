
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, MoreHorizontal, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const Bookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  
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
        rating: 5,
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
        rating: 4,
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

  return (
    <div className="page-container animate-fade-in pb-20">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your appointments with experts</p>
      </section>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "upcoming"
              ? "text-booking-secondary border-b-2 border-booking-secondary" 
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`pb-2 px-4 font-medium ${
            activeTab === "past"
              ? "text-booking-secondary border-b-2 border-booking-secondary" 
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Past
        </button>
      </div>

      {/* Bookings List */}
      <section>
        {bookings[activeTab].length > 0 ? (
          <div className="space-y-4">
            {bookings[activeTab].map((booking) => (
              <div 
                key={booking.id}
                className="neo-card overflow-hidden"
              >
                <div className="flex">
                  <div className="w-1/4 sm:w-1/5">
                    <img 
                      src={booking.image} 
                      alt={booking.expertName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-3/4 sm:w-4/5 p-4">
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
                    
                    {activeTab === "upcoming" && (
                      <div className="mt-4 flex justify-between">
                        <button className="btn-secondary py-2 px-3 text-sm">
                          Reschedule
                        </button>
                        {booking.status === "confirmed" && (
                          <button className="btn-primary py-2 px-3 text-sm">
                            Join Session
                          </button>
                        )}
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    )}
                    
                    {activeTab === "past" && booking.status === "completed" && (
                      <div className="mt-4">
                        <div className="flex items-center">
                          <span className="text-sm mr-2">Your Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <svg 
                                key={index} 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill={index < booking.rating ? "currentColor" : "none"}
                                stroke="currentColor"
                                className={`w-4 h-4 ${
                                  index < booking.rating 
                                    ? "text-yellow-400" 
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <button className="mt-2 text-booking-secondary text-sm font-medium">
                          View Receipt
                        </button>
                      </div>
                    )}
                    
                    {activeTab === "past" && booking.status === "cancelled" && (
                      <div className="mt-4">
                        <button className="text-booking-secondary text-sm font-medium">
                          Book Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-card p-8 flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-bold">No {activeTab === "upcoming" ? "Upcoming" : "Past"} Bookings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
              {activeTab === "upcoming" 
                ? "You don't have any upcoming appointments" 
                : "You haven't had any appointments yet"
              }
            </p>
            <button 
              onClick={() => navigate("/categories")}
              className="mt-4 btn-primary"
            >
              Find an Expert
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Bookings;
