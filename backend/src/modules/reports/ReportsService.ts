import { Report } from '@prisma/client';
import { ReportsRepository } from './ReportsRepository';
import { CreateReportInput } from './reports.schema';
import { ServicesRepository } from '../services/ServicesRepository';
import { AppError } from '@shared/errors/AppError';

export class ReportsService {
  private reportsRepository: ReportsRepository;
  private servicesRepository: ServicesRepository;

  constructor() {
    this.reportsRepository = new ReportsRepository();
    this.servicesRepository = new ServicesRepository();
  }

  async createReport(reporterId: string, data: CreateReportInput): Promise<Report> {
    const service = await this.servicesRepository.findById(data.serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (service.userId === reporterId) {
      throw new AppError('You cannot report your own service', 400);
    }

    const report = await this.reportsRepository.create({
      reason: data.reason,
      description: data.description,
      status: 'PENDING',
      service: { connect: { id: data.serviceId } },
      reporter: { connect: { id: reporterId } },
    });

    return report;
  }
}
