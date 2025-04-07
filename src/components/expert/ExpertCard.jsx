
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Star } from "lucide-react";

const ExpertCard = ({ expert }) => {
  const navigate = useNavigate();
  
  // Ensure we have an expert to display
  if (!expert) return null;
  
  // Destructure expert properties with fallbacks for missing data
  const { 
    id,
    firstName = '', 
    lastName = '', 
    specialization = '', 
    rate = '', 
    experience = '',
    bio = 'No bio available',
    avatarUrl
  } = expert;
  
  // Navigate to the expert's profile page when clicked
  const handleViewProfile = () => {
    navigate(`/expert/${id}`);
  };
  
  // Calculate initials for avatar fallback
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 px-6 flex-grow">
        <div className="flex flex-col items-center mb-4">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={`${firstName} ${lastName}`} 
              className="w-20 h-20 rounded-full object-cover border-2 border-booking-secondary"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-booking-secondary text-white flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
          )}
          
          <h3 className="mt-3 text-xl font-semibold text-center">{firstName} {lastName}</h3>
          <p className="text-booking-secondary font-medium">{specialization}</p>
          
          <div className="flex items-center mt-1 gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-500 ml-1">(5.0)</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {rate && (
            <p className="text-sm">
              <strong>Rate:</strong> ${rate}/hr
            </p>
          )}
          {experience && (
            <p className="text-sm">
              <strong>Experience:</strong> {experience} years
            </p>
          )}
          <p className="text-sm line-clamp-3">{bio}</p>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-2 flex flex-col gap-2">
        <Button 
          onClick={handleViewProfile}
          className="w-full"
        >
          View Profile
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/expert/${id}?booking=true`)}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;
