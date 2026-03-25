import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Throttle({ default: { ttl: 3600000, limit: 3 } })
  @Post()
  @ApiOperation({ summary: 'Submit contact message' })
  @ApiResponse({
    status: 201,
    description: 'Contact message submitted',
    schema: {
      example: {
        id: '88c1fa16-f7c8-489e-918b-e40d00d7a302',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        subject: 'Project inquiry',
        message: 'Can we discuss your backend architecture?',
        isRead: false,
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  submitMessage(@Body() dto: CreateContactDto) {
    return this.contactService.submitMessage(dto);
  }
}
