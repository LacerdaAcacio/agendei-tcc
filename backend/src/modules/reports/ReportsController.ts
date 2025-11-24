import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './ReportsService';

export class ReportsController {
  private reportsService: ReportsService;

  constructor() {
    this.reportsService = new ReportsService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const report = await this.reportsService.createReport(userId, req.body);

      res.status(201).json({
        status: 'success',
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  };
}
