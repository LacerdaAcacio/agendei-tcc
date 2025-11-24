import { Request, Response, NextFunction } from 'express';
import { UsersService } from './UsersService';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.usersService.createUser(req.body);
      res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.usersService.getAllUsers();
      res.status(200).json({
        status: 'success',
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.usersService.getUserById(req.params['id'] as string);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { avatarUrl, ...rest } = req.body;
      const updateData = {
        ...rest,
        ...(avatarUrl && { profileImage: avatarUrl }),
      };

      const user = await this.usersService.updateUser(
        req.params['id'] as string,
        updateData,
      );
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.usersService.deleteUser(req.params['id'] as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const services = await this.usersService.getUserFavorites(userId);
      
      // Parse JSON fields
      const parsedServices = services.map((service: any) => ({
        ...service,
        images: JSON.parse(service.images),
        hostLanguages: JSON.parse(service.hostLanguages || '[]'),
        highlights: JSON.parse(service.highlights || '[]'),
        isFavorited: true, // Since it's a wishlist, it's always favorited
      }));

      res.status(200).json({
        status: 'success',
        data: parsedServices,
      });
    } catch (error) {
      next(error);
    }
  };
}
