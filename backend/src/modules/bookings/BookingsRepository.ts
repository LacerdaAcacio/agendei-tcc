import { PrismaClient, Booking, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class BookingsRepository {
  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    return await prisma.booking.create({
      data,
    });
  }

  async findConflictingBooking(serviceId: string, startDate: Date, endDate: Date, excludeBookingId?: string): Promise<Booking | null> {
    return await prisma.booking.findFirst({
      where: {
        serviceId,
        status: 'CONFIRMED',
        ...(excludeBookingId && { id: { not: excludeBookingId } }),
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });
  }

  async findByClientId(clientId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { clientId },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        client: true,
        provider: true,
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data,
    });
  }
}
