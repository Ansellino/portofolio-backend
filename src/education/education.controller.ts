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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @ApiOperation({ summary: 'Create education record' })
  @ApiResponse({ status: 201, description: 'Education record created' })
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all education records' })
  @ApiResponse({ status: 200, description: 'Education records retrieved' })
  findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get education record by id' })
  @ApiParam({ name: 'id', description: 'Education id (UUID)' })
  @ApiResponse({ status: 200, description: 'Education record retrieved' })
  @ApiResponse({ status: 404, description: 'Education record not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.educationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update education record by id' })
  @ApiParam({ name: 'id', description: 'Education id (UUID)' })
  @ApiResponse({ status: 200, description: 'Education record updated' })
  @ApiResponse({ status: 404, description: 'Education record not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete education record by id' })
  @ApiParam({ name: 'id', description: 'Education id (UUID)' })
  @ApiResponse({ status: 200, description: 'Education record deleted' })
  @ApiResponse({ status: 404, description: 'Education record not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.educationService.remove(id);
  }
}
