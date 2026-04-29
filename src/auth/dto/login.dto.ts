import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsBoolean, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password!: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Extend session to 30 days',
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
