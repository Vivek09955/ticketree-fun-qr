
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, TicketX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QRTicket from "@/components/ui/QRTicket";
import { getUserTickets, Ticket } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";

const MyTickets = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const fetchTickets = async () => {
      try {
        const data = await getUserTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [isAuthenticated, authLoading, navigate]);

  // Group tickets by upcoming and past events
  const currentDate = new Date();
  const upcomingTickets = tickets.filter(ticket => 
    ticket.event && new Date(ticket.event.date) >= currentDate
  );
  const pastTickets = tickets.filter(ticket => 
    ticket.event && new Date(ticket.event.date) < currentDate
  );

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader size={40} text="Loading your tickets..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-primary" />
            My Tickets
          </h1>
          
          {tickets.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <TicketX className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't purchased any tickets yet.
                </p>
                <Button onClick={() => navigate("/events")}>
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {upcomingTickets.length > 0 && (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>
                        Your tickets for upcoming events
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {upcomingTickets.map((ticket) => (
                        <QRTicket key={ticket.id} ticket={ticket} />
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {pastTickets.length > 0 && (
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Past Events</CardTitle>
                      <CardDescription>
                        Your tickets for past events
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {pastTickets.map((ticket) => (
                        <QRTicket 
                          key={ticket.id} 
                          ticket={ticket} 
                          className="opacity-75"
                        />
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyTickets;
