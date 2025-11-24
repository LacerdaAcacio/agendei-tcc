import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { optionalAuth } from '@shared/middlewares/optionalAuth';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/v1/home:
 *   get:
 *     tags: [Home]
 *     summary: Get services grouped by category for home page
 *     responses:
 *       200:
 *         description: Categories with services retrieved successfully
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const categories = await prisma.category.findMany({
      include: {
        services: {
          take: 10, // Limit to 10 services per category for home
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            rating: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Fetch user's favorites if authenticated
    let favoriteIds: Set<string> = new Set();
    if (userId) {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        select: { serviceId: true },
      });
      favoriteIds = new Set(favorites.map((f) => f.serviceId));
    }

    // Parse images for all services and add isFavorited
    const parsedCategories = categories.map((category: any) => ({
      ...category,
      services: category.services.map((service: any) => ({
        ...service,
        images: JSON.parse(service.images),
        hostLanguages: JSON.parse(service.hostLanguages || '[]'),
        highlights: JSON.parse(service.highlights || '[]'),
        isFavorited: userId ? favoriteIds.has(service.id) : false,
      })),
    }));

    res.status(200).json({
      status: 'success',
      data: { categories: parsedCategories },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
