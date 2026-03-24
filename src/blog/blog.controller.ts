import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findPublished(
    @Query() pagination: PaginationDto,
    @Query('category') category?: string,
  ) {
    return this.blogService.findPublished(
      pagination.page,
      pagination.limit,
      category,
    );
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findOnePublishedBySlug(slug);
  }
}
