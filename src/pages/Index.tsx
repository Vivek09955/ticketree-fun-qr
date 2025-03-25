
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Ticket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/ui/EventCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getEvents, Event } from "@/services/api";
import Loader from "@/components/ui/Loader";

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-accent to-background py-20 overflow-hidden">
          <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="animate-slide-down">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Discover Amazing College Events
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
                  Get tickets to the hottest events on campus. Easy registration with secure QR code verification.
                </p>
              </div>
              
              <div className="pt-4 animate-slide-up animation-delay-200">
                <Link to="/events">
                  <Button size="lg" className="rounded-full px-8">
                    Browse Events <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
            <Calendar className="w-96 h-96 text-primary" />
          </div>
          <div className="absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4 opacity-20">
            <Ticket className="w-96 h-96 text-primary" />
          </div>
        </section>
        
        {/* Featured Events */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="section-heading">Featured Events</h2>
              <p className="section-subheading mx-auto">
                Discover the most popular events happening on campus
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader size={40} text="Loading events..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="animate-scale-in">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Link to="/events">
                <Button variant="outline" size="lg">
                  View All Events <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="section-heading">How It Works</h2>
              <p className="section-subheading mx-auto">
                Get tickets to your favorite campus events in just a few easy steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Events</h3>
                <p className="text-muted-foreground">
                  Explore upcoming events and find the ones that interest you
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Ticket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Tickets</h3>
                <p className="text-muted-foreground">
                  Purchase tickets securely through our platform
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Attend Event</h3>
                <p className="text-muted-foreground">
                  Show your QR code at the entrance for seamless verification
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
