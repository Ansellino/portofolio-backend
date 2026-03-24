import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  findAll() {
    return this.prisma.skill.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.skill.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateSkillDto) {
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.skill.delete({ where: { id } });
  }
}
