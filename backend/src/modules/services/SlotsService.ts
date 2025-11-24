import { PrismaClient } from '@prisma/client';
import { AppError } from '@shared/errors/AppError';

const prisma = new PrismaClient();

interface AvailabilitySchedule {
  monday?: { start: string; end: string; active: boolean };
  tuesday?: { start: string; end: string; active: boolean };
  wednesday?: { start: string; end: string; active: boolean };
  thursday?: { start: string; end: string; active: boolean };
  friday?: { start: string; end: string; active: boolean };
  saturday?: { start: string; end: string; active: boolean };
  sunday?: { start: string; end: string; active: boolean };
}

export class SlotsService {
  /**
   * Calculate available time slots for a service on a specific date
   */
  async getAvailableSlots(serviceId: string, date: string): Promise<string[]> {
    // Validate date format
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    // Fetch service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        duration: true,
        bufferTime: true,
        availability: true,
      },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    // Parse availability schedule
    let availabilitySchedule: AvailabilitySchedule = {};
    try {
      availabilitySchedule = service.availability 
        ? JSON.parse(service.availability) 
        : {};
    } catch (error) {
      throw new AppError('Invalid availability configuration', 500);
    }

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = targetDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof AvailabilitySchedule;

    // Check if the day is available
    const daySchedule = availabilitySchedule[dayName];
    if (!daySchedule || !daySchedule.active) {
      return []; // Day is not available for bookings
    }

    // Fetch existing bookings for this service on this date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch existing bookings that overlap with the day
    // Overlap logic: (StartA < EndB) and (EndA > StartB)
    // We want bookings where:
    // BookingStart < DayEnd AND BookingEnd > DayStart
    const existingBookings = await prisma.booking.findMany({
      where: {
        serviceId,
        status: 'CONFIRMED', // Only confirmed bookings block slots
        startDate: { lt: endOfDay },
        endDate: { gt: startOfDay },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    // Generate available slots
    const slots = this.generateSlots(
      daySchedule.start,
      daySchedule.end,
      service.duration,
      service.bufferTime,
      targetDate,
      existingBookings
    );

    return slots;
  }

  /**
   * Generate time slots for a given day
   */
  private generateSlots(
    startTime: string,
    endTime: string,
    duration: number,
    bufferTime: number,
    targetDate: Date,
    existingBookings: Array<{ startDate: Date; endDate: Date }>
  ): string[] {
    const slots: string[] = [];
    const now = new Date();
    
    // Ensure targetDate is set to the beginning of the day
    const baseDate = new Date(targetDate);
    baseDate.setHours(0, 0, 0, 0);

    const isToday = this.isSameDay(baseDate, now);

    // Parse start and end times
    const [startHour = 0, startMinute = 0] = startTime.split(':').map(Number);
    const [endHour = 0, endMinute = 0] = endTime.split(':').map(Number);

    // Create start and end Date objects for the schedule
    let currentSlotStart = new Date(baseDate);
    currentSlotStart.setHours(startHour, startMinute, 0, 0);

    const dayEnd = new Date(baseDate);
    dayEnd.setHours(endHour, endMinute, 0, 0);

    while (currentSlotStart < dayEnd) {
      const slotEnd = new Date(currentSlotStart.getTime() + duration * 60000);

      if (slotEnd > dayEnd) {
        break;
      }

      // Check if slot is in the past
      if (isToday && currentSlotStart <= now) {
        currentSlotStart = new Date(currentSlotStart.getTime() + (duration + bufferTime) * 60000);
        continue;
      }

      // Robust Collision Detection
      // Formula: slotStart < bookingEnd && slotEnd > bookingStart
      const isBusy = existingBookings.some((booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        return currentSlotStart < bookingEnd && slotEnd > bookingStart;
      });

      if (!isBusy) {
        slots.push(this.formatTime(currentSlotStart));
      }

      // Move to next slot
      currentSlotStart = new Date(currentSlotStart.getTime() + (duration + bufferTime) * 60000);
    }

    return slots;
  }

  /**
   * Format Date object to "HH:MM" string
   */
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Check if two dates are the same day
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
