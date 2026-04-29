import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import {
  PublicProfileDto,
  SearchUsersQueryDto,
  UserSearchResultDto,
  PublicJournalQueryDto,
} from './dto';
import { BaseService, SuccessResult } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { JournalEntryEntity } from '../journal/entities/journal-entry.entity';

@ApiTags('Users')
@Controller('users')
export class ProfileController extends BaseService {
  constructor(private readonly profileService: ProfileService) {
    super();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by username' })
  @ApiResponse({
    status: 200,
    description: 'List of matching users',
    type: [UserSearchResultDto],
  })
  async searchUsers(
    @Query() query: SearchUsersQueryDto,
  ): Promise<{ items: UserSearchResultDto[] }> {
    const result = await this.profileService.searchUsers(query);
    this.throwIfError(result);
    return (result as SuccessResult<{ items: UserSearchResultDto[] }>).data;
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get public user profile' })
  @ApiResponse({ status: 200, type: PublicProfileDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(
    @Param('username') username: string,
  ): Promise<PublicProfileDto> {
    const result = await this.profileService.getProfile(username);
    this.throwIfError(result);
    return (result as SuccessResult<PublicProfileDto>).data;
  }

  @Get(':username/journal')
  @ApiOperation({ summary: "Get user's public journal entries" })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of journal entries',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getPublicJournal(
    @Param('username') username: string,
    @Query() query: PublicJournalQueryDto,
  ): Promise<PaginatedResponseDto<JournalEntryEntity>> {
    const result = await this.profileService.getPublicJournal(username, query);
    this.throwIfError(result);
    return (result as SuccessResult<PaginatedResponseDto<JournalEntryEntity>>)
      .data;
  }
}
