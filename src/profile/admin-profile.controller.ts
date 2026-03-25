import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('admin-profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/profile')
export class AdminProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findOne() {
    return this.profileService.findOne();
  }

  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(dto);
  }
}
