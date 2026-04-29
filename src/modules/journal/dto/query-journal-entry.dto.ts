import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { WatchStatus } from '../../../common/enums/watch-status.enum';

export enum JournalSortBy {
  UPDATED_AT = 'updatedAt',
  CREATED_AT = 'createdAt',
  RATING = 'rating',
  TITLE = 'title',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryJournalEntryDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ enum: WatchStatus, default: 'ALL' })
  @IsOptional()
  @IsString()
  status?: WatchStatus | 'ALL' = 'ALL';

  @ApiPropertyOptional({
    enum: JournalSortBy,
    default: JournalSortBy.UPDATED_AT,
  })
  @IsOptional()
  @IsEnum(JournalSortBy)
  sort: JournalSortBy = JournalSortBy.UPDATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;
}
