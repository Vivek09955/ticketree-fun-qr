
import { toast } from "sonner";

// API Base URL - Replace with your actual API endpoint
const API_BASE_URL = "https://api.example.com";

// Define types for the API responses
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  imageUrl: string;
  availableSeats: number;
  organizerId: number;
  createdAt: string;
}

export interface Ticket {
  id: number;
  eventId: number;
  userId: number;
  purchaseDate: string;
  qrCodeData: string;
  event?: Event;
}

// API Error type
interface ApiError {
  message: string;
  status: number;
}

// Helper function to handle API errors
const handleApiError = (error: any): ApiError => {
  console.error("API Error:", error);
  
  // Extract error message and status
  const errorMessage = error.response?.data?.message || "Something went wrong";
  const errorStatus = error.response?.status || 500;
  
  // Show error toast
  toast.error(errorMessage);
  
  return {
    message: errorMessage,
    status: errorStatus
  };
};

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth headers for requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API Functions

// Auth
export const login = async (email: string, password: string): Promise<{user: User, token: string} | null> => {
  try {
    // This is where you'd integrate with your actual backend
    // For now, we'll simulate a successful login
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const register = async (name: string, email: string, password: string): Promise<{user: User, token: string} | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Events
export const getEvents = async (): Promise<Event[]> => {
  try {
    // In a real implementation, this would fetch from your backend
    // For now, we'll return mock data
    return [
      {
        id: 1,
        title: "Spring Concert",
        description: "Join us for an evening of music performed by the university orchestra.",
        date: "2023-04-15",
        time: "19:00",
        location: "University Auditorium",
        price: 15,
        imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        availableSeats: 200,
        organizerId: 1,
        createdAt: "2023-01-10T10:30:00Z"
      },
      {
        id: 2,
        title: "Tech Conference 2023",
        description: "A day of talks and workshops on the latest technologies and industry trends.",
        date: "2023-05-20",
        time: "09:00",
        location: "Science Building",
        price: 25,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        availableSeats: 150,
        organizerId: 2,
        createdAt: "2023-02-05T14:20:00Z"
      },
      {
        id: 3,
        title: "Charity Fun Run",
        description: "5k run to raise funds for the local children's hospital.",
        date: "2023-06-10",
        time: "08:00",
        location: "University Park",
        price: 10,
        imageUrl: "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        availableSeats: 500,
        organizerId: 3,
        createdAt: "2023-03-01T09:15:00Z"
      },
      {
        id: 4,
        title: "Art Exhibition",
        description: "Showcasing works by talented student artists from the university.",
        date: "2023-07-05",
        time: "10:00",
        location: "Art Gallery",
        price: 8,
        imageUrl: "https://images.unsplash.com/photo-1594321791809-2c4c5c1523b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        availableSeats: 100,
        organizerId: 4,
        createdAt: "2023-04-12T11:40:00Z"
      }
    ];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const getEvent = async (id: number): Promise<Event | null> => {
  try {
    // In a real implementation, this would fetch from your backend
    // For now, we'll filter from our mock data
    const events = await getEvents();
    return events.find(event => event.id === id) || null;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Tickets
export const getUserTickets = async (): Promise<Ticket[]> => {
  try {
    // In a real implementation, this would fetch from your backend
    // For now, we'll return mock data
    const events = await getEvents();
    
    return [
      {
        id: 1,
        eventId: 1,
        userId: 1,
        purchaseDate: "2023-04-01T15:30:00Z",
        qrCodeData: "TICKET1-EVENT1-USER1",
        event: events[0]
      },
      {
        id: 2,
        eventId: 2,
        userId: 1,
        purchaseDate: "2023-05-10T09:45:00Z",
        qrCodeData: "TICKET2-EVENT2-USER1",
        event: events[1]
      }
    ];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const purchaseTicket = async (eventId: number): Promise<Ticket | null> => {
  try {
    // In a real implementation, this would call your backend
    // For now, we'll simulate a successful purchase
    const event = await getEvent(eventId);
    
    if (!event) {
      throw new Error("Event not found");
    }
    
    // Create a new mock ticket
    const ticket: Ticket = {
      id: Math.floor(Math.random() * 1000),
      eventId,
      userId: 1, // Assuming current user has ID 1
      purchaseDate: new Date().toISOString(),
      qrCodeData: `TICKET-${eventId}-USER-1-${Date.now()}`,
      event
    };
    
    return ticket;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};
