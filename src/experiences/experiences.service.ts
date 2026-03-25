import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeResponsibilities(values?: string[]) {
    if (!Array.isArray(values)) return [];

    return values
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter((value) => value.length > 0);
  }

  create(dto: CreateExperienceDto) {
    return this.prisma.workExperience.create({
      data: {
        ...dto,
        responsibilities: this.sanitizeResponsibilities(dto.responsibilities),
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  findAll() {
    return this.prisma.workExperience.findMany({
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.workExperience.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateExperienceDto) {
    const responsibilities =
      dto.responsibilities === undefined
        ? undefined
        : this.sanitizeResponsibilities(dto.responsibilities);

    return this.prisma.workExperience.update({
      where: { id },
      data: {
        ...dto,
        responsibilities,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.workExperience.delete({ where: { id } });
  }
}
