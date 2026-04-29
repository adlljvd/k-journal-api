import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsPassword } from '../../../common/decorators/is-password.decorator';

export class ChangeEmailDto {
  @ApiProperty({ example: 'password123' })
  @IsPassword()
  password!: string;

  @ApiProperty({ example: 'new-email@example.com' })
  @IsEmail()
  newEmail!: string;
}
