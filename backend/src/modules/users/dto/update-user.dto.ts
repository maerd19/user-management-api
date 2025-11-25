import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'newemail@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'Jane',
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Smith',
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  lastName?: string;
}
