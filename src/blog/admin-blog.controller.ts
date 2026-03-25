import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('admin-blog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/blog')
export class AdminBlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blog posts for admin' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Admin blog posts retrieved',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '66f8d252-03d2-4d90-b2f2-9f0d033dc8a8',
            title: 'Draft Post',
            slug: 'draft-post',
            isPublished: false,
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() pagination: PaginationDto) {
    return this.blogService.findAllAdmin(pagination.page, pagination.limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a blog post' })
  @ApiResponse({
    status: 201,
    description: 'Blog post created',
    schema: {
      example: {
        id: '66f8d252-03d2-4d90-b2f2-9f0d033dc8a8',
        title: 'New Blog Post',
        slug: 'new-blog-post',
        isPublished: false,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by id for admin' })
  @ApiParam({ name: 'id', description: 'Blog post id (UUID)' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.blogService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update blog post by id' })
  @ApiParam({ name: 'id', description: 'Blog post id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated',
    schema: {
      example: {
        id: '66f8d252-03d2-4d90-b2f2-9f0d033dc8a8',
        title: 'Updated Blog Post',
        slug: 'updated-blog-post',
        isPublished: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete blog post by id' })
  @ApiParam({ name: 'id', description: 'Blog post id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Blog post deleted',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.blogService.remove(id);
  }
}
