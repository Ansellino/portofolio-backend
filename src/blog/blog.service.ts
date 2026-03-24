import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginateResponse } from '../common/utils/paginate';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { generateSlug } from '../common/utils/slug';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateReadingTime(content: string): number {
    return Math.ceil(content.trim().split(/\s+/).length / 200);
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string) {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existing = await this.prisma.blogPost.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || (excludeId && existing.id === excludeId)) {
        return slug;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  async findPublished(page = 1, limit = 10, category?: string) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;

    const where = {
      isPublished: true,
      ...(category ? { category } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        include: {
          tags: {
            include: { skill: true },
          },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return paginateResponse(items, total, safePage, safeLimit);
  }

  async findOnePublishedBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
      include: {
        tags: {
          include: { skill: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findAllAdmin(page = 1, limit = 10) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        orderBy: [{ updatedAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        include: {
          tags: {
            include: { skill: true },
          },
        },
      }),
      this.prisma.blogPost.count(),
    ]);

    return paginateResponse(items, total, safePage, safeLimit);
  }

  async create(dto: CreateBlogDto) {
    const baseSlug = generateSlug(dto.title);
    const slug = await this.ensureUniqueSlug(baseSlug);
    const readingTimeMin = this.calculateReadingTime(dto.content);

    const { skillIds, ...postData } = dto;

    return this.prisma.blogPost.create({
      data: {
        ...postData,
        slug,
        readingTimeMin,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
        tags: skillIds?.length
          ? {
              create: skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: { skill: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, title: true, isPublished: true, publishedAt: true },
    });

    if (!existing) {
      throw new NotFoundException('Post not found');
    }

    const { skillIds, ...postData } = dto;

    const nextSlug = dto.title
      ? await this.ensureUniqueSlug(generateSlug(dto.title), id)
      : undefined;

    const nextReadingTime = dto.content
      ? this.calculateReadingTime(dto.content)
      : undefined;

    const nextIsPublished = dto.isPublished ?? existing.isPublished;
    const nextPublishedAt =
      dto.isPublished === undefined
        ? undefined
        : nextIsPublished
          ? (existing.publishedAt ?? new Date())
          : null;

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        slug: nextSlug,
        readingTimeMin: nextReadingTime,
        isPublished: dto.isPublished,
        publishedAt: nextPublishedAt,
        tags: skillIds
          ? {
              deleteMany: {},
              create: skillIds.map((skillId) => ({ skillId })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: { skill: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.blogPost.delete({ where: { id } });
    return { success: true };
  }
}
