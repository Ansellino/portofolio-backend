import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto);
  }

  @Get()
  findOne() {
    return this.profileService.findOne();
  }

  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(dto);
  }

  @Delete()
  remove() {
    return this.profileService.remove();
  }
}
