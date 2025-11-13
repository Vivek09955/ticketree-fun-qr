
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";
import { Ticket as TicketType } from "@/services/api";

interface QRTicketProps {
  ticket: TicketType;
  className?: string;
}

const QRTicket = ({ ticket, className = "" }: QRTicketProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  useEffect(() => {
    // Generate QR code
    const generateQR = async () => {
      try {
        // In a real app, you would use a proper QR code generator
        // For now, we'll use a placeholder service
        const qrCodeData = encodeURIComponent(ticket.qr_code_data);
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeData}`);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    
    generateQR();
  }, [ticket.qr_code_data]);
  
  if (!ticket.event) {
    return null;
  }

  // Format the date
  const formattedDate = new Date(ticket.event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2 bg-primary/5">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Event Ticket</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="Ticket QR Code"
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-accent animate-pulse">
                Loading QR...
              </div>
            )}
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Ticket #{ticket.id}
            </p>
          </div>
          
          <div className="flex-grow space-y-4">
            <h3 className="text-xl font-bold">{ticket.event.title}</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{ticket.event.time}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{ticket.event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground bg-primary/5 justify-between">
        <span>Purchase Date: {new Date(ticket.purchase_date).toLocaleDateString()}</span>
        <span className="font-medium">${Number(ticket.event.price).toFixed(2)}</span>
      </CardFooter>
    </Card>
  );
};

export default QRTicket;
