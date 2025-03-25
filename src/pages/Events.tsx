
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import EventCard from "@/components/ui/EventCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getEvents, Event } from "@/services/api";
import Loader from "@/components/ui/Loader";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );

    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-accent py-12">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold">
                Discover Events
              </h1>
              <p className="mt-3 text-muted-foreground">
                Find and book tickets for the best events on campus
              </p>
              
              <div className="relative mt-6 max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Events Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader size={40} text="Loading events..." />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium">No events found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or check back later for new events.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-scale-in" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
