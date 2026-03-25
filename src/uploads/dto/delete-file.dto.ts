import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileDto {
  @ApiProperty({ example: 'f6ab902a-38ac-4d24-be5e-246ec9a5cc8f-project.png' })
  @IsString()
  @MinLength(1)
  filename: string;
}
