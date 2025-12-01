import { Request, Response, NextFunction } from 'express';
import { CategoriesRepository } from './CategoriesRepository';

export class CategoriesController {
  private categoriesRepository: CategoriesRepository;

  constructor() {
    this.categoriesRepository = new CategoriesRepository();
  }

  index = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoriesRepository.findAll();

      res.status(200).json({
        status: 'success',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  };
}
