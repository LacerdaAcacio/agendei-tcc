import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoriesRepository {
  async findAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
