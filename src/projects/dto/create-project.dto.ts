import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio Backend' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'portfolio-backend' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'A scalable portfolio backend built with NestJS.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'Detailed markdown or rich text content.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/projects/backend-cover.png' })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'https://portfolio.example.com' })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username/portfolio-backend' })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2025-03-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    type: [String],
    example: ['9c4b8d57-7ce0-42f9-9c8c-f1b95c8e2b97'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[];
}
