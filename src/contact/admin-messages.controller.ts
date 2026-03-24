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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ContactService } from './contact.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/messages')
export class AdminMessagesController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.contactService.listAll(pagination.page, pagination.limit);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactService.remove(id);
  }
}
