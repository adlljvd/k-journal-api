import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { WatchStatus } from '../../../common/enums/watch-status.enum';
import { ContentEntity } from '../../content/entities/content.entity';
import { UserEntity } from '../../user/entities/user.entity';

export type JournalEntryPrismaPayload = Prisma.JournalEntryGetPayload<{
  include: {
    content: true;
    user: {
      include: { profile: true };
    };
  };
}>;

@Exclude()
export class JournalEntryEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  userId!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  contentId!: string;

  @ApiProperty({ enum: WatchStatus, example: WatchStatus.COMPLETED })
  @Expose()
  status!: WatchStatus;

  @ApiPropertyOptional({ example: 4.5, minimum: 0.5, maximum: 5.0 })
  @Expose()
  @Type(() => Number)
  rating?: number | null;

  @ApiPropertyOptional({ example: 'A masterpiece of storytelling.' })
  @Expose()
  review?: string | null;

  @ApiProperty({ example: false })
  @Expose()
  isFavorite!: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiPropertyOptional({ type: () => ContentEntity })
  @Expose()
  @Type(() => ContentEntity)
  content?: ContentEntity;

  @ApiPropertyOptional({ type: () => UserEntity })
  @Expose()
  @Type(() => UserEntity)
  user?: UserEntity;

  constructor(partial: Partial<JournalEntryPrismaPayload>) {
    if (partial) {
      const { content, user, rating, ...rest } = partial;
      Object.assign(this, rest);

      if (rating !== undefined) {
        this.rating = rating !== null ? Number(rating) : null;
      }

      if (content) {
        this.content = new ContentEntity(
          content as unknown as Partial<ContentEntity>,
        );
      }

      if (user) {
        this.user = new UserEntity(user);
      }

      if (user) {
        this.user = new UserEntity(user);
      }
    }
  }
}
