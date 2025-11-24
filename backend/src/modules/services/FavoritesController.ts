import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '@shared/errors/AppError';
import { ServicesRepository } from './ServicesRepository';

export class FavoritesController {
  private servicesRepository: ServicesRepository;

  constructor() {
    this.servicesRepository = new ServicesRepository();
  }

  toggle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { id: serviceId } = req.params;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const uuidSchema = z.string();
      const validation = uuidSchema.safeParse(serviceId);

      if (!validation.success) {
        throw new AppError('Invalid service ID', 400);
      }

      const result = await this.servicesRepository.toggleFavorite(userId, serviceId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
