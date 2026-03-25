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
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CertificationsService } from './certifications.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@ApiTags('certifications')
@Controller('certifications')
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create certification' })
  @ApiResponse({ status: 201, description: 'Certification created' })
  create(@Body() dto: CreateCertificationDto) {
    return this.certificationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all certifications' })
  @ApiQuery({ name: 'category', required: false })
  @ApiResponse({ status: 200, description: 'Certifications retrieved' })
  findAll(@Query('category') category?: string) {
    return this.certificationsService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certification by id' })
  @ApiParam({ name: 'id', description: 'Certification id (UUID)' })
  @ApiResponse({ status: 200, description: 'Certification retrieved' })
  @ApiResponse({ status: 404, description: 'Certification not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.certificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update certification by id' })
  @ApiParam({ name: 'id', description: 'Certification id (UUID)' })
  @ApiResponse({ status: 200, description: 'Certification updated' })
  @ApiResponse({ status: 404, description: 'Certification not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCertificationDto,
  ) {
    return this.certificationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete certification by id' })
  @ApiParam({ name: 'id', description: 'Certification id (UUID)' })
  @ApiResponse({ status: 200, description: 'Certification deleted' })
  @ApiResponse({ status: 404, description: 'Certification not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.certificationsService.remove(id);
  }
}
