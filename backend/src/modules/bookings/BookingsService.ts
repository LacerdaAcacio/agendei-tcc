import { Booking } from '@prisma/client';
import { BookingsRepository } from './BookingsRepository';
import { CreateBookingInput } from './bookings.schema';
import { ServicesRepository } from '../services/ServicesRepository';
import { AppError } from '@shared/errors/AppError';

export class BookingsService {
  private bookingsRepository: BookingsRepository;
  private servicesRepository: ServicesRepository;

  constructor() {
    this.bookingsRepository = new BookingsRepository();
    this.servicesRepository = new ServicesRepository();
  }

  async createBooking(userId: string, data: CreateBookingInput): Promise<Booking> {
    const { serviceId, startDate, endDate } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Validate Dates
    if (start >= end) {
      throw new AppError('End date must be after start date');
    }
    if (start < new Date()) {
      throw new AppError('Cannot book dates in the past');
    }

    // 2. Check Service Existence
    const service = await this.servicesRepository.findById(serviceId);
    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (service.userId === userId) {
      throw new AppError('You cannot book your own service');
    }

    // 3. Check Conflicts (Overbooking)
    const conflictingBooking = await this.bookingsRepository.findConflictingBooking(
      serviceId,
      start,
      end,
    );
    if (conflictingBooking) {
      throw new AppError('Selected dates are not available', 409);
    }

    // 4. Calculate Financials
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Ensure at least 1 day charged if it's a daily rate, or logic depends on type.
    // Assuming daily rate for simplicity as per prompt "diff(endDate, startDate)"
    const daysToCharge = diffDays > 0 ? diffDays : 1;

    const subTotal = service.price * daysToCharge;
    const serviceFee = subTotal * 0.12; // 12% fee
    const totalPrice = subTotal + serviceFee;
    const providerEarnings = subTotal;

    // 5. Create Booking
    const booking = await this.bookingsRepository.create({
      startDate: start,
      endDate: end,
      totalPrice,
      serviceFee,
      providerEarnings,
      status: 'CONFIRMED', // MVP Rule
      client: { connect: { id: userId } },
      provider: { connect: { id: service.userId } },
      service: { connect: { id: serviceId } },
    });

    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.bookingsRepository.findByClientId(userId);
  }

  async cancelBooking(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findById(bookingId);

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Check ownership (client or provider can cancel)
    if (booking.clientId !== userId && booking.providerId !== userId) {
      throw new AppError('You are not authorized to cancel this booking', 403);
    }

    if (booking.status === 'COMPLETED') {
      throw new AppError('Cannot cancel a completed booking', 400);
    }

    if (booking.status === 'CANCELLED') {
      throw new AppError('Booking is already cancelled', 400);
    }

    return await this.bookingsRepository.updateStatus(bookingId, 'CANCELLED');
  }

  async updateBooking(
    bookingId: string,
    userId: string,
    data: { startDate: string; endDate: string },
  ): Promise<Booking> {
    const { startDate, endDate } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Validate Dates
    if (start >= end) {
      throw new AppError('End date must be after start date');
    }
    if (start < new Date()) {
      throw new AppError('Cannot book dates in the past');
    }

    // 2. Find Booking
    const booking = await this.bookingsRepository.findById(bookingId);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // 3. Check Ownership
    if (booking.clientId !== userId) {
      throw new AppError('You are not authorized to reschedule this booking', 403);
    }

    // 4. Check Status
    if (booking.status !== 'CONFIRMED') {
      throw new AppError('Only confirmed bookings can be rescheduled', 400);
    }

    // 5. Check Conflicts (Excluding current booking)
    // IMPORTANT: We must exclude the current booking ID to avoid self-collision
    const conflictingBooking = await this.bookingsRepository.findConflictingBooking(
      booking.serviceId,
      start,
      end,
      bookingId,
    );
    if (conflictingBooking) {
      throw new AppError('Selected dates are not available', 409);
    }

    // 6. Recalculate Financials
    // Fetch service to get current price details
    const service = await this.servicesRepository.findById(booking.serviceId);
    if (!service) {
      throw new AppError('Service not found', 404);
    }

    // Calculate duration in days (rounding up)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysToCharge = diffDays > 0 ? diffDays : 1;

    // Recalculate values
    const subTotal = service.price * daysToCharge;
    const serviceFee = subTotal * 0.12; // 12% platform fee
    const totalPrice = subTotal + serviceFee;
    const providerEarnings = subTotal;

    // 7. Update Booking
    return await this.bookingsRepository.update(bookingId, {
      startDate: start,
      endDate: end,
      totalPrice,
      serviceFee,
      providerEarnings,
    });
  }
}
