import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsPassword } from '../../common/decorators/is-password.decorator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: 'newSecurePassword123',
    description: 'Minimum 8 characters',
  })
  @IsPassword({ message: 'Password must be at least 8 characters long' })
  password!: string;
}
