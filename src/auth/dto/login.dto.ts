import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@portfolio.dev' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'supersecret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
