import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { WatchStatus } from '../../../common/enums/watch-status.enum';

export class PublicJournalQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: WatchStatus,
    enumName: 'WatchStatus',
    description: 'Filter by watch status',
  })
  @IsOptional()
  @IsEnum(WatchStatus)
  status?: WatchStatus | 'ALL';

  @ApiPropertyOptional({
    enum: ['updatedAt', 'createdAt', 'rating', 'title'],
    default: 'updatedAt',
  })
  @IsOptional()
  @IsString()
  sort?: 'updatedAt' | 'createdAt' | 'rating' | 'title' = 'updatedAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}
