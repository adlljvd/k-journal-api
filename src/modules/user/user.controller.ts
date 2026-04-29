import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { BaseService, SuccessResult } from '../../common/services/base.service';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController extends BaseService {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserEntity })
  async getMe(@Req() req: RequestWithUser): Promise<UserEntity> {
    const result = await this.userService.getCurrentUser(req.user.userId);
    this.throwIfError(result);
    return (result as SuccessResult<UserEntity>).data;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: UserEntity })
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserEntity> {
    const result = await this.userService.updateProfile(req.user.userId, dto);
    this.throwIfError(result);
    return (result as SuccessResult<UserEntity>).data;
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    const result = await this.userService.changePassword(req.user.userId, dto);
    this.throwIfError(result);
  }

  @Patch('me/email')
  @ApiOperation({ summary: 'Change email' })
  @ApiResponse({ status: 200, description: 'Email changed successfully' })
  async changeEmail(
    @Req() req: RequestWithUser,
    @Body() dto: ChangeEmailDto,
  ): Promise<void> {
    const result = await this.userService.changeEmail(req.user.userId, dto);
    this.throwIfError(result);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  async deleteAccount(
    @Req() req: RequestWithUser,
    @Body() dto: DeleteAccountDto,
  ): Promise<void> {
    const result = await this.userService.deleteAccount(req.user.userId, dto);
    this.throwIfError(result);
  }
}
