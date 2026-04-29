import { WatchStatus } from '../../../common/enums/watch-status.enum';
export declare class CreateJournalEntryDto {
    contentId: string;
    status: WatchStatus;
    rating?: number;
    review?: string;
    isFavorite?: boolean;
}
