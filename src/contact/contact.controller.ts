import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Throttle({ default: { ttl: 3600000, limit: 3 } })
  @Post()
  submitMessage(@Body() dto: CreateContactDto) {
    return this.contactService.submitMessage(dto);
  }
}
