import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCertificationDto) {
    return this.prisma.certification.create({
      data: {
        ...dto,
        issueDate: new Date(dto.issueDate),
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      },
    });
  }

  findAll(category?: string) {
    return this.prisma.certification.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { issueDate: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.certification.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateCertificationDto) {
    return this.prisma.certification.update({
      where: { id },
      data: {
        ...dto,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.certification.delete({ where: { id } });
  }
}
