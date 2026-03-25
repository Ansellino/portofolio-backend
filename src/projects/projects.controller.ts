import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'Project created',
    schema: {
      example: {
        id: 'd43ed1cb-c8f7-49f8-9f6c-1cb2d12061b5',
        title: 'Portfolio Backend',
        slug: 'portfolio-backend',
        isPublished: true,
        skills: [
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
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved',
    schema: {
      example: [
        {
          id: 'd43ed1cb-c8f7-49f8-9f6c-1cb2d12061b5',
          title: 'Portfolio Backend',
          slug: 'portfolio-backend',
          isPublished: true,
          skills: [
            {
              skill: {
                id: '9c4b8d57-7ce0-42f9-9c8c-f1b95c8e2b97',
                name: 'NestJS',
              },
            },
          ],
        },
      ],
    },
  })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get project by slug' })
  @ApiParam({ name: 'slug', description: 'Project slug' })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.projectsService.findOneBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by id' })
  @ApiParam({ name: 'id', description: 'Project id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved',
    schema: {
      example: {
        id: 'd43ed1cb-c8f7-49f8-9f6c-1cb2d12061b5',
        title: 'Portfolio Backend',
        slug: 'portfolio-backend',
        isPublished: true,
        skills: [
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
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project by id' })
  @ApiParam({ name: 'id', description: 'Project id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Project updated',
    schema: {
      example: {
        id: 'd43ed1cb-c8f7-49f8-9f6c-1cb2d12061b5',
        title: 'Portfolio Backend v2',
        slug: 'portfolio-backend-v2',
        isPublished: true,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by id' })
  @ApiParam({ name: 'id', description: 'Project id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Project deleted',
    schema: {
      example: {
        id: 'd43ed1cb-c8f7-49f8-9f6c-1cb2d12061b5',
        title: 'Portfolio Backend',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.projectsService.remove(id);
  }
}
