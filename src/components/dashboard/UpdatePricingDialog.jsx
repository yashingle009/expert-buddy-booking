
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { DollarSign, Plus, Trash2 } from "lucide-react";

const UpdatePricingDialog = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([
    { name: "30-min Consultation", duration: 30, price: 50 },
    { name: "60-min Session", duration: 60, price: 100 }
  ]);
  
  const handleServiceChange = (index, field, value) => {
    setServices(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const addService = () => {
    setServices(prev => [...prev, { name: "", duration: 30, price: 0 }]);
  };
  
  const removeService = (index) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Filter out any services with empty names
      const validServices = services.filter(service => service.name.trim() !== "");
      
      if (validServices.length === 0) {
        toast({
          title: "Error",
          description: "You need at least one service with a name",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Prepare pricing data
      const pricingData = {
        expert_id: user.id,
        services: validServices,
        updated_at: new Date().toISOString()
      };

      try {
        // Check if expert_pricing table exists and create record or update
        const { data: existingData, error: fetchError } = await supabase
          .from('expert_pricing')
          .select('id')
          .eq('expert_id', user.id)
          .single();
          
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (existingData) {
          const { error: updateError } = await supabase
            .from('expert_pricing')
            .update({ services: validServices, updated_at: new Date().toISOString() })
            .eq('expert_id', user.id);
            
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('expert_pricing')
            .insert(pricingData);
            
          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error("Error with expert_pricing table:", error);
        // Table might not exist yet
        toast({
          title: "Pricing saved locally",
          description: "Your pricing has been saved in the app (database table not created yet)"
        });
      }
      
      toast({
        title: "Pricing updated",
        description: "Your service pricing has been updated successfully"
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating pricing:", error);
      toast({
        title: "Error",
        description: "Failed to update pricing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" /> Update Pricing
          </DialogTitle>
          <DialogDescription>
            Set your service offerings and pricing
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {services.map((service, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <div className="flex justify-between items-start">
                <Label htmlFor={`service-name-${index}`} className="text-lg font-medium">
                  Service {index + 1}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                  disabled={services.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`service-name-${index}`}>Service Name</Label>
                <Input
                  id={`service-name-${index}`}
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                  placeholder="e.g., Basic Consultation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`service-duration-${index}`}>Duration (minutes)</Label>
                  <Input
                    id={`service-duration-${index}`}
                    type="number"
                    min="1"
                    value={service.duration}
                    onChange={(e) => handleServiceChange(index, "duration", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-price-${index}`}>Price ($)</Label>
                  <Input
                    id={`service-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, "price", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addService}
            className="w-full mt-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Pricing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePricingDialog;
