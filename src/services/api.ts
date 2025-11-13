import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define types for the API responses
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image_url: string;
  available_seats: number;
  organizer_id: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  purchase_date: string;
  qr_code_data: string;
  event?: Event;
}

// Helper function to handle API errors
const handleApiError = (error: any): void => {
  console.error("API Error:", error);
  const errorMessage = error.message || "Something went wrong";
  toast.error(errorMessage);
};

// Events
export const getEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const getEvent = async (id: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Tickets
export const getUserTickets = async (): Promise<Ticket[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please login to view tickets");
      return [];
    }

    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        event:events(*)
      `)
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const purchaseTicket = async (eventId: string): Promise<Ticket | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please login to purchase tickets");
      return null;
    }

    // Check if event exists and has available seats
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) throw eventError;
    
    if (!event) {
      toast.error("Event not found");
      return null;
    }

    if (event.available_seats <= 0) {
      toast.error("No seats available");
      return null;
    }

    // Create ticket
    const qrCodeData = `TICKET-${eventId}-${user.id}-${Date.now()}`;
    
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        event_id: eventId,
        user_id: user.id,
        qr_code_data: qrCodeData,
      })
      .select()
      .single();

    if (ticketError) throw ticketError;

    // Update available seats
    const { error: updateError } = await supabase
      .from('events')
      .update({ available_seats: event.available_seats - 1 })
      .eq('id', eventId);

    if (updateError) throw updateError;

    toast.success("Ticket purchased successfully!");
    return ticket;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};
