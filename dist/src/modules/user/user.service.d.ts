import { BaseService, Result } from '../../common/services/base.service';
import { UserRepository } from './user.repository';
import { UserProfileRepository } from './user-profile.repository';
import { UserEntity } from './entities/user.entity';
import { UpdateProfileDto, ChangePasswordDto, ChangeEmailDto, DeleteAccountDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class UserService extends BaseService {
    private readonly userRepository;
    private readonly profileRepository;
    private readonly prismaService;
    constructor(userRepository: UserRepository, profileRepository: UserProfileRepository, prismaService: PrismaService);
    getCurrentUser(userId: string): Promise<Result<UserEntity>>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<Result<UserEntity>>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<Result<void>>;
    changeEmail(userId: string, dto: ChangeEmailDto): Promise<Result<void>>;
    deleteAccount(userId: string, dto: DeleteAccountDto): Promise<Result<void>>;
    calculateStats(userId: string): Promise<Result<{
        totalLogged: number;
        meanRating: number;
        favoritesCount: number;
    }>>;
}
