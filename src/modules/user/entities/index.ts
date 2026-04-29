export * from './user.entity';
export * from './user-profile.entity';

import { UserPrismaPayload, UserEntity } from './user.entity';
import {
  UserProfilePrismaPayload,
  UserProfileEntity,
} from './user-profile.entity';

export const toUserEntity = (prismaUser: UserPrismaPayload): UserEntity => {
  return new UserEntity(prismaUser);
};

export const toUserProfileEntity = (
  prismaProfile: UserProfilePrismaPayload,
): UserProfileEntity => {
  return new UserProfileEntity(prismaProfile);
};
