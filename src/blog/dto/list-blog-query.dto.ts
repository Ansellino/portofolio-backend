import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListBlogQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Public list filter; currently true-only behavior in service' })
  @IsOptional()
  @IsBooleanString()
  isPublished?: string;

  @ApiPropertyOptional({ example: 'backend' })
  @IsOptional()
  @IsString()
  category?: string;
}
