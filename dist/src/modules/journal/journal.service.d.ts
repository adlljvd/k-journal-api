import { BaseService, Result } from '../../common/services/base.service';
import { JournalRepository } from './journal.repository';
import { ContentRepository } from '../content/content.repository';
import { UserProfileRepository } from '../user/user-profile.repository';
import { JournalEntryEntity } from './entities/journal-entry.entity';
import { CreateJournalEntryDto, UpdateJournalEntryDto, QueryJournalEntryDto, SetProfileFavoritesDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class JournalService extends BaseService {
    private readonly journalRepository;
    private readonly contentRepository;
    private readonly profileRepository;
    constructor(journalRepository: JournalRepository, contentRepository: ContentRepository, profileRepository: UserProfileRepository);
    create(userId: string, dto: CreateJournalEntryDto): Promise<Result<JournalEntryEntity>>;
    getEntries(userId: string, query: QueryJournalEntryDto): Promise<Result<PaginatedResponseDto<JournalEntryEntity>>>;
    getEntry(id: string, userId: string): Promise<Result<JournalEntryEntity>>;
    update(id: string, userId: string, dto: UpdateJournalEntryDto): Promise<Result<JournalEntryEntity>>;
    delete(id: string, userId: string): Promise<Result<void>>;
    getFavorites(userId: string): Promise<Result<{
        items: JournalEntryEntity[];
        profileFavorites: string[];
    }>>;
    setProfileFavorites(userId: string, dto: SetProfileFavoritesDto): Promise<Result<{
        profileFavorites: string[];
    }>>;
    getStats(userId: string): Promise<Result<{
        totalLogged: number;
        meanRating: number;
        favoritesCount: number;
    }>>;
}
