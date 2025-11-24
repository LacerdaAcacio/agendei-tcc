import { Request, Response, NextFunction } from 'express';
import { ServicesService } from './ServicesService';

export class ServicesController {
  private servicesService: ServicesService;

  constructor() {
    this.servicesService = new ServicesService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Auto-generate location if not provided but city/state are
      if (!req.body.location && req.body.addressCity && req.body.addressState) {
        req.body.location = `${req.body.addressCity}, ${req.body.addressState}, Brasil`;
      }

      const service = await this.servicesService.createService(req.user!.id, req.body);
      
      // Parse JSON fields
      const response = {
        ...service,
        images: JSON.parse(service.images as string),
        hostLanguages: JSON.parse((service as any).hostLanguages || '[]'),
        highlights: JSON.parse((service as any).highlights || '[]'),
      };

      res.status(201).json({
        status: 'success',
        data: { service: response },
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const providerId = req.query.providerId as string | undefined;
      const services = await this.servicesService.getAllServices(userId, providerId);
      
      // Parse JSON fields
      const parsedServices = services.map((service: any) => ({
        ...service,
        images: JSON.parse(service.images),
        hostLanguages: JSON.parse(service.hostLanguages || '[]'),
        highlights: JSON.parse(service.highlights || '[]'),
      }));

      res.status(200).json({
        status: 'success',
        data: { services: parsedServices },
      });
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const services = await this.servicesService.searchServices(req.query as any, userId);
      
      // Parse JSON fields
      const parsedServices = services.map((service: any) => ({
        ...service,
        images: JSON.parse(service.images),
        hostLanguages: JSON.parse(service.hostLanguages || '[]'),
        highlights: JSON.parse(service.highlights || '[]'),
      }));

      res.status(200).json({
        status: 'success',
        data: { services: parsedServices },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const service = await this.servicesService.getServiceById(req.params['id'] as string, userId);
      
      // Parse JSON fields
      const response = {
        ...service,
        images: JSON.parse((service as any).images),
        hostLanguages: JSON.parse((service as any).hostLanguages || '[]'),
        highlights: JSON.parse((service as any).highlights || '[]'),
      };

      res.status(200).json({
        status: 'success',
        data: { service: response },
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const service = await this.servicesService.updateService(
        req.params['id'] as string,
        req.user!.id,
        req.body
      );
      
      // Parse JSON fields
      const response = {
        ...service,
        images: JSON.parse(service.images as string),
        hostLanguages: JSON.parse((service as any).hostLanguages || '[]'),
        highlights: JSON.parse((service as any).highlights || '[]'),
      };

      res.status(200).json({
        status: 'success',
        data: { service: response },
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.servicesService.deleteService(req.params['id'] as string, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
