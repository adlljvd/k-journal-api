import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../modules/user/user.repository';
import { UserProfileRepository } from '../modules/user/user-profile.repository';
import {
  UserEntity,
  UserPrismaPayload,
} from '../modules/user/entities/user.entity';
import { ErrorCode } from '../common/enums/error-code.enum';
import { Role } from '../common/enums/role.enum';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

// Token expiration constants (NFR-005)
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_DEFAULT_DAYS = 7; // 7 days
const REFRESH_TOKEN_REMEMBER_ME_DAYS = 30; // 30 days
const PASSWORD_RESET_EXPIRES_HOURS = 24; // 24 hours

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: UserProfileRepository,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * - Validates unique email/username
   * - Hashes password with argon2id
   * - Creates user + profile
   * - Returns tokens
   */
  async register(dto: RegisterDto): Promise<AuthResult> {
    // Check for existing email (case-insensitive due to CITEXT)
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException({
        code: ErrorCode.EMAIL_ALREADY_EXISTS,
        message: 'An account with this email already exists.',
      });
    }

    // Check for existing username (case-insensitive due to CITEXT)
    const existingUsername = await this.userRepository.findByUsername(
      dto.username,
    );
    if (existingUsername) {
      throw new ConflictException({
        code: ErrorCode.USERNAME_ALREADY_EXISTS,
        message: 'This username is already taken.',
      });
    }

    // Hash password with argon2id
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3, // 3 iterations
      parallelism: 4, // 4 threads
    });

    // Create user and profile in transaction
    const user = await this.prismaService.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          username: dto.username,
          passwordHash,
          role: Role.USER,
        },
        include: { profile: true },
      });

      // Create profile with defaults
      await tx.userProfile.create({
        data: {
          userId: newUser.id,
          avatarUrl: null,
          bio: null,
          profileFavorites: [],
        },
      });

      return newUser;
    });

    // Fetch user with profile for entity
    const userWithProfile = await this.userRepository.findByIdWithProfile(
      user.id,
    );

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      false,
    );

    return {
      user: new UserEntity(userWithProfile as UserPrismaPayload),
      ...tokens,
    };
  }

  /**
   * Login user
   * - Validates credentials with constant-time comparison
   * - Returns tokens
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    // Find user by email (case-insensitive)
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // Verify password with constant-time comparison (argon2 does this internally)
    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // Fetch user with profile
    const userWithProfile = await this.userRepository.findByIdWithProfile(
      user.id,
    );

    // Generate tokens with rememberMe option
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      dto.rememberMe ?? false,
    );

    return {
      user: new UserEntity(userWithProfile as UserPrismaPayload),
      ...tokens,
    };
  }

  /**
   * Logout user
   * - Invalidates refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    // Hash the token to find it in database
    const tokenHash = this.hashToken(refreshToken);

    // Delete the refresh token
    await this.prismaService.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  /**
   * Refresh tokens
   * - Validates refresh token
   * - Generates new access/refresh pair
   * - Old refresh token cannot be reused (rotation)
   */
  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    // Hash the token to find it in database
    const tokenHash = this.hashToken(dto.refreshToken);

    // Find the refresh token
    const storedToken = await this.prismaService.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_INVALID,
        message: 'Invalid refresh token.',
      });
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await this.prismaService.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_EXPIRED,
        message: 'Refresh token has expired.',
      });
    }

    // Delete old token (rotation)
    await this.prismaService.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    // Calculate rememberMe based on previous token expiry
    const daysDiff = Math.ceil(
      (storedToken.expiresAt.getTime() - storedToken.createdAt.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const rememberMe = daysDiff > REFRESH_TOKEN_DEFAULT_DAYS;

    return this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
      rememberMe,
    );
  }

  /**
   * Forgot password
   * - Generates reset token (expires 24h)
   * - Stores hashed token
   * - Returns generic message for security
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      // Return generic message for security (don't reveal if email exists)
      return {
        message:
          'If an account exists with this email, you will receive a reset link.',
      };
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = this.hashToken(resetToken);
    const expiresAt = new Date(
      Date.now() + PASSWORD_RESET_EXPIRES_HOURS * 60 * 60 * 1000,
    );

    // For MVP, we'll just log and return
    this.logger.log(
      `Password reset token generated for user ${user.id}: ${resetToken}`,
    );
    this.logger.log(
      `Token hash: ${resetTokenHash}, Expires: ${expiresAt.toISOString()}`,
    );

    return {
      message:
        'If an account exists with this email, you will receive a reset link.',
    };
  }

  /**
   * Reset password
   * - Validates token
   * - Updates password
   */
  resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    // For MVP, this is a placeholder
    // Full implementation requires passwordResetToken and passwordResetExpires fields

    // Hash the provided token (unused for MVP placeholder, but needed for future implementation)
    this.hashToken(dto.token);

    // In a full implementation, we'd:
    // 1. Find user by passwordResetToken hash
    // 2. Check if passwordResetExpires > now
    // 3. Hash new password and update
    // 4. Clear reset token fields

    // For now, throw invalid token
    throw new BadRequestException({
      code: ErrorCode.INVALID_TOKEN,
      message: 'Invalid or expired reset token.',
    });
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    rememberMe: boolean,
  ): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: userId,
      email,
      role,
    };

    // Generate access token (15 minutes)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    // Determine refresh token expiry
    const refreshDays = rememberMe
      ? REFRESH_TOKEN_REMEMBER_ME_DAYS
      : REFRESH_TOKEN_DEFAULT_DAYS;
    const refreshExpiresAt = new Date(
      Date.now() + refreshDays * 24 * 60 * 60 * 1000,
    );

    // Generate refresh token
    const refreshToken = randomBytes(64).toString('hex');
    const refreshTokenHash = this.hashToken(refreshToken);

    // Store hashed refresh token
    await this.prismaService.refreshToken.create({
      data: {
        userId,
        tokenHash: refreshTokenHash,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Hash a token using SHA-256 (deterministic for lookup)
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
