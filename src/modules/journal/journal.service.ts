import { Injectable } from '@nestjs/common';
import { BaseService, Result } from '../../common/services/base.service';
import { JournalRepository } from './journal.repository';
import { ContentRepository } from '../content/content.repository';
import { UserProfileRepository } from '../user/user-profile.repository';
import { JournalEntryEntity } from './entities/journal-entry.entity';
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  QueryJournalEntryDto,
  SetProfileFavoritesDto,
} from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { JournalEntryPrismaPayload } from './entities/journal-entry.entity';

@Injectable()
export class JournalService extends BaseService {
  constructor(
    private readonly journalRepository: JournalRepository,
    private readonly contentRepository: ContentRepository,
    private readonly profileRepository: UserProfileRepository,
  ) {
    super();
  }

  async create(
    userId: string,
    dto: CreateJournalEntryDto,
  ): Promise<Result<JournalEntryEntity>> {
    // Validate content exists
    const content = await this.contentRepository.findById({
      id: dto.contentId,
    });
    if (!content) {
      return this.notFound('Content not found', ErrorCode.VALIDATION_FAILED);
    }

    // Check uniqueness
    const existing = await this.journalRepository.findByUserAndContent(
      userId,
      dto.contentId,
    );
    if (existing) {
      return this.conflict(
        ErrorCode.ENTRY_ALREADY_EXISTS,
        'Journal entry for this content already exists',
      );
    }

    await this.journalRepository.create({
      user: { connect: { id: userId } },
      content: { connect: { id: dto.contentId } },
      status: dto.status,
      rating: dto.rating,
      review: dto.review,
      isFavorite: dto.isFavorite ?? false,
    });

    // Fetch with relations for the entity
    const fullEntry = await this.journalRepository.findByUserAndContent(
      userId,
      dto.contentId,
    );

    return this.success(
      new JournalEntryEntity(fullEntry as JournalEntryPrismaPayload),
    );
  }

  async getEntries(
    userId: string,
    query: QueryJournalEntryDto,
  ): Promise<Result<PaginatedResponseDto<JournalEntryEntity>>> {
    const result = await this.journalRepository.findPaginatedByUser({
      userId,
      page: query.page,
      limit: query.limit,
      status: query.status,
      sort: query.sort,
      order: query.order,
    });

    const entities = result.items.map(
      (item) => new JournalEntryEntity(item as JournalEntryPrismaPayload),
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

  async getEntry(
    id: string,
    userId: string,
  ): Promise<Result<JournalEntryEntity>> {
    const entry = await this.journalRepository.findByIdWithOwner(id, userId);
    if (!entry) {
      return this.notFound('Journal entry not found', ErrorCode.USER_NOT_FOUND);
    }

    return this.success(
      new JournalEntryEntity(entry as JournalEntryPrismaPayload),
    );
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateJournalEntryDto,
  ): Promise<Result<JournalEntryEntity>> {
    const entry = await this.journalRepository.findByIdWithOwner(id, userId);
    if (!entry) {
      return this.notFound('Journal entry not found', ErrorCode.USER_NOT_FOUND);
    }

    await this.journalRepository.update({ id }, dto);

    // Fetch with relations
    const fullEntry = await this.journalRepository.findByIdWithOwner(
      id,
      userId,
    );

    return this.success(
      new JournalEntryEntity(fullEntry as JournalEntryPrismaPayload),
    );
  }

  async delete(id: string, userId: string): Promise<Result<void>> {
    const entry = await this.journalRepository.findByIdWithOwner(id, userId);
    if (!entry) {
      return this.notFound('Journal entry not found', ErrorCode.USER_NOT_FOUND);
    }

    await this.journalRepository.delete({ id });

    return this.success(undefined);
  }

  async getFavorites(userId: string): Promise<
    Result<{
      items: JournalEntryEntity[];
      profileFavorites: string[];
    }>
  > {
    const [favorites, profile] = await Promise.all([
      this.journalRepository.findByFavorites(userId),
      this.profileRepository.findByUserId(userId),
    ]);

    const entities = favorites.map(
      (item) => new JournalEntryEntity(item as JournalEntryPrismaPayload),
    );

    const profileFavorites = (profile?.profileFavorites as string[]) || [];

    return this.success({
      items: entities,
      profileFavorites,
    });
  }

  async setProfileFavorites(
    userId: string,
    dto: SetProfileFavoritesDto,
  ): Promise<Result<{ profileFavorites: string[] }>> {
    // Validate entries exist, belong to user, and are marked as favorite
    const entries = await this.journalRepository.findMany({
      id: { in: dto.entryIds },
      userId,
      isFavorite: true,
    });

    if (entries.length !== dto.entryIds.length) {
      return this.validationError(
        'One or more entries not found, not owned by you, or not marked as favorite',
      );
    }

    // Update profile
    await this.profileRepository.update(
      { userId },
      { profileFavorites: dto.entryIds },
    );

    return this.success({
      profileFavorites: dto.entryIds,
    });
  }

  async getStats(userId: string): Promise<
    Result<{
      totalLogged: number;
      meanRating: number;
      favoritesCount: number;
    }>
  > {
    const [totalLogged, , favoritesCount, meanRating] = await Promise.all([
      this.journalRepository.countTotalByUser(userId),
      this.journalRepository.countRatedByUser(userId),
      this.journalRepository.countFavoritesByUser(userId),
      this.journalRepository.getMeanRatingByUser(userId),
    ]);

    return this.success({
      totalLogged,
      meanRating: parseFloat(meanRating.toFixed(1)),
      favoritesCount,
    });
  }
}
