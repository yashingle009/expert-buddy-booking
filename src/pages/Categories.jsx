
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Star, MapPin, ChevronDown, X } from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    experience: "Any",
    priceRange: "Any",
    rating: "Any",
  });
  
  // Mock data
  const categories = [
    { id: "all", name: "All", icon: "🔍", count: 580 },
    { id: "1", name: "Legal", icon: "⚖️", count: 124 },
    { id: "2", name: "Finance", icon: "💼", count: 98 },
    { id: "3", name: "Tax", icon: "📊", count: 76 },
    { id: "4", name: "Business", icon: "🏢", count: 142 },
    { id: "5", name: "Immigration", icon: "🌎", count: 53 },
    { id: "6", name: "Real Estate", icon: "🏠", count: 87 },
  ];

  const experts = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Tax Consultant",
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "New York",
      price: "$120/hour",
      experience: "12 years",
      category: "Tax",
    },
    {
      id: "2",
      name: "Mark Williams",
      specialty: "Business Advisor",
      rating: 4.8,
      reviews: 93,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "Chicago",
      price: "$150/hour",
      experience: "15 years",
      category: "Business",
    },
    {
      id: "3",
      name: "Rebecca Chen",
      specialty: "Immigration Lawyer",
      rating: 4.7,
      reviews: 86,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "San Francisco",
      price: "$180/hour",
      experience: "8 years",
      category: "Immigration",
    },
    {
      id: "4",
      name: "James Peterson",
      specialty: "Financial Advisor",
      rating: 4.9,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "Boston",
      price: "$130/hour",
      experience: "10 years",
      category: "Finance",
    },
    {
      id: "5",
      name: "Emily Rodriguez",
      specialty: "Estate Planning Attorney",
      rating: 4.6,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "Miami",
      price: "$200/hour",
      experience: "14 years",
      category: "Legal",
    },
    {
      id: "6",
      name: "Michael Clark",
      specialty: "Real Estate Consultant",
      rating: 4.8,
      reviews: 95,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      location: "Denver",
      price: "$110/hour",
      experience: "9 years",
      category: "Real Estate",
    },
  ];

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setFilters({
      experience: "Any",
      priceRange: "Any",
      rating: "Any",
    });
  };

  const applyFilters = () => {
    toggleFilter();
    // In a real app, this would filter the experts list
  };

  const filteredExperts = experts.filter(expert => {
    // Filter by search query
    if (searchQuery && !expert.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !expert.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== "All" && expert.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="page-container animate-fade-in pb-20">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-gray-600 dark:text-gray-400">Find experts in various fields</p>
      </section>

      {/* Search and Filter */}
      <section className="mb-6">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search experts..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={toggleFilter}
            className="btn-secondary flex items-center px-4"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-6">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex space-x-3 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.name
                    ? "bg-booking-secondary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Experts List */}
      <section>
        <h2 className="section-title">
          {selectedCategory === "All" ? "All Experts" : `${selectedCategory} Experts`}
        </h2>
        
        {filteredExperts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExperts.map((expert) => (
              <div 
                key={expert.id}
                onClick={() => navigate(`/expert/${expert.id}`)}
                className="neo-card overflow-hidden cursor-pointer"
              >
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={expert.image} 
                      alt={expert.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{expert.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialty}</p>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{expert.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={14} className="mr-1" />
                      {expert.location}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm font-medium">{expert.price}</div>
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
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-card p-8 flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold">No Experts Found</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
              Try adjusting your search or filters
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                resetFilters();
              }}
              className="mt-4 btn-primary"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Filter Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleFilter}
      />
      
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl transition-transform duration-300 ease-in-out transform ${
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Filters</h3>
            <button 
              onClick={toggleFilter}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-2">Experience</label>
              <div className="relative">
                <select 
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  className="input-field appearance-none pr-10"
                >
                  <option value="Any">Any experience</option>
                  <option value="1-5">1-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="relative">
                <select 
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="input-field appearance-none pr-10"
                >
                  <option value="Any">Any price</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200+">$200+</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="relative">
                <select 
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                  className="input-field appearance-none pr-10"
                >
                  <option value="Any">Any rating</option>
                  <option value="4+">4+ stars</option>
                  <option value="4.5+">4.5+ stars</option>
                  <option value="5">5 stars only</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-8">
            <button 
              onClick={resetFilters}
              className="flex-1 btn-secondary"
            >
              Reset
            </button>
            <button 
              onClick={applyFilters}
              className="flex-1 btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
