import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsUsername } from '../../common/decorators/is-username.decorator';
import { IsPassword } from '../../common/decorators/is-password.decorator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({
    example: 'kdrama_fan',
    description:
      '3-30 chars, alphanumeric + underscore, must start with letter',
  })
  @IsUsername({
    message:
      'Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores',
  })
  username!: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Minimum 8 characters',
  })
  @IsPassword({ message: 'Password must be at least 8 characters long' })
  password!: string;
}
