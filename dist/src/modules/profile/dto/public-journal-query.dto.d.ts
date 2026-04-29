import { WatchStatus } from '../../../common/enums/watch-status.enum';
export declare class PublicJournalQueryDto {
    page?: number;
    limit?: number;
    status?: WatchStatus | 'ALL';
    sort?: 'updatedAt' | 'createdAt' | 'rating' | 'title';
    order?: 'asc' | 'desc';
}
