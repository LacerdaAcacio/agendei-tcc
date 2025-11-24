import { Service } from '@prisma/client';
import { ServicesRepository } from './ServicesRepository';
import { CreateServiceInput, SearchServicesInput } from './services.schema';
import { AppError } from '@shared/errors/AppError';

export class ServicesService {
  private servicesRepository: ServicesRepository;

  constructor() {
    this.servicesRepository = new ServicesRepository();
  }

  async createService(userId: string, data: CreateServiceInput): Promise<Service> {
    // In a real app, you'd check if user.isProvider === true
    // For now, we'll just create the service
    return await this.servicesRepository.create({ ...data, userId });
  }

  async getAllServices(userId?: string, providerId?: string): Promise<Service[]> {
    return await this.servicesRepository.findAll(userId, providerId);
  }

  async getServiceById(id: string, userId?: string): Promise<Service> {
    const service = await this.servicesRepository.findById(id, userId);
    if (!service) {
      throw new AppError('Service not found', 404);
    }
    return service;
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return await this.servicesRepository.findByCategory(categoryId);
  }

  async searchServices(filters: SearchServicesInput, userId?: string): Promise<Service[]> {
    return await this.servicesRepository.searchWithFilters(filters, userId);
  }

  async updateService(id: string, userId: string, data: Partial<CreateServiceInput>): Promise<Service> {
    // Check if service exists
    const service = await this.getServiceById(id);

    // Verify ownership
    if (service.userId !== userId) {
      throw new AppError('You do not have permission to update this service', 403);
    }

    return await this.servicesRepository.update(id, data);
  }

  async deleteService(id: string, userId: string): Promise<void> {
    // Check if service exists
    const service = await this.getServiceById(id);

    // Verify ownership
    if (service.userId !== userId) {
      throw new AppError('You do not have permission to delete this service', 403);
    }

    await this.servicesRepository.delete(id);
  }
}
