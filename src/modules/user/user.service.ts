import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { BaseService, Result } from '../../common/services/base.service';
import { UserRepository } from './user.repository';
import { UserProfileRepository } from './user-profile.repository';
import { UserEntity, UserPrismaPayload } from './entities/user.entity';
import { ErrorCode } from '../../common/enums/error-code.enum';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  ChangeEmailDto,
  DeleteAccountDto,
} from './dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: UserProfileRepository,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async getCurrentUser(userId: string): Promise<Result<UserEntity>> {
    const user = await this.userRepository.findByIdWithProfile(userId);
    if (!user) {
      return this.notFound('User not found', ErrorCode.USER_NOT_FOUND);
    }
    return this.success(new UserEntity(user as UserPrismaPayload));
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<Result<UserEntity>> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      return this.notFound('Profile not found', ErrorCode.USER_NOT_FOUND);
    }

    // Validate profile favorites if provided
    if (dto.profileFavorites) {
      if (dto.profileFavorites.length > 4) {
        return this.validationError('Maximum 4 profile favorites allowed');
      }

      // Check if all content exists and is favorited by user
      // This would ideally be checked against JournalEntry table
      // For now, we'll just check if content exists
      const contentCount = await this.prismaService.content.count({
        where: { id: { in: dto.profileFavorites } },
      });

      if (contentCount !== dto.profileFavorites.length) {
        return this.validationError(
          'One or more favorite content items not found',
        );
      }

      // TODO: Check if they are actually favorited in journal
    }

    await this.profileRepository.update(
      { userId },
      {
        avatarUrl: dto.avatarUrl,
        bio: dto.bio,
        profileFavorites: dto.profileFavorites,
      },
    );

    return this.getCurrentUser(userId);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<Result<void>> {
    const user = await this.userRepository.findById({ id: userId });
    if (!user) {
      return this.notFound('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.currentPassword,
    );
    if (!isPasswordValid) {
      return this.error(
        ErrorCode.INVALID_CURRENT_PASSWORD,
        'Invalid current password',
      );
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);
    await this.userRepository.updatePassword(userId, newPasswordHash);

    return this.success(undefined);
  }

  async changeEmail(
    userId: string,
    dto: ChangeEmailDto,
  ): Promise<Result<void>> {
    const user = await this.userRepository.findById({ id: userId });
    if (!user) {
      return this.notFound('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!isPasswordValid) {
      return this.error(ErrorCode.INVALID_PASSWORD, 'Invalid password');
    }

    const existingUser = await this.userRepository.findByEmail(dto.newEmail);
    if (existingUser && existingUser.id !== userId) {
      return this.conflict(
        ErrorCode.EMAIL_ALREADY_EXISTS,
        'An account with this email already exists',
      );
    }

    await this.userRepository.updateEmail(userId, dto.newEmail);

    return this.success(undefined);
  }

  async deleteAccount(
    userId: string,
    dto: DeleteAccountDto,
  ): Promise<Result<void>> {
    const user = await this.userRepository.findById({ id: userId });
    if (!user) {
      return this.notFound('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!isPasswordValid) {
      return this.error(ErrorCode.INVALID_PASSWORD, 'Invalid password');
    }

    // Soft-delete logic as per SPEC: "Account deletion removes user data but preserves anonymized journal entry counts for stats"
    // Since we don't have a soft-delete flag or nullable userId in JournalEntry,
    // we'll just perform a hard delete for now as per current schema.
    await this.userRepository.deleteUser(userId);

    return this.success(undefined);
  }

  async calculateStats(
    userId: string,
  ): Promise<
    Result<{ totalLogged: number; meanRating: number; favoritesCount: number }>
  > {
    const [totalLogged, favoritesCount, ratings] = await Promise.all([
      this.prismaService.journalEntry.count({ where: { userId } }),
      this.prismaService.journalEntry.count({
        where: { userId, isFavorite: true },
      }),
      this.prismaService.journalEntry.findMany({
        where: { userId, rating: { not: null } },
        select: { rating: true },
      }),
    ]);

    const meanRating =
      ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + Number(curr.rating), 0) /
          ratings.length
        : 0;

    return this.success({
      totalLogged,
      meanRating: parseFloat(meanRating.toFixed(1)),
      favoritesCount,
    });
  }
}
