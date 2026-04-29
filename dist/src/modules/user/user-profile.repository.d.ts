import { Prisma, UserProfile, Content } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
export interface UserProfileWithFavorites extends UserProfile {
    favorites: Content[];
}
export declare class UserProfileRepository extends BaseRepository<UserProfile, Prisma.UserProfileCreateInput, Prisma.UserProfileUpdateInput, Prisma.UserProfileWhereUniqueInput, Prisma.UserProfileWhereInput, Prisma.UserProfileDelegate> {
    constructor(prismaService: PrismaService, transactionClient?: unknown);
    protected getModel(): Prisma.UserProfileDelegate;
    findByUserId(userId: string): Promise<UserProfile | null>;
    findByUserIdWithFavorites(userId: string): Promise<UserProfileWithFavorites | null>;
}
