import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ContentType } from '../../../common/enums/content-type.enum';

export enum ContentSortBy {
  TITLE = 'title',
  YEAR = 'year',
  RATING = 'rating',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryContentDto {
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

  @ApiPropertyOptional({ enum: ContentType, default: 'ALL' })
  @IsOptional()
  @IsString()
  type?: ContentType | 'ALL' = 'ALL';

  @ApiPropertyOptional({ description: 'Comma-separated genres' })
  @IsOptional()
  @IsString()
  genres?: string;

  @ApiPropertyOptional({ enum: ContentSortBy, default: ContentSortBy.TITLE })
  @IsOptional()
  @IsEnum(ContentSortBy)
  sort: ContentSortBy = ContentSortBy.TITLE;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.ASC;
}
