import { Prisma, Content, ContentType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare const CONTENT_INCLUDE: {
    readonly _count: {
        readonly select: {
            readonly journalEntries: true;
        };
    };
};
export declare class ContentRepository extends BaseRepository<Content, Prisma.ContentCreateInput, Prisma.ContentUpdateInput, Prisma.ContentWhereUniqueInput, Prisma.ContentWhereInput, Prisma.ContentDelegate> {
    constructor(prismaService: PrismaService, transactionClient?: unknown);
    protected getModel(): Prisma.ContentDelegate;
    findBySlug(slug: string): Promise<Content | null>;
    findBySlugWithUserEntry(slug: string, userId: string): Promise<Content | null>;
    findByIdWithUserEntry(id: string, userId: string): Promise<Content | null>;
    findPaginatedContent(options: {
        page?: number;
        limit?: number;
        type?: ContentType;
        genres?: string[];
        sort?: 'title' | 'year' | 'rating';
        order?: 'asc' | 'desc';
    }): Promise<PaginatedResponseDto<Content>>;
    searchByTitle(q: string, limit?: number): Promise<Content[]>;
    findFeatured(): Promise<Content[]>;
    findRecentlyAdded(limit?: number): Promise<Content[]>;
    private findPaginatedWithRatingSort;
    getAverageRatings(contentIds: string[]): Promise<Record<string, number>>;
    findTopRated(limit?: number, minRatings?: number): Promise<Content[]>;
}
