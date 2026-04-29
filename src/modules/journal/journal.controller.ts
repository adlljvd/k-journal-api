import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { JournalEntryEntity } from './entities';
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  QueryJournalEntryDto,
  SetProfileFavoritesDto,
} from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BaseService, SuccessResult } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Journal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('journal')
export class JournalController extends BaseService {
  constructor(private readonly journalService: JournalService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: "Get current user's journal entries" })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of journal entries',
  })
  async getEntries(
    @Req() req: RequestWithUser,
    @Query() query: QueryJournalEntryDto,
  ): Promise<PaginatedResponseDto<JournalEntryEntity>> {
    const result = await this.journalService.getEntries(req.user.userId, query);
    this.throwIfError(result);
    return (result as SuccessResult<PaginatedResponseDto<JournalEntryEntity>>)
      .data;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new journal entry' })
  @ApiResponse({ status: 201, type: JournalEntryEntity })
  @ApiResponse({ status: 409, description: 'Entry already exists' })
  async create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateJournalEntryDto,
  ): Promise<JournalEntryEntity> {
    const result = await this.journalService.create(req.user.userId, dto);
    this.throwIfError(result);
    return (result as SuccessResult<JournalEntryEntity>).data;
  }

  @Get('favorites')
  @ApiOperation({ summary: "Get user's favorite entries" })
  @ApiResponse({ status: 200, description: 'List of favorite entries' })
  async getFavorites(@Req() req: RequestWithUser): Promise<{
    items: JournalEntryEntity[];
    profileFavorites: string[];
  }> {
    const result = await this.journalService.getFavorites(req.user.userId);
    this.throwIfError(result);
    return (
      result as SuccessResult<{
        items: JournalEntryEntity[];
        profileFavorites: string[];
      }>
    ).data;
  }

  @Patch('favorites/profile')
  @ApiOperation({ summary: 'Set profile favorites' })
  @ApiResponse({ status: 200, description: 'Profile favorites updated' })
  async setProfileFavorites(
    @Req() req: RequestWithUser,
    @Body() dto: SetProfileFavoritesDto,
  ): Promise<{ profileFavorites: string[] }> {
    const result = await this.journalService.setProfileFavorites(
      req.user.userId,
      dto,
    );
    this.throwIfError(result);
    return (result as SuccessResult<{ profileFavorites: string[] }>).data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry UUID' })
  @ApiResponse({ status: 200, type: JournalEntryEntity })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async getEntry(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<JournalEntryEntity> {
    const result = await this.journalService.getEntry(id, req.user.userId);
    this.throwIfError(result);
    return (result as SuccessResult<JournalEntryEntity>).data;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry UUID' })
  @ApiResponse({ status: 200, type: JournalEntryEntity })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateJournalEntryDto,
  ): Promise<JournalEntryEntity> {
    const result = await this.journalService.update(id, req.user.userId, dto);
    this.throwIfError(result);
    return (result as SuccessResult<JournalEntryEntity>).data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry UUID' })
  @ApiResponse({ status: 204, description: 'Entry deleted' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async delete(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<void> {
    const result = await this.journalService.delete(id, req.user.userId);
    this.throwIfError(result);
  }
}
