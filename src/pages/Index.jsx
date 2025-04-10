
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Calendar, 
  Star, 
  ArrowRight,
  UserCircle2,
  Clock,
  MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [featuredExperts, setFeaturedExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use mock data instead of Supabase for featured experts
  useEffect(() => {
    const fetchFeaturedExperts = async () => {
      try {
        setIsLoading(true);
        
        // Mock expert data
        const mockExperts = [
          {
            id: "1",
            name: "Sarah Johnson",
            specialty: "Tax Consultant",
            rating: 4.9,
            reviews: 124,
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
          },
          {
            id: "2",
            name: "Mark Williams",
            specialty: "Business Advisor",
            rating: 4.7,
            reviews: 89,
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
          },
          {
            id: "3",
            name: "Emily Chen",
            specialty: "Immigration Attorney",
            rating: 4.8,
            reviews: 56,
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
          }
        ];
        
        setFeaturedExperts(mockExperts);
      } catch (error) {
        console.error("Error in fetching featured experts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedExperts();
  }, []);

  // Mock data for categories
  const categories = [
    { id: "tax", name: "Tax Consultants", icon: "💼" },
    { id: "legal", name: "Legal Advisors", icon: "⚖️" },
    { id: "finance", name: "Financial Advisors", icon: "📊" },
    { id: "career", name: "Career Coaches", icon: "🚀" },
    { id: "life", name: "Life Coaches", icon: "🧠" },
    { id: "realestate", name: "Real Estate Advisors", icon: "🏠" }
  ];

  // Mock data for recent bookings
  const recentBookings = [
    {
      id: "1",
      expertName: "Mark Williams",
      service: "Legal Consultation",
      date: "Tomorrow, 10:00 AM",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
    toast.success(`Exploring ${categories.find(c => c.id === categoryId).name}`);
  };

  const handleExpertClick = (expertId) => {
    navigate(`/expert/${expertId}`);
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Hero section with search */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find an Expert</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for experts or services..."
            className="input-field pl-12"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </section>

      {/* Categories section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Categories</h2>
          <button 
            onClick={() => navigate("/categories")}
            className="text-booking-secondary flex items-center text-sm font-medium"
          >
            View all <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.slice(0, 6).map((category) => (
            <button 
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="neo-card p-4 flex flex-col items-center justify-center aspect-square transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent bookings section (shows only if there are recent bookings) */}
      {recentBookings.length > 0 && (
        <section className="mb-8">
          <h2 className="section-title">Upcoming Session</h2>
          <Card className="float-card">
            <CardContent className="p-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4">
                  <img 
                    src={booking.image} 
                    alt={booking.expertName} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.service}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{booking.expertName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{booking.date}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate("/bookings")}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Details
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Featured experts section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Featured Experts</h2>
          <button
            onClick={() => navigate("/experts")} 
            className="text-booking-secondary flex items-center text-sm font-medium"
          >
            View all <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            // Show loading skeletons if loading
            [1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-200 dark:bg-gray-700 w-16 h-16 rounded-full animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded animate-pulse" />
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded animate-pulse" />
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/4 rounded animate-pulse" />
                  </div>
                </div>
              </Card>
            ))
          ) : featuredExperts.length > 0 ? (
            featuredExperts.map((expert) => (
              <div 
                key={expert.id}
                onClick={() => handleExpertClick(expert.id)}
                className="float-card p-4 flex items-center space-x-4 cursor-pointer"
              >
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{expert.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{expert.specialty}</p>
                  <div className="flex items-center mt-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm font-medium">{expert.rating}</span>
                    <span className="ml-1 text-xs text-gray-500">({expert.reviews} reviews)</span>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-400" />
              </div>
            ))
          ) : (
            <Card className="p-6 text-center">
              <p>No featured experts available at the moment.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
