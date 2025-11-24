import type { Booking } from '@/types';

export interface BookingCardProps {
  booking: Booking;
  onEdit?: (booking: Booking) => void;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
