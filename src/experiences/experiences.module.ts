import { Module } from '@nestjs/common';
import { AdminExperiencesController } from './admin-experiences.controller';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

@Module({
  controllers: [ExperiencesController, AdminExperiencesController],
  providers: [ExperiencesService],
})
export class ExperiencesModule {}
