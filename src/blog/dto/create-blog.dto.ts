import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const blogCategories = ['Tutorial', 'Guide', 'Opinion', 'Case Study'] as const;

export type BlogCategory = (typeof blogCategories)[number];

export class CreateBlogDto {
  @ApiProperty({ example: 'How I Built My Portfolio API', minLength: 3, maxLength: 200 })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'A walkthrough of architecture decisions and implementation details.',
    minLength: 10,
    maxLength: 400,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(400)
  excerpt: string;

  @ApiProperty({
    example: 'In this article we explore NestJS modules, Prisma setup, and deployment.',
    minLength: 20,
  })
  @IsString()
  @MinLength(20)
  content: string;

  @ApiProperty({ enum: blogCategories, example: 'Guide' })
  @IsIn(blogCategories)
  category: BlogCategory;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/blog/cover.jpg' })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional({ example: false })
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
