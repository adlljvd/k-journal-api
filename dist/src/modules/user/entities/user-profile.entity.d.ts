import { Prisma } from '@prisma/client';
export type UserProfilePrismaPayload = Prisma.UserProfileGetPayload<object>;
export declare class UserProfileEntity {
    userId: string;
    avatarUrl: string | null;
    bio: string | null;
    profileFavorites: string[] | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserProfilePrismaPayload>);
}
