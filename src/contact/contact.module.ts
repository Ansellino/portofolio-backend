import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { AdminMessagesController } from './admin-messages.controller';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController, AdminMessagesController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
