import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: import("../modules/user").UserEntity;
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: import("../modules/user").UserEntity;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(body: {
        refreshToken?: string;
    }): Promise<{
        message: string;
    }>;
    refresh(dto: RefreshTokenDto): Promise<import("./auth.service").AuthTokens>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
