export * from './user.entity';
export * from './user-profile.entity';
import { UserPrismaPayload, UserEntity } from './user.entity';
import { UserProfilePrismaPayload, UserProfileEntity } from './user-profile.entity';
export declare const toUserEntity: (prismaUser: UserPrismaPayload) => UserEntity;
export declare const toUserProfileEntity: (prismaProfile: UserProfilePrismaPayload) => UserProfileEntity;
