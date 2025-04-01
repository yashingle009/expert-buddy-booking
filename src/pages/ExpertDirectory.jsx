
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Filter, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ExpertDirectory = () => {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch experts from profiles table where is_expert is true
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_expert', true);
        
        if (error) {
          throw error;
        }
        
        console.log("Fetched experts:", data);
        setExperts(data || []);
      } catch (error) {
        console.error("Error fetching experts:", error);
        setError("Failed to load experts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const handleExpertClick = (expertId) => {
    navigate(`/expert/${expertId}`);
  };

  const renderExpertRating = (rating = 0) => {
    return (
      <div className="flex items-center">
        <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
        <span className="font-medium">{rating || "New"}</span>
      </div>
    );
  };

  // Placeholder data for experts with missing information
  const getExpertDisplay = (expert) => {
    return {
      name: expert.full_name || "Expert User",
      title: expert.title || "Professional Consultant",
      location: expert.location || "Remote",
      rating: expert.rating || 0,
      avatar: expert.avatar_url || "",
      expertise: expert.expertise || "Consulting"
    };
  };

  // Filter experts based on search query
  const filteredExperts = experts.filter(expert => {
    if (searchQuery) {
      const expertData = getExpertDisplay(expert);
      return expertData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             expertData.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             expertData.expertise?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="page-container animate-fade-in py-8">
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Expert Directory</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with professionals in various fields
        </p>
      </section>

      {/* Search and Filter Bar */}
      <section className="mb-6">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search experts..."
              className="input-field pl-10 w-full p-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-bold text-red-500 mb-2">Error</h3>
          <p>{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      ) : filteredExperts.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No Experts Found</h3>
          {searchQuery ? (
            <p>No experts match your search criteria. Try a different search term.</p>
          ) : (
            <p>There are currently no experts available. Check back later!</p>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExperts.map((expert) => {
            const displayData = getExpertDisplay(expert);
            
            return (
              <Card 
                key={expert.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleExpertClick(expert.id)}
              >
                <div className="flex p-4">
                  <div className="mr-4">
                    <Avatar className="h-16 w-16 border-2 border-background">
                      <AvatarImage src={displayData.avatar} />
                      <AvatarFallback className="bg-booking-secondary text-white">
                        {displayData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{displayData.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {displayData.title}
                        </p>
                      </div>
                      {renderExpertRating(displayData.rating)}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={14} className="mr-1" />
                      {displayData.location}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <Badge variant="secondary">
                        {displayData.expertise}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="text-booking-secondary"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/expert/${expert.id}`);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpertDirectory;
