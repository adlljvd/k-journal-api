import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { WatchStatus } from '../../../common/enums/watch-status.enum';
import { IsRating } from '../../../common/decorators/is-rating.decorator';

export class CreateJournalEntryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  contentId!: string;

  @ApiProperty({ enum: WatchStatus, example: WatchStatus.WATCHING })
  @IsEnum(WatchStatus)
  status!: WatchStatus;

  @ApiPropertyOptional({ example: 4.5, minimum: 0.5, maximum: 5.0 })
  @IsOptional()
  @IsRating()
  rating?: number;

  @ApiPropertyOptional({ example: 'A masterpiece of storytelling.' })
  @IsOptional()
  @IsString()
  review?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean = false;
}
