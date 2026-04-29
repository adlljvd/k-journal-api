import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../../common/decorators/is-password.decorator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123' })
  @IsPassword()
  currentPassword!: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsPassword()
  newPassword!: string;
}
