import { ContentType } from '../../../common/enums/content-type.enum';
import { Prisma } from '@prisma/client';
export type ContentPrismaPayload = Prisma.ContentGetPayload<{
    include: {
        _count: {
            select: {
                journalEntries: true;
            };
        };
        journalEntries?: {
            where: {
                userId: string;
            };
            take: 1;
        };
    };
}>;
export declare class ContentEntity {
    id: string;
    title: string;
    slug: string;
    type: ContentType;
    year: number;
    synopsis?: string | null;
    posterUrl?: string | null;
    genres: string[];
    cast?: string | null;
    episodes?: number | null;
    durationMinutes?: number | null;
    country: string;
    isFeatured: boolean;
    avgRating: number;
    loggedCount: number;
    userEntry?: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ContentEntity>);
}
