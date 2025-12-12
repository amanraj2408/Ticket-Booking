// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Show/Trip/Slot Types
export interface Show {
  id: number;
  name: string;
  show_type: 'movie' | 'bus' | 'doctor';
  start_time: string;
  total_seats: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
}

export interface Seat {
  id: number;
  show_id: number;
  seat_number: string;
  status: 'available' | 'booked' | 'locked';
  locked_until?: string;
  created_at: string;
}

export interface ShowDetails {
  show: Show;
  seats: Seat[];
}

// Booking Types
export interface Booking {
  id: number;
  user_id: string;
  show_id: number;
  seat_ids: string[];
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  booked_at: string;
  confirmed_at?: string;
  expires_at: string;
  show_name: string;
}

export interface BookingRequest {
  show_id: number;
  seat_numbers: string[];
}

export interface BookingResponse {
  message: string;
  booking: Booking;
  expires_in_seconds?: number;
}

// API Error Type
export interface ApiError {
  error: string;
  message?: string;
}