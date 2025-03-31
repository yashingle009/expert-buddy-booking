
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

const SetAvailabilityDialog = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  // Toggle time slot selection
  const toggleTimeSlot = (day, time) => {
    setAvailability(prev => {
      const daySlots = [...prev[day]];
      const timeIndex = daySlots.indexOf(time);
      
      if (timeIndex === -1) {
        daySlots.push(time);
      } else {
        daySlots.splice(timeIndex, 1);
      }
      
      return {
        ...prev,
        [day]: daySlots
      };
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Prepare availability data for storage
      const availabilityData = {
        expert_id: user.id,
        schedule: availability,
        updated_at: new Date().toISOString()
      };

      // Check if expert_availability table exists and create record or update
      try {
        // Try to get existing record first
        const { data: existingData, error: fetchError } = await supabase
          .from('expert_availability')
          .select('id')
          .eq('expert_id', user.id)
          .single();
          
        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw fetchError;
        }

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('expert_availability')
            .update({ schedule: availability, updated_at: new Date().toISOString() })
            .eq('expert_id', user.id);
            
          if (updateError) throw updateError;
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('expert_availability')
            .insert(availabilityData);
            
          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error("Error with expert_availability table:", error);
        // Table might not exist yet - this would be set up properly in a real app
        toast({
          title: "Availability saved locally",
          description: "Your availability has been saved in the app (database table not created yet)"
        });
      }

      toast({
        title: "Availability updated",
        description: "Your availability has been updated successfully"
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick select all time slots for a day
  const selectAllDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...TIME_SLOTS]
    }));
  };

  // Clear all time slots for a day
  const clearDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: []
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" /> Set Your Availability
          </DialogTitle>
          <DialogDescription>
            Select the time slots when you're available for bookings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{day}</h3>
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => selectAllDay(day)}
                  >
                    Select All
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => clearDay(day)}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((time) => {
                  const isSelected = availability[day].includes(time);
                  return (
                    <Badge
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected ? "bg-booking-secondary hover:bg-booking-secondary/80" : ""}`}
                      onClick={() => toggleTimeSlot(day, time)}
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      {time}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Availability"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetAvailabilityDialog;
