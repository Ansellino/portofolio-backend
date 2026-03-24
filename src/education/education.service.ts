import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEducationDto) {
    return this.prisma.education.create({
      data: {
        ...dto,
        gpa: dto.gpa,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  findAll() {
    return this.prisma.education.findMany({
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.education.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateEducationDto) {
    return this.prisma.education.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.education.delete({ where: { id } });
  }
}
