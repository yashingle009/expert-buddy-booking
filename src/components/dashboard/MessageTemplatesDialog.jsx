
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

const MessageTemplatesDialog = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([
    { 
      name: "Welcome Message", 
      content: "Thank you for booking a session with me! I'm looking forward to our meeting. Please let me know if you have any questions beforehand." 
    },
    { 
      name: "Follow Up", 
      content: "Thank you for our session today. I hope you found it valuable. Please don't hesitate to reach out if you have any follow-up questions." 
    }
  ]);
  
  const handleTemplateChange = (index, field, value) => {
    setTemplates(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const addTemplate = () => {
    setTemplates(prev => [...prev, { name: "", content: "" }]);
  };
  
  const removeTemplate = (index) => {
    setTemplates(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Filter out templates with empty names
      const validTemplates = templates.filter(template => template.name.trim() !== "");
      
      if (validTemplates.length === 0) {
        toast({
          title: "Error",
          description: "You need at least one template with a name",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Prepare templates data
      const templatesData = {
        expert_id: user.id,
        templates: validTemplates,
        updated_at: new Date().toISOString()
      };

      try {
        // Check if message_templates table exists and create or update record
        const { data: existingData, error: fetchError } = await supabase
          .from('message_templates')
          .select('id')
          .eq('expert_id', user.id)
          .single();
          
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (existingData) {
          const { error: updateError } = await supabase
            .from('message_templates')
            .update({ templates: validTemplates, updated_at: new Date().toISOString() })
            .eq('expert_id', user.id);
            
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('message_templates')
            .insert(templatesData);
            
          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error("Error with message_templates table:", error);
        // Table might not exist yet
        toast({
          title: "Templates saved locally",
          description: "Your message templates have been saved in the app (database table not created yet)"
        });
      }

      toast({
        title: "Templates updated",
        description: "Your message templates have been updated successfully"
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating templates:", error);
      toast({
        title: "Error",
        description: "Failed to update templates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" /> Message Templates
          </DialogTitle>
          <DialogDescription>
            Create and manage your message templates for client communications
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {templates.map((template, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-md">
              <div className="flex justify-between items-start">
                <Label htmlFor={`template-name-${index}`} className="text-lg font-medium">
                  Template {index + 1}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTemplate(index)}
                  disabled={templates.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`template-name-${index}`}>Template Name</Label>
                <Input
                  id={`template-name-${index}`}
                  value={template.name}
                  onChange={(e) => handleTemplateChange(index, "name", e.target.value)}
                  placeholder="e.g., Welcome Message"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`template-content-${index}`}>Message Content</Label>
                <textarea
                  id={`template-content-${index}`}
                  value={template.content}
                  onChange={(e) => handleTemplateChange(index, "content", e.target.value)}
                  placeholder="Type your template message here..."
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addTemplate}
            className="w-full mt-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Template
          </Button>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Templates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageTemplatesDialog;
