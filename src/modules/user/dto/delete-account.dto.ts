import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../../common/decorators/is-password.decorator';

export class DeleteAccountDto {
  @ApiProperty({ example: 'password123' })
  @IsPassword()
  password!: string;
}
