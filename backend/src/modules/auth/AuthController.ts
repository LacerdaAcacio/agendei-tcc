import { Request, Response, NextFunction } from 'express';
import { UsersService } from '@modules/users/UsersService';

export class AuthController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.usersService.createUser(req.body);
      
      // Remove password from response
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      res.status(201).json({
        status: 'success',
        data: { user: userResponse },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, token } = await this.usersService.authenticate(req.body);

      // Remove password from response
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      res.status(200).json({
        status: 'success',
        data: { user: userResponse, token },
      });
    } catch (error) {
      next(error);
    }
  };
}
