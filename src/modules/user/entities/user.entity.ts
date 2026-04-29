import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { Role } from '../../../common/enums/role.enum';
import { UserProfileEntity } from './user-profile.entity';

export type UserPrismaPayload = Prisma.UserGetPayload<{
  include: { profile: true };
}>;

@Exclude()
export class UserEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ example: 'kdrama_fan' })
  @Expose()
  username!: string;

  @Exclude()
  passwordHash!: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @Expose()
  role!: Role;

  @ApiPropertyOptional({ type: () => UserProfileEntity })
  @Expose()
  @Type(() => UserProfileEntity)
  profile?: UserProfileEntity;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  constructor(partial: Partial<UserPrismaPayload>) {
    if (partial) {
      const { profile, ...rest } = partial;
      Object.assign(this, rest);
      if (profile) {
        this.profile = new UserProfileEntity(profile);
      }
    }
  }
}
