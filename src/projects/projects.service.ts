import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProjectDto) {
    const { skillIds, ...projectData } = dto;

    return this.prisma.project.create({
      data: {
        ...projectData,
        startDate: new Date(projectData.startDate),
        endDate: projectData.endDate ? new Date(projectData.endDate) : null,
        skills: skillIds?.length
          ? {
              create: skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
      },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  }

  findOneBySlug(slug: string) {
    return this.prisma.project.findUnique({
      where: { slug },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const { skillIds, ...projectData } = dto;

    return await this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        startDate: projectData.startDate
          ? new Date(projectData.startDate)
          : undefined,
        endDate: projectData.endDate
          ? new Date(projectData.endDate)
          : undefined,
        skills: skillIds
          ? {
              deleteMany: {},
              create: skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
      },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
