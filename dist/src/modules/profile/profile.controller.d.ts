import { ProfileService } from './profile.service';
import { PublicProfileDto, SearchUsersQueryDto, UserSearchResultDto, PublicJournalQueryDto } from './dto';
import { BaseService } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { JournalEntryEntity } from '../journal/entities/journal-entry.entity';
export declare class ProfileController extends BaseService {
    private readonly profileService;
    constructor(profileService: ProfileService);
    searchUsers(query: SearchUsersQueryDto): Promise<{
        items: UserSearchResultDto[];
    }>;
    getProfile(username: string): Promise<PublicProfileDto>;
    getPublicJournal(username: string, query: PublicJournalQueryDto): Promise<PaginatedResponseDto<JournalEntryEntity>>;
}
