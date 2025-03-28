
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, DollarSign, Users, Star, Bell, Settings, MessageSquare } from "lucide-react";

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const { user, isExpert } = useAuth();

  useEffect(() => {
    if (!isExpert) {
      toast.error("Only experts can access this dashboard");
      navigate("/profile");
    }
  }, [isExpert, navigate]);

  if (!isExpert) return null;

  const upcomingBookings = [
    { 
      id: 1, 
      clientName: "Sarah Johnson", 
      date: "Apr 28, 2023", 
      time: "10:00 AM", 
      duration: 60,
      status: "confirmed",
      serviceType: "Consultation"
    },
    { 
      id: 2, 
      clientName: "Michael Chen", 
      date: "Apr 30, 2023", 
      time: "2:00 PM", 
      duration: 30,
      status: "pending",
      serviceType: "Quick Advice"
    }
  ];

  const stats = [
    { title: "Total Clients", value: 26, icon: <Users size={20} /> },
    { title: "Avg. Rating", value: "4.8", icon: <Star size={20} /> },
    { title: "This Month", value: "$1,240", icon: <DollarSign size={20} /> },
    { title: "Total Hours", value: "128", icon: <Clock size={20} /> },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background">
            <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
            <AvatarFallback className="text-lg">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
            <p className="text-muted-foreground">Expert Dashboard</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Availability
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Upcoming Bookings
            </CardTitle>
            <CardDescription>Your scheduled sessions with clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{booking.clientName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{booking.date} • {booking.time} • {booking.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                        {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-10 w-10 mb-2" />
                  <p>No upcoming bookings</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Bookings</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your expert profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Update Pricing
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Templates
            </Button>
          </CardContent>
          
          <CardHeader className="pt-6">
            <CardTitle>Performance</CardTitle>
            <CardDescription>Your activity metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Response Rate</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-booking-secondary h-2 rounded-full" style={{ width: "98%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Completion Rate</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-booking-secondary h-2 rounded-full" style={{ width: "95%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertDashboard;
