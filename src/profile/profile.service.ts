import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProfileDto) {
    return this.prisma.profile.create({ data: dto });
  }

  findOne() {
    return this.prisma.profile.findFirst();
  }

  async update(dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findFirst({
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.update({
      where: { id: profile.id },
      data: dto,
    });
  }

  async remove() {
    const profile = await this.prisma.profile.findFirst({
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.delete({ where: { id: profile.id } });
  }
}
