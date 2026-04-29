import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ContentType } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({ example: 'My Sassy Girl' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'my-sassy-girl' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ enum: ContentType, example: ContentType.MOVIE })
  @IsEnum(ContentType)
  type!: ContentType;

  @ApiProperty({ example: 2001 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year!: number;

  @ApiPropertyOptional({ example: 'A young man meets a drunk girl...' })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiProperty({ example: ['Romance', 'Comedy'] })
  @IsArray()
  @IsString({ each: true })
  genres!: string[];

  @ApiPropertyOptional({ example: 'Jun Ji-hyun, Cha Tae-hyun' })
  @IsOptional()
  @IsString()
  cast?: string;

  @ApiPropertyOptional({ example: 16 })
  @IsOptional()
  @IsInt()
  @Min(1)
  episodes?: number;

  @ApiPropertyOptional({ example: 123 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 'South Korea' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  isFeatured?: boolean;
}
