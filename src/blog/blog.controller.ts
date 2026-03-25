import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BlogService } from './blog.service';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published blog posts' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiResponse({
    status: 200,
    description: 'Published blog posts retrieved',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '66f8d252-03d2-4d90-b2f2-9f0d033dc8a8',
            title: 'How I Built My Portfolio API',
            slug: 'how-i-built-my-portfolio-api',
            category: 'backend',
            isPublished: true,
            readingTimeMin: 6,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Get a published blog post by slug' })
  @ApiParam({ name: 'slug', description: 'Blog post slug' })
  @ApiResponse({
    status: 200,
    description: 'Blog post retrieved',
    schema: {
      example: {
        id: '66f8d252-03d2-4d90-b2f2-9f0d033dc8a8',
        title: 'How I Built My Portfolio API',
        slug: 'how-i-built-my-portfolio-api',
        content: '# Post content',
        category: 'backend',
        isPublished: true,
        readingTimeMin: 6,
        tags: [
          {
            skill: {
              id: '9c4b8d57-7ce0-42f9-9c8c-f1b95c8e2b97',
              name: 'NestJS',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findOnePublishedBySlug(slug);
  }
}
