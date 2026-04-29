import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RejectRequestDto {
  @ApiProperty({ example: 'Content already exists in catalog' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
