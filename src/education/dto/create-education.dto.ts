import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty({ example: 'Universitas Indonesia' })
  @IsString()
  institution: string;

  @ApiProperty({ example: 'Bachelor of Computer Science' })
  @IsString()
  degree: string;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  fieldOfStudy: string;

  @ApiPropertyOptional({ example: 3.8, minimum: 0, maximum: 4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  gpa?: number;

  @ApiPropertyOptional({ example: 'Focused on software engineering and data systems.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2019-08-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2023-06-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
