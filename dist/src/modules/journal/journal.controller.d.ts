import { JournalService } from './journal.service';
import { JournalEntryEntity } from './entities';
import { CreateJournalEntryDto, UpdateJournalEntryDto, QueryJournalEntryDto, SetProfileFavoritesDto } from './dto';
import { BaseService } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class JournalController extends BaseService {
    private readonly journalService;
    constructor(journalService: JournalService);
    getEntries(req: RequestWithUser, query: QueryJournalEntryDto): Promise<PaginatedResponseDto<JournalEntryEntity>>;
    create(req: RequestWithUser, dto: CreateJournalEntryDto): Promise<JournalEntryEntity>;
    getFavorites(req: RequestWithUser): Promise<{
        items: JournalEntryEntity[];
        profileFavorites: string[];
    }>;
    setProfileFavorites(req: RequestWithUser, dto: SetProfileFavoritesDto): Promise<{
        profileFavorites: string[];
    }>;
    getEntry(req: RequestWithUser, id: string): Promise<JournalEntryEntity>;
    update(req: RequestWithUser, id: string, dto: UpdateJournalEntryDto): Promise<JournalEntryEntity>;
    delete(req: RequestWithUser, id: string): Promise<void>;
}
