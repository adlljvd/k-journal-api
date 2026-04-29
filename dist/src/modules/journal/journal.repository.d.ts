import { Prisma, JournalEntry, WatchStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare const JOURNAL_ENTRY_INCLUDE: {
    readonly content: true;
};
export declare class JournalRepository extends BaseRepository<JournalEntry, Prisma.JournalEntryCreateInput, Prisma.JournalEntryUpdateInput, Prisma.JournalEntryWhereUniqueInput, Prisma.JournalEntryWhereInput, Prisma.JournalEntryDelegate> {
    constructor(prismaService: PrismaService, transactionClient?: unknown);
    protected getModel(): Prisma.JournalEntryDelegate;
    findByUserAndContent(userId: string, contentId: string): Promise<JournalEntry | null>;
    findPaginatedByUser(options: {
        userId: string;
        page?: number;
        limit?: number;
        status?: WatchStatus | 'ALL';
        sort?: 'updatedAt' | 'createdAt' | 'rating' | 'title';
        order?: 'asc' | 'desc';
    }): Promise<PaginatedResponseDto<JournalEntry>>;
    findByFavorites(userId: string): Promise<JournalEntry[]>;
    findByIdWithOwner(id: string, userId: string): Promise<JournalEntry | null>;
    countTotalByUser(userId: string): Promise<number>;
    countRatedByUser(userId: string): Promise<number>;
    countFavoritesByUser(userId: string): Promise<number>;
    getMeanRatingByUser(userId: string): Promise<number>;
}
