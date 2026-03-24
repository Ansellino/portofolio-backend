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

const blogCategories = ['Tutorial', 'Guide', 'Opinion', 'Case Study'] as const;

export type BlogCategory = (typeof blogCategories)[number];

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(400)
  excerpt: string;

  @IsString()
  @MinLength(20)
  content: string;

  @IsIn(blogCategories)
  category: BlogCategory;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[];
}
