import { WatchStatus } from '../../../common/enums/watch-status.enum';
export declare enum JournalSortBy {
    UPDATED_AT = "updatedAt",
    CREATED_AT = "createdAt",
    RATING = "rating",
    TITLE = "title"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class QueryJournalEntryDto {
    page: number;
    limit: number;
    status?: WatchStatus | 'ALL';
    sort: JournalSortBy;
    order: SortOrder;
}
