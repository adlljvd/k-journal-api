import { BaseService, Result } from '../../common/services/base.service';
import { UserRepository, UserProfileRepository } from '../user';
import { JournalRepository, JournalEntryEntity } from '../journal';
import { ContentRepository } from '../content';
import { PrismaService } from '../../prisma/prisma.service';
import { PublicProfileDto, ProfileStatsDto, SearchUsersQueryDto, UserSearchResultDto, PublicJournalQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class ProfileService extends BaseService {
    private readonly userRepository;
    private readonly profileRepository;
    private readonly journalRepository;
    private readonly contentRepository;
    private readonly prismaService;
    constructor(userRepository: UserRepository, profileRepository: UserProfileRepository, journalRepository: JournalRepository, contentRepository: ContentRepository, prismaService: PrismaService);
    getProfile(username: string): Promise<Result<PublicProfileDto>>;
    getPublicJournal(username: string, query: PublicJournalQueryDto): Promise<Result<PaginatedResponseDto<JournalEntryEntity>>>;
    searchUsers(query: SearchUsersQueryDto): Promise<Result<{
        items: UserSearchResultDto[];
    }>>;
    calculateStats(userId: string): Promise<ProfileStatsDto>;
    private findUserByUsernameCaseInsensitive;
    private getProfileFavoritesContent;
}
