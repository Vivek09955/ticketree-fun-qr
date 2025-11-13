
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/services/api";

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const EventCard = ({ event, compact = false }: EventCardProps) => {
  const { id, title, description, date, time, location, price, image_url } = event;
  
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="event-card h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={image_url}
          alt={title}
          className="event-card-img"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="font-medium shadow-sm">
            ${Number(price).toFixed(2)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className={compact ? "text-xl line-clamp-1" : "text-2xl"}>
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-2.5 flex-grow">
        {!compact && (
          <p className="text-muted-foreground line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1.5 h-4 w-4" />
          <span>{formattedDate} • {time}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1.5 h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/events/${id}`} className="w-full">
          <Button className="w-full" variant={compact ? "secondary" : "default"}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
