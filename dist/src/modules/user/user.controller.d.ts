import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { BaseService } from '../../common/services/base.service';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class UserController extends BaseService {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: RequestWithUser): Promise<UserEntity>;
    updateMe(req: RequestWithUser, dto: UpdateProfileDto): Promise<UserEntity>;
    changePassword(req: RequestWithUser, dto: ChangePasswordDto): Promise<void>;
    changeEmail(req: RequestWithUser, dto: ChangeEmailDto): Promise<void>;
    deleteAccount(req: RequestWithUser, dto: DeleteAccountDto): Promise<void>;
}
