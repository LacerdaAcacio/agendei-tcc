import { Request, Response, NextFunction } from 'express';
import { SlotsService } from './SlotsService';

export class SlotsController {
  private slotsService: SlotsService;

  constructor() {
    this.slotsService = new SlotsService();
  }

  /**
   * GET /services/:id/slots?date=YYYY-MM-DD
   * Returns available time slots for a service on a specific date
   */
  getAvailableSlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: serviceId } = req.params;
      const { date } = req.query;

      if (!date || typeof date !== 'string') {
        res.status(400).json({
          status: 'error',
          message: 'Date parameter is required in format YYYY-MM-DD',
        });
        return;
      }

      const slots = await this.slotsService.getAvailableSlots(serviceId, date);

      res.status(200).json({
        status: 'success',
        data: {
          serviceId,
          date,
          availableSlots: slots,
          count: slots.length,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
