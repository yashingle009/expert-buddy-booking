
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Clock, DollarSign, Users, Star, Bell, Settings, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const { user, isExpert } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    responseRate: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (!isExpert) {
      toast.error("Only experts can access this dashboard");
      navigate("/profile");
    }
  }, [isExpert, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch upcoming bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            client_name,
            client_id,
            date,
            time,
            duration,
            status,
            service_type,
            created_at
          `)
          .eq('expert_id', user.id)
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(5);
        
        if (bookingsError) {
          console.error("Error fetching bookings:", bookingsError);
          toast.error("Failed to load bookings data");
          
          // Use placeholder data if no bookings table exists
          setUpcomingBookings([
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
          ]);
        } else {
          // Format the booking data
          const formattedBookings = bookingsData?.map(booking => ({
            id: booking.id,
            clientName: booking.client_name || "Client",
            date: new Date(booking.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            time: booking.time || "12:00 PM",
            duration: booking.duration || 60,
            status: booking.status || "pending",
            serviceType: booking.service_type || "Consultation"
          })) || [];
          
          setUpcomingBookings(formattedBookings.length > 0 ? formattedBookings : []);
        }

        // Fetch total clients count
        const { count: clientsCount, error: clientsCountError } = await supabase
          .from('bookings')
          .select('client_id', { count: 'exact', head: true })
          .eq('expert_id', user.id)
          .not('client_id', 'is', null);

        // Fetch average rating
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('expert_id', user.id);

        let avgRating = 0;
        if (!ratingsError && ratingsData && ratingsData.length > 0) {
          avgRating = (ratingsData.reduce((sum, review) => sum + review.rating, 0) / ratingsData.length).toFixed(1);
        }

        // Fetch this month's earnings
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const { data: earningsData, error: earningsError } = await supabase
          .from('payments')
          .select('amount')
          .eq('expert_id', user.id)
          .gte('created_at', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`);

        let monthlyEarnings = 0;
        if (!earningsError && earningsData) {
          monthlyEarnings = earningsData.reduce((sum, payment) => sum + payment.amount, 0);
        }

        // Fetch total hours
        const { data: hoursData, error: hoursError } = await supabase
          .from('bookings')
          .select('duration')
          .eq('expert_id', user.id)
          .eq('status', 'completed');

        let totalHours = 0;
        if (!hoursError && hoursData) {
          totalHours = Math.round(hoursData.reduce((sum, booking) => sum + (booking.duration || 0), 0) / 60);
        }

        // Set stats based on fetched data or use fallbacks if tables don't exist
        if (clientsCountError || ratingsError || earningsError || hoursError) {
          console.log("Some stats tables don't exist yet, using placeholder data");
          
          // Check if expert_stats table exists as a fallback
          const { data: statsData, error: statsError } = await supabase
            .from('expert_stats')
            .select('*')
            .eq('expert_id', user.id)
            .single();
          
          if (!statsError && statsData) {
            setStats([
              { title: "Total Clients", value: statsData?.total_clients || 0, icon: <Users size={20} /> },
              { title: "Avg. Rating", value: statsData?.average_rating?.toFixed(1) || "0.0", icon: <Star size={20} /> },
              { title: "This Month", value: `$${statsData?.earnings_this_month || 0}`, icon: <DollarSign size={20} /> },
              { title: "Total Hours", value: statsData?.total_hours?.toString() || "0", icon: <Clock size={20} /> },
            ]);
            
            setMetrics({
              responseRate: statsData?.response_rate || 0,
              completionRate: statsData?.completion_rate || 0
            });
          } else {
            // Use default values if no stats are available
            setStats([
              { title: "Total Clients", value: 0, icon: <Users size={20} /> },
              { title: "Avg. Rating", value: "0.0", icon: <Star size={20} /> },
              { title: "This Month", value: "$0", icon: <DollarSign size={20} /> },
              { title: "Total Hours", value: "0", icon: <Clock size={20} /> },
            ]);
          }
        } else {
          // Use actual fetched values
          setStats([
            { title: "Total Clients", value: clientsCount || 0, icon: <Users size={20} /> },
            { title: "Avg. Rating", value: avgRating || "0.0", icon: <Star size={20} /> },
            { title: "This Month", value: `$${monthlyEarnings}`, icon: <DollarSign size={20} /> },
            { title: "Total Hours", value: totalHours.toString(), icon: <Clock size={20} /> },
          ]);
        }
        
        // Fetch expert performance metrics
        const { data: performanceData, error: performanceError } = await supabase
          .from('expert_performance')
          .select('response_rate, completion_rate')
          .eq('expert_id', user.id)
          .single();
          
        if (!performanceError && performanceData) {
          setMetrics({
            responseRate: performanceData.response_rate || 0,
            completionRate: performanceData.completion_rate || 0
          });
        } else {
          // Calculate response rate from messages if possible
          const { data: messagesData, error: messagesError } = await supabase
            .from('messages')
            .select('*')
            .eq('recipient_id', user.id);
            
          if (!messagesError && messagesData) {
            const totalMessages = messagesData.length;
            const respondedMessages = messagesData.filter(msg => msg.is_responded).length;
            const responseRate = totalMessages > 0 ? Math.round((respondedMessages / totalMessages) * 100) : 0;
            
            // Calculate completion rate from bookings
            const { data: allBookings, error: allBookingsError } = await supabase
              .from('bookings')
              .select('*')
              .eq('expert_id', user.id)
              .lt('date', new Date().toISOString());
              
            if (!allBookingsError && allBookings) {
              const totalPastBookings = allBookings.length;
              const completedBookings = allBookings.filter(booking => booking.status === 'completed').length;
              const completionRate = totalPastBookings > 0 ? Math.round((completedBookings / totalPastBookings) * 100) : 0;
              
              setMetrics({
                responseRate: responseRate,
                completionRate: completionRate
              });
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchDashboardData:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    if (isExpert && user?.id) {
      fetchDashboardData();
    }
  }, [isExpert, user?.id]);

  if (!isExpert) return null;

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
        {isLoading ? (
          // Loading skeletons for stats
          Array(4).fill(0).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual stats content
          stats.map((stat, index) => (
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
          ))
        )}
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
              {isLoading ? (
                // Loading skeletons for bookings
                Array(2).fill(0).map((_, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ))
              ) : upcomingBookings.length > 0 ? (
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
            <Button variant="outline" className="w-full" onClick={() => navigate("/bookings")}>View All Bookings</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your expert profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/profile")}>
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
              {isLoading ? (
                // Loading skeletons for metrics
                <>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Rate</span>
                    <span className="font-medium">{metrics.responseRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-booking-secondary h-2 rounded-full" style={{ width: `${metrics.responseRate}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">{metrics.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-booking-secondary h-2 rounded-full" style={{ width: `${metrics.completionRate}%` }}></div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertDashboard;
