
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getEvent, Event, purchaseTicket } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handlePurchaseTicket = async () => {
    if (!isAuthenticated) {
      toast("Please log in to purchase tickets", {
        description: "You need to be logged in to continue",
        action: {
          label: "Login",
          onClick: () => navigate("/login")
        }
      });
      return;
    }

    if (!event) return;
    
    setIsPurchasing(true);
    
    try {
      const ticket = await purchaseTicket(event.id);
      
      if (ticket) {
        toast.success("Ticket purchased successfully");
        navigate("/my-tickets");
      } else {
        toast.error("Failed to purchase ticket");
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      toast.error("Failed to purchase ticket");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader size={40} text="Loading event details..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The event you're looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate("/events")}>
              Browse All Events
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Event Image Header */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-accent">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-20">
            <div className="container">
              <Badge 
                variant="outline" 
                className="bg-primary/80 text-white border-primary mb-3"
              >
                ${event.price.toFixed(2)}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-shadow mb-2">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Event Details */}
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">About this event</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Location</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">{event.location}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Directions will be provided in the ticket confirmation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Ticket Purchase Sidebar */}
            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex items-center text-sm space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm space-x-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{event.available_seats} seats available</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Price per ticket</span>
                      <span className="font-semibold">${event.price.toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handlePurchaseTicket}
                      disabled={isPurchasing}
                    >
                      {isPurchasing ? (
                        <Loader size={20} className="mx-auto" />
                      ) : (
                        <>
                          <TicketIcon className="mr-2 h-4 w-4" /> Get Tickets
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Secure checkout. You'll receive a QR code for entry.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetail;
