import { Module } from '@nestjs/common';
import { AdminEducationController } from './admin-education.controller';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  controllers: [EducationController, AdminEducationController],
  providers: [EducationService],
})
export class EducationModule {}
