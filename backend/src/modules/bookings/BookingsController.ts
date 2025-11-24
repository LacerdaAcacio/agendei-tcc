import { Request, Response, NextFunction } from 'express';
import { BookingsService } from './BookingsService';

export class BookingsController {
  private bookingsService: BookingsService;

  constructor() {
    this.bookingsService = new BookingsService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const booking = await this.bookingsService.createBooking(userId, req.body);

      res.status(201).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  };

  getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const bookings = await this.bookingsService.getUserBookings(userId);

      res.status(200).json({
        status: 'success',
        data: { bookings },
      });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const booking = await this.bookingsService.cancelBooking(
        req.params['id'] as string,
        userId
      );

      res.status(200).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const booking = await this.bookingsService.updateBooking(
        req.params['id'] as string,
        userId,
        req.body
      );

      res.status(200).json({
        status: 'success',
        data: { booking },
      });
    } catch (error) {
      next(error);
    }
  };
}
