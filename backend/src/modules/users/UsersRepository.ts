import { PrismaClient, User, Prisma } from '@prisma/client';
import { CreateUserInput, UpdateUserInput } from './users.schema';

const prisma = new PrismaClient();

export class UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findByDocument(document: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { document },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findFavorites(userId: string) {
    return await prisma.favorite.findMany({
      where: { userId },
      include: {
        service: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
