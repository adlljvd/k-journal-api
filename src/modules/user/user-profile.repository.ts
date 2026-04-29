import { Injectable, Inject, Optional } from '@nestjs/common';
import { Prisma, UserProfile, Content } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BaseRepository,
  PRISMA_TRANSACTION,
} from '../../common/repositories/base.repository';

export interface UserProfileWithFavorites extends UserProfile {
  favorites: Content[];
}

@Injectable()
export class UserProfileRepository extends BaseRepository<
  UserProfile,
  Prisma.UserProfileCreateInput,
  Prisma.UserProfileUpdateInput,
  Prisma.UserProfileWhereUniqueInput,
  Prisma.UserProfileWhereInput,
  Prisma.UserProfileDelegate
> {
  constructor(
    prismaService: PrismaService,
    @Optional()
    @Inject(PRISMA_TRANSACTION)
    transactionClient?: unknown,
  ) {
    super(prismaService, transactionClient);
  }

  protected getModel(): Prisma.UserProfileDelegate {
    return this.prismaService.userProfile;
  }

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.withRetry(
      () => this.getClient().findUnique({ where: { userId } }),
      'findByUserId',
    );
  }

  async findByUserIdWithFavorites(
    userId: string,
  ): Promise<UserProfileWithFavorites | null> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      return null;
    }

    if (!profile.profileFavorites) {
      return { ...profile, favorites: [] };
    }

    const favoriteIds = profile.profileFavorites as string[];
    if (favoriteIds.length === 0) {
      return { ...profile, favorites: [] };
    }

    const favorites = await this.prismaService.content.findMany({
      where: {
        id: { in: favoriteIds },
      },
    });

    return {
      ...profile,
      favorites,
    };
  }
}
