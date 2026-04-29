import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '../../../common/enums/content-type.enum';
import { Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export type ContentPrismaPayload = Prisma.ContentGetPayload<{
  include: {
    _count: {
      select: {
        journalEntries: true;
      };
    };
    journalEntries?: {
      where: { userId: string };
      take: 1;
    };
  };
}>;

@Exclude()
export class ContentEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Crash Landing on You' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'crash-landing-on-you' })
  @Expose()
  slug!: string;

  @ApiProperty({ enum: ContentType, example: ContentType.DRAMA })
  @Expose()
  type!: ContentType;

  @ApiProperty({ example: 2019 })
  @Expose()
  year!: number;

  @ApiPropertyOptional({
    example:
      'A paragliding mishap drops a South Korean heiress in North Korea...',
  })
  @Expose()
  synopsis?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @Expose()
  posterUrl?: string | null;

  @ApiProperty({ example: ['Romance', 'Comedy', 'Drama'] })
  @Expose()
  genres!: string[];

  @ApiPropertyOptional({ example: 'Hyun Bin, Son Ye-jin' })
  @Expose()
  cast?: string | null;

  @ApiPropertyOptional({
    example: 16,
    description: 'For dramas: total episodes',
  })
  @Expose()
  episodes?: number | null;

  @ApiPropertyOptional({
    example: 120,
    description: 'For movies: duration in minutes',
  })
  @Expose()
  durationMinutes?: number | null;

  @ApiProperty({ example: 'South Korea' })
  @Expose()
  country!: string;

  @ApiProperty({ example: false })
  @Expose()
  isFeatured!: boolean;

  @ApiProperty({ example: 4.5 })
  @Expose()
  avgRating: number = 0;

  @ApiProperty({ example: 1250 })
  @Expose()
  loggedCount: number = 0;

  @ApiPropertyOptional({
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'WATCHING',
      rating: 4.5,
      review: 'Great show!',
      isFavorite: true,
    },
  })
  @Expose()
  userEntry?: Record<string, unknown> | null;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  constructor(partial: Partial<ContentEntity>) {
    Object.assign(this, partial);

    // Ensure genres is an array if it comes as a string or null from DB
    if (typeof this.genres === 'string') {
      try {
        const parsed: unknown = JSON.parse(this.genres);
        this.genres = Array.isArray(parsed) ? (parsed as string[]) : [];
      } catch {
        this.genres = [];
      }
    } else if (!this.genres) {
      this.genres = [];
    }
  }
}
