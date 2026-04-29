import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContentDto } from './create-content.dto';

export class ApproveRequestDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateContentDto)
  contentData!: CreateContentDto;
}
