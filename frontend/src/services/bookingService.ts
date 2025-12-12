import API from './api';
import { Booking, BookingResponse } from '../types';

export const bookingService = {
  bookSeats: async (showId: number, seatNumbers: string[]) => {
    try {
      const { data } = await API.post<BookingResponse>('/bookings', {
        show_id: showId,
        seat_numbers: seatNumbers,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  getBookings: async () => {
    try {
      const { data } = await API.get<Booking[]>('/bookings');
      return data;
    } catch (error) {
      throw error;
    }
  },

  getBookingStatus: async (bookingId: number) => {
    try {
      const { data } = await API.get<Booking>(`/bookings/${bookingId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
};