import { Prisma } from '@prisma/client';
import { Role } from '../../../common/enums/role.enum';
import { UserProfileEntity } from './user-profile.entity';
export type UserPrismaPayload = Prisma.UserGetPayload<{
    include: {
        profile: true;
    };
}>;
export declare class UserEntity {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    role: Role;
    profile?: UserProfileEntity;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserPrismaPayload>);
}
