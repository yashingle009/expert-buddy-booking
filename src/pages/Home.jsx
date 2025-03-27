
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, Star, MapPin, Clock, ChevronRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const featuredExperts = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Tax Consultant",
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "New York",
      availableToday: true,
    },
    {
      id: "2",
      name: "Mark Williams",
      specialty: "Business Advisor",
      rating: 4.8,
      reviews: 93,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "Chicago",
      availableToday: true,
    },
    {
      id: "3",
      name: "Rebecca Chen",
      specialty: "Immigration Lawyer",
      rating: 4.7,
      reviews: 86,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "San Francisco",
      availableToday: false,
    },
    {
      id: "4",
      name: "James Peterson",
      specialty: "Financial Advisor",
      rating: 4.9,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "Boston",
      availableToday: true,
    },
  ];

  const categories = [
    { id: "1", name: "Legal", icon: "⚖️", count: 124 },
    { id: "2", name: "Finance", icon: "💼", count: 98 },
    { id: "3", name: "Tax", icon: "📊", count: 76 },
    { id: "4", name: "Business", icon: "🏢", count: 142 },
    { id: "5", name: "Immigration", icon: "🌎", count: 53 },
    { id: "6", name: "Real Estate", icon: "🏠", count: 87 },
  ];

  const recentBookings = [
    {
      id: "1",
      expertName: "Dr. Sarah Johnson",
      specialty: "Tax Consultant",
      date: "June 12, 2023",
      time: "2:30 PM",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
    {
      id: "2",
      expertName: "Mark Williams",
      specialty: "Business Advisor",
      date: "June 5, 2023",
      time: "10:00 AM",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hello, John</h1>
        <p className="text-gray-600 dark:text-gray-400">Find and book expert services</p>
      </section>

      {/* Search Bar */}
      <section className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search for experts, services..."
            className="input-field pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Mic size={20} className="text-booking-secondary" />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Categories</h2>
          <button 
            onClick={() => navigate("/categories")}
            className="text-booking-secondary flex items-center"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => navigate("/categories")}
              className="aspect-square neo-card p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <div className="text-sm font-medium">{category.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{category.count} experts</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Experts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Featured Experts</h2>
          <button className="text-booking-secondary flex items-center">
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto no-scrollbar scroll-snap-x">
          <div className="flex space-x-4 pb-4">
            {featuredExperts.map((expert) => (
              <div 
                key={expert.id}
                onClick={() => navigate(`/expert/${expert.id}`)}
                className="w-72 shrink-0 scroll-snap-center float-card overflow-hidden cursor-pointer"
              >
                <div className="relative h-36">
                  <img 
                    src={expert.image} 
                    alt={expert.name} 
                    className="w-full h-full object-cover"
                  />
                  {expert.availableToday && (
                    <div className="absolute top-2 right-2 bg-booking-accent text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Clock size={12} className="mr-1" />
                      Available Today
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{expert.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialty}</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{expert.rating}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({expert.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={14} className="mr-1" />
                    {expert.location}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${expert.id}`);
                    }}
                    className="mt-3 w-full btn-primary py-2"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Bookings</h2>
          <button 
            onClick={() => navigate("/bookings")}
            className="text-booking-secondary flex items-center"
          >
            See All <ChevronRight size={16} />
          </button>
        </div>
        
        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div 
                key={booking.id}
                className="neo-card p-4 flex space-x-4"
              >
                <img 
                  src={booking.image} 
                  alt={booking.expertName} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{booking.expertName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.specialty}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "Completed" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} className="mr-1" />
                    {booking.date} at {booking.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-card p-8 flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-bold">No Recent Bookings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
              You haven't made any bookings yet
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

      {/* Top Rated Experts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Top Rated Experts</h2>
          <button className="text-booking-secondary flex items-center">
            See All <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {featuredExperts.slice(0, 3).map((expert) => (
            <div 
              key={expert.id}
              onClick={() => navigate(`/expert/${expert.id}`)}
              className="neo-card p-4 flex space-x-4 cursor-pointer"
            >
              <img 
                src={expert.image} 
                alt={expert.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{expert.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialty}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{expert.rating}</span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={14} className="mr-1" />
                    {expert.location}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${expert.id}`);
                    }}
                    className="text-booking-secondary text-sm font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
