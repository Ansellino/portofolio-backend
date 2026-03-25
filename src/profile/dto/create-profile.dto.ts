import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ example: 'Jeremy Ansellino Gunawan' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'Backend Engineer' })
  @IsString()
  headline: string;

  @ApiProperty({ example: 'I build robust APIs with NestJS and Prisma.' })
  @IsString()
  bio: string;

  @ApiProperty({ example: 'jeremy@portfolio.dev' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/resume.pdf' })
  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @ApiPropertyOptional({ example: '+6281234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Jakarta, Indonesia' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username' })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;
}
