import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export type UserProfilePrismaPayload = Prisma.UserProfileGetPayload<object>;

@Exclude()
export class UserProfileEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  userId!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  @Expose()
  avatarUrl!: string | null;

  @ApiPropertyOptional({ example: 'K-drama enthusiast', nullable: true })
  @Expose()
  bio!: string | null;

  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440001'],
    type: [String],
    nullable: true,
  })
  @Expose()
  profileFavorites!: string[] | null;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  constructor(partial: Partial<UserProfilePrismaPayload>) {
    if (partial) {
      const { profileFavorites, ...rest } = partial;
      Object.assign(this, rest);
      this.profileFavorites = profileFavorites as string[] | null;
    }
  }
}
