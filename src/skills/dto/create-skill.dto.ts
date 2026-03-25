import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ example: 'NestJS' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Backend' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/icons/nest.svg' })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
