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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created' })
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, description: 'Skills retrieved' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by id' })
  @ApiParam({ name: 'id', description: 'Skill id (UUID)' })
  @ApiResponse({ status: 200, description: 'Skill retrieved' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update skill by id' })
  @ApiParam({ name: 'id', description: 'Skill id (UUID)' })
  @ApiResponse({ status: 200, description: 'Skill updated' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSkillDto,
  ) {
    return this.skillsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete skill by id' })
  @ApiParam({ name: 'id', description: 'Skill id (UUID)' })
  @ApiResponse({ status: 200, description: 'Skill deleted' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.skillsService.remove(id);
  }
}
