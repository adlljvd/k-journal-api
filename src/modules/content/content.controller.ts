import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { ContentEntity } from './entities';
import { QueryContentDto } from './dto';
import { BaseService, SuccessResult } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Content')
@Controller('content')
export class ContentController extends BaseService {
  constructor(private readonly contentService: ContentService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Browse content catalog' })
  @ApiResponse({ status: 200, description: 'Paginated list of content' })
  async browse(
    @Query() query: QueryContentDto,
  ): Promise<PaginatedResponseDto<ContentEntity>> {
    const result = await this.contentService.browse(query);
    this.throwIfError(result);
    return (result as SuccessResult<PaginatedResponseDto<ContentEntity>>).data;
  }

  @Get('search')
  @ApiOperation({ summary: 'Search content by title' })
  @ApiResponse({ status: 200, description: 'List of matching content' })
  async search(
    @Query('q') q: string,
    @Query('limit') limit?: number,
  ): Promise<{ items: ContentEntity[] }> {
    const result = await this.contentService.search(q, limit);
    this.throwIfError(result);
    return (result as SuccessResult<{ items: ContentEntity[] }>).data;
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured content for homepage' })
  @ApiResponse({
    status: 200,
    description: 'Featured, recently added, and top rated content',
  })
  async getFeatured(): Promise<{
    featured: ContentEntity[];
    recentlyAdded: ContentEntity[];
    topRated: ContentEntity[];
  }> {
    const result = await this.contentService.getFeatured();
    this.throwIfError(result);
    return (
      result as SuccessResult<{
        featured: ContentEntity[];
        recentlyAdded: ContentEntity[];
        topRated: ContentEntity[];
      }>
    ).data;
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get content detail' })
  @ApiResponse({ status: 200, type: ContentEntity })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async getDetail(
    @Param('slug') slug: string,
    @Req() req: RequestWithUser,
  ): Promise<ContentEntity> {
    const userId = req.user?.userId;
    const result = await this.contentService.getDetail(slug, userId);
    this.throwIfError(result);
    return (result as SuccessResult<ContentEntity>).data;
  }
}
