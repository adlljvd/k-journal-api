import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../modules/user/user.repository';
import { UserProfileRepository } from '../modules/user/user-profile.repository';
import { UserEntity } from '../modules/user/entities/user.entity';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
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
export declare class AuthService {
    private readonly userRepository;
    private readonly profileRepository;
    private readonly prismaService;
    private readonly jwtService;
    private readonly logger;
    constructor(userRepository: UserRepository, profileRepository: UserProfileRepository, prismaService: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthResult>;
    login(dto: LoginDto): Promise<AuthResult>;
    logout(refreshToken: string): Promise<void>;
    refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateTokens;
    private hashToken;
}
