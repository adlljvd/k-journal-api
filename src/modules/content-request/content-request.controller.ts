import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContentRequestService } from './content-request.service';
import { ContentRequestEntity } from './entities';
import { CreateContentRequestDto, QueryContentRequestDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BaseService, SuccessResult } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Content Requests')
@Controller('content-requests')
export class ContentRequestController extends BaseService {
  constructor(private readonly contentRequestService: ContentRequestService) {
    super();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a content request' })
  @ApiResponse({ status: 201, description: 'Request submitted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 429,
    description: 'Daily limit exceeded (5 requests per user per day)',
  })
  @ApiResponse({ status: 409, description: 'Duplicate request' })
  async createRequest(
    @Body() dto: CreateContentRequestDto,
    @Req() req: RequestWithUser,
  ): Promise<ContentRequestEntity> {
    const result = await this.contentRequestService.createRequest(
      req.user.userId,
      dto,
    );
    this.throwIfError(result);
    return (result as SuccessResult<ContentRequestEntity>).data;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's content requests" })
  @ApiResponse({ status: 200, description: 'List of user requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyRequests(
    @Query() query: QueryContentRequestDto,
    @Req() req: RequestWithUser,
  ): Promise<PaginatedResponseDto<ContentRequestEntity>> {
    const result = await this.contentRequestService.getMyRequests(
      req.user.userId,
      query,
    );
    this.throwIfError(result);
    return (result as SuccessResult<PaginatedResponseDto<ContentRequestEntity>>)
      .data;
  }
}
