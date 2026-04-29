import { Prisma } from '@prisma/client';
import { WatchStatus } from '../../../common/enums/watch-status.enum';
import { ContentEntity } from '../../content/entities/content.entity';
import { UserEntity } from '../../user/entities/user.entity';
export type JournalEntryPrismaPayload = Prisma.JournalEntryGetPayload<{
    include: {
        content: true;
        user: {
            include: {
                profile: true;
            };
        };
    };
}>;
export declare class JournalEntryEntity {
    id: string;
    userId: string;
    contentId: string;
    status: WatchStatus;
    rating?: number | null;
    review?: string | null;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
    content?: ContentEntity;
    user?: UserEntity;
    constructor(partial: Partial<JournalEntryPrismaPayload>);
}
