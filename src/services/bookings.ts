import { BookingsResponse, Booking } from '@/types/api';
import { apiGet, apiPatch } from './api';

export const bookingService = {
  // Get all bookings with filters
  getBookings: async (params: {
    status?: string | null;
    page?: number;
    limit?: number;
  }): Promise<BookingsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    return await apiGet<BookingsResponse>(`/booking/admin/booking?${searchParams.toString()}`);
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: string): Promise<any> => {
    return await apiPatch(`/booking/update/${bookingId}`, { status });
  },

  // Update booking details
  updateBooking: async (bookingId: string, data: Partial<Booking>): Promise<any> => {
    return await apiPatch(`/booking/update/${bookingId}`, data);
  },
};