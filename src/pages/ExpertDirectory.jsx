
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useFirebase } from "@/context/FirebaseContext";
import ExpertCard from "@/components/expert/ExpertCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, SlidersHorizontal } from "lucide-react";

const ExpertDirectory = () => {
  const navigate = useNavigate();
  const { firestore } = useFirebase();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch experts from Firestore
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const expertsCollection = collection(firestore, "experts");
        const expertSnapshot = await getDocs(expertsCollection);
        
        const expertsList = expertSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log("Fetched experts:", expertsList);
        setExperts(expertsList);
      } catch (error) {
        console.error("Error fetching experts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperts();
  }, [firestore]);
  
  // Filter experts based on search query and specialization
  const filteredExperts = experts.filter(expert => {
    const matchesQuery = searchQuery === "" || 
      `${expert.firstName} ${expert.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expert.specialization && expert.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (expert.bio && expert.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesSpecialization = specialization === "" || 
      expert.specialization === specialization;
      
    return matchesQuery && matchesSpecialization;
  });
  
  // Get unique specializations for filter dropdown
  const specializations = [...new Set(experts.map(expert => expert.specialization).filter(Boolean))];
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find an Expert</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Browse our directory of verified experts ready to help you.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, specialization, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={18} />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSpecialization("");
                  }}
                  className="w-full md:w-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-96 border rounded-lg animate-pulse bg-gray-100 dark:bg-gray-800"></div>
          ))}
        </div>
      ) : filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No experts found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSpecialization("");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpertDirectory;
