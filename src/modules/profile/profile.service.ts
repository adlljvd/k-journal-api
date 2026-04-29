import { Injectable } from '@nestjs/common';
import { BaseService, Result } from '../../common/services/base.service';
import { UserRepository, UserProfileRepository } from '../user';
import {
  JournalRepository,
  JournalEntryEntity,
  JournalEntryPrismaPayload,
} from '../journal';
import { ContentRepository, ContentEntity } from '../content';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorCode } from '../../common/enums/error-code.enum';
import {
  PublicProfileDto,
  ProfileStatsDto,
  SearchUsersQueryDto,
  UserSearchResultDto,
  PublicJournalQueryDto,
} from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class ProfileService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: UserProfileRepository,
    private readonly journalRepository: JournalRepository,
    private readonly contentRepository: ContentRepository,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  /**
   * Get public user profile with favorites and stats
   */
  async getProfile(username: string): Promise<Result<PublicProfileDto>> {
    // Case-insensitive username lookup
    const user = await this.findUserByUsernameCaseInsensitive(username);
    if (!user) {
      return this.notFound('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const [profile, stats, profileFavorites] = await Promise.all([
      this.profileRepository.findByUserId(user.id),
      this.calculateStats(user.id),
      this.getProfileFavoritesContent(user.id),
    ]);

    const publicProfile = new PublicProfileDto();
    publicProfile.id = user.id;
    publicProfile.username = user.username;
    publicProfile.profile = profile
      ? {
          userId: profile.userId,
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
          profileFavorites: profile.profileFavorites as string[] | null,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        }
      : undefined;
    publicProfile.profileFavorites = profileFavorites;
    publicProfile.stats = stats;

    return this.success(publicProfile);
  }

  /**
   * Get user's public journal entries (paginated)
   */
  async getPublicJournal(
    username: string,
    query: PublicJournalQueryDto,
  ): Promise<Result<PaginatedResponseDto<JournalEntryEntity>>> {
    // Case-insensitive username lookup
    const user = await this.findUserByUsernameCaseInsensitive(username);
    if (!user) {
      return this.notFound('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const result = await this.journalRepository.findPaginatedByUser({
      userId: user.id,
      page: query.page,
      limit: query.limit,
      status: query.status,
      sort: query.sort,
      order: query.order,
    });

    const entities = result.items.map(
      (entry) =>
        new JournalEntryEntity(entry as unknown as JournalEntryPrismaPayload),
    );

    return this.success(
      new PaginatedResponseDto<JournalEntryEntity>(
        entities,
        result.meta.total,
        result.meta.page,
        result.meta.limit,
      ),
    );
  }

  /**
   * Search users by username (case-insensitive partial match)
   */
  async searchUsers(
    query: SearchUsersQueryDto,
  ): Promise<Result<{ items: UserSearchResultDto[] }>> {
    const limit = query.limit ?? 10;

    const users = await this.prismaService.user.findMany({
      where: {
        username: {
          contains: query.q,
          mode: 'insensitive',
        },
      },
      take: limit,
      include: {
        profile: true,
      },
    });

    const items = users.map((user) => {
      const result = new UserSearchResultDto();
      result.id = user.id;
      result.username = user.username;
      result.profile = user.profile
        ? {
            avatarUrl: user.profile.avatarUrl,
            bio: user.profile.bio,
          }
        : undefined;
      return result;
    });

    return this.success({ items });
  }

  /**
   * Calculate stats for a user: totalLogged, meanRating, favoritesCount
   */
  async calculateStats(userId: string): Promise<ProfileStatsDto> {
    const [totalLogged, favoritesCount, meanRating] = await Promise.all([
      this.journalRepository.countTotalByUser(userId),
      this.journalRepository.countFavoritesByUser(userId),
      this.journalRepository.getMeanRatingByUser(userId),
    ]);

    const stats = new ProfileStatsDto();
    stats.totalLogged = totalLogged;
    stats.meanRating = parseFloat(meanRating.toFixed(1));
    stats.favoritesCount = favoritesCount;

    return stats;
  }

  /**
   * Find user by username (case-insensitive)
   */
  private async findUserByUsernameCaseInsensitive(
    username: string,
  ): Promise<User | null> {
    // Prisma's unique constraint on username is case-insensitive with CITEXT
    // but findUnique doesn't support mode: 'insensitive', so we use findFirst
    const user = await this.prismaService.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    return user;
  }

  /**
   * Get profile favorites content details
   */
  private async getProfileFavoritesContent(
    userId: string,
  ): Promise<ContentEntity[] | undefined> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile || !profile.profileFavorites) {
      return undefined;
    }

    const favoriteIds = profile.profileFavorites as string[];
    if (favoriteIds.length === 0) {
      return undefined;
    }

    const contents = await this.contentRepository.findMany({
      id: { in: favoriteIds },
    });

    // Preserve order from profileFavorites array
    const orderedContents = favoriteIds
      .map((id) => contents.find((c) => c.id === id))
      .filter(Boolean);

    return orderedContents.map(
      (content) =>
        new ContentEntity(content as unknown as Partial<ContentEntity>),
    );
  }
}
