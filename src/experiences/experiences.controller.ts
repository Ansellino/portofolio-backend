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
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@ApiTags('experiences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @ApiOperation({ summary: 'Create experience' })
  @ApiResponse({ status: 201, description: 'Experience created' })
  create(@Body() dto: CreateExperienceDto) {
    return this.experiencesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all experiences' })
  @ApiResponse({ status: 200, description: 'Experiences retrieved' })
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get experience by id' })
  @ApiParam({ name: 'id', description: 'Experience id (UUID)' })
  @ApiResponse({ status: 200, description: 'Experience retrieved' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update experience by id' })
  @ApiParam({ name: 'id', description: 'Experience id (UUID)' })
  @ApiResponse({ status: 200, description: 'Experience updated' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete experience by id' })
  @ApiParam({ name: 'id', description: 'Experience id (UUID)' })
  @ApiResponse({ status: 200, description: 'Experience deleted' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.experiencesService.remove(id);
  }
}
