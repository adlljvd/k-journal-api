import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentType } from '../../../common/enums/content-type.enum';

export class CreateContentRequestDto {
  @ApiProperty({
    example: 'My Love from the Star',
    description: 'Title of the requested content (1-255 chars)',
  })
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    enum: ContentType,
    example: ContentType.DRAMA,
    description: 'Type of content (DRAMA or MOVIE)',
  })
  @IsEnum(ContentType)
  type!: ContentType;

  @ApiPropertyOptional({
    example: 2013,
    description: 'Release year (optional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    example: 'Please add this drama, it is a classic!',
    description: 'Additional notes (optional)',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
