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

    // Use atomic database function to prevent race conditions
    const { data, error } = await supabase.rpc('purchase_ticket', {
      p_event_id: eventId,
      p_user_id: user.id
    });

    if (error) throw error;

    const result = data?.[0];
    
    if (!result?.success) {
      toast.error(result?.message || "Failed to purchase ticket");
      return null;
    }

    toast.success("Ticket purchased successfully!");
    
    // Return ticket in expected format
    return {
      id: result.ticket_id,
      event_id: eventId,
      user_id: user.id,
      qr_code_data: result.qr_code,
      purchase_date: new Date().toISOString(),
    };
  } catch (error) {
    handleApiError(error);
    return null;
  }
};
