import { Module } from '@nestjs/common';
import { AdminProfileController } from './admin-profile.controller';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController, AdminProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
