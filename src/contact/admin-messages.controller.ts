import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { ContactService } from './contact.service';

@ApiTags('admin-messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/messages')
export class AdminMessagesController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contact messages' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '88c1fa16-f7c8-489e-918b-e40d00d7a302',
            name: 'Alex Johnson',
            email: 'alex@example.com',
            subject: 'Project inquiry',
            message: 'Can we discuss your backend architecture?',
            isRead: false,
            createdAt: '2026-03-25T10:00:00.000Z',
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
    return this.contactService.listAll(pagination.page, pagination.limit);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiParam({ name: 'id', description: 'Message id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Message marked as read',
    schema: {
      example: {
        id: '88c1fa16-f7c8-489e-918b-e40d00d7a302',
        isRead: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  markAsRead(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact message' })
  @ApiParam({ name: 'id', description: 'Message id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactService.remove(id);
  }
}
