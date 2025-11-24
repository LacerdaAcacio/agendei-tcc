import { PrismaClient, Report, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportsRepository {
  async create(data: Prisma.ReportCreateInput): Promise<Report> {
    return await prisma.report.create({
      data,
    });
  }
}
