import { EmploymentType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

function normalizeResponsibilities(value: unknown): unknown {
  if (value === undefined) return undefined;

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|;/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return value;
}

export class CreateExperienceDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Backend Engineer' })
  @IsString()
  position: string;

  @ApiPropertyOptional({ example: 'Built and maintained scalable APIs.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: [String],
    example: ['Developed REST APIs', 'Optimized PostgreSQL queries'],
  })
  @Transform(({ value }) => normalizeResponsibilities(value))
  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logos/tech-corp.png' })
  @IsOptional()
  @IsUrl()
  companyLogoUrl?: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Jakarta, Indonesia' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ enum: EmploymentType, example: EmploymentType.FULL_TIME })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
