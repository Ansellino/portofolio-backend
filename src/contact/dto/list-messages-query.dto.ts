import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListMessagesQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter read status', enum: ['true', 'false'] })
  @IsOptional()
  @IsBooleanString()
  isRead?: string;
}
