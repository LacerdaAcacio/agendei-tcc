import { PrismaClient, Service } from '@prisma/client';
import { CreateServiceInput, SearchServicesInput } from './services.schema';
import { AppError } from '@shared/errors/AppError';

const prisma = new PrismaClient();

export class ServicesRepository {
  async create(data: CreateServiceInput & { userId: string }): Promise<Service> {
    return await prisma.service.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
        hostLanguages: JSON.stringify(data.hostLanguages),
        highlights: JSON.stringify(data.highlights),
      } as any,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            bio: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, providerId?: string): Promise<any[]> {
    const where: any = {};
    if (providerId) {
      where.userId = providerId;
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (userId) {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        select: { serviceId: true },
      });
      const favoriteIds = new Set(favorites.map((f) => f.serviceId));
      return services.map((service) => ({
        ...service,
        isFavorited: favoriteIds.has(service.id),
      }));
    }

    return services;
  }

  async findById(id: string, userId?: string): Promise<any | null> {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            bio: true,
          },
        },
        bookings: {
          where: {
            status: 'CONFIRMED',
          },
          select: {
            startDate: true,
            endDate: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!service) return null;

    if (userId) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_serviceId: {
            userId,
            serviceId: id,
          },
        },
      });
      return {
        ...service,
        isFavorited: !!favorite,
      };
    }

    return service;
  }

  async toggleFavorite(userId: string, serviceId: string): Promise<{ isFavorited: boolean }> {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return { isFavorited: false };
    } else {
      try {
        await prisma.favorite.create({
          data: {
            userId,
            serviceId,
          },
        });
        return { isFavorited: true };
      } catch (error: any) {
        if (error.code === 'P2003') {
          // Foreign key constraint failed
          throw new AppError('Service or user not found', 404);
        }
        throw error;
      }
    }
  }

  async findByCategory(categoryId: string): Promise<Service[]> {
    return await prisma.service.findMany({
      where: { categoryId },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            bio: true,
          },
        },
      },
    });
  }

  async searchWithFilters(filters: SearchServicesInput, userId?: string): Promise<any[]> {
    const where: any = {};

    // Location filter (case-insensitive search removed for SQLite)
    if (filters.location) {
      where.location = {
        contains: filters.location,
      };
    }

    // Category ID filter
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Category Slug filter
    if (filters.category) {
      where.category = {
        slug: filters.category,
      };
    }

    // Keyword search (Title or Description or Location)
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { location: { contains: filters.search } },
      ];
    }

    // Type filter
    if (filters.type) {
      where.type = filters.type;
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            bio: true,
          },
        },
        bookings: {
          where: {
            status: 'CONFIRMED',
          },
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    let result = services;

    // Filter by availability if dates provided
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      result = services.filter((service: any) => {
        // Check if there's any confirmed booking that overlaps with the requested dates
        const hasConflict = service.bookings.some((booking: any) => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);

          // Check for overlap
          return (
            (startDate < bookingEnd && endDate > bookingStart)
          );
        });

        return !hasConflict;
      });
    }

    if (userId) {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        select: { serviceId: true },
      });
      const favoriteIds = new Set(favorites.map((f) => f.serviceId));
      return result.map((service) => ({
        ...service,
        isFavorited: favoriteIds.has(service.id),
      }));
    }

    return result;
  }

  async update(id: string, data: Partial<CreateServiceInput>): Promise<Service> {
    const updateData: any = { ...data };
    
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }
    if (data.hostLanguages) {
      updateData.hostLanguages = JSON.stringify(data.hostLanguages);
    }
    if (data.highlights) {
      updateData.highlights = JSON.stringify(data.highlights);
    }

    return await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            bio: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.service.delete({
      where: { id },
    });
  }
}
