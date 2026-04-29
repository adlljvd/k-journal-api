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
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AdminService } from './admin.service';
import { AdminContentService } from './admin-content.service';
import { AdminContentRequestService } from './admin-content-request.service';
import {
  ApproveRequestDto,
  RejectRequestDto,
  CreateContentDto,
  UpdateContentDto,
  QueryAdminContentDto,
} from './dto';
import { AdminDashboardEntity } from './entities/admin-dashboard.entity';
import { ContentRequestEntity } from '../content-request/entities/content-request.entity';
import { ContentEntity } from '../content/entities/content.entity';
import { RequestStatus } from '@prisma/client';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminContentService: AdminContentService,
    private readonly adminContentRequestService: AdminContentRequestService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard summary' })
  @ApiResponse({ status: 200, type: AdminDashboardEntity })
  getDashboard(): Promise<AdminDashboardEntity> {
    return this.adminService.getDashboard();
  }

  @Get('content-requests')
  @ApiOperation({ summary: 'Get all content requests (admin view)' })
  @ApiResponse({ status: 200 })
  getAllRequests(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: RequestStatus | 'ALL',
  ): Promise<PaginatedResponseDto<ContentRequestEntity>> {
    return this.adminContentRequestService.getAllRequests({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status,
    });
  }

  @Post('content-requests/:id/approve')
  @ApiOperation({ summary: 'Approve content request' })
  @ApiResponse({ status: 200 })
  approveRequest(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() dto: ApproveRequestDto,
  ): Promise<{ request: ContentRequestEntity; content: unknown }> {
    return this.adminContentRequestService.approveRequest(
      id,
      req.user.userId,
      dto,
    );
  }

  @Post('content-requests/:id/reject')
  @ApiOperation({ summary: 'Reject content request' })
  @ApiResponse({ status: 200, type: ContentRequestEntity })
  rejectRequest(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() dto: RejectRequestDto,
  ): Promise<ContentRequestEntity> {
    return this.adminContentRequestService.rejectRequest(
      id,
      req.user.userId,
      dto,
    );
  }

  @Post('content')
  @ApiOperation({ summary: 'Create content directly' })
  @ApiResponse({ status: 201, type: ContentEntity })
  createContent(@Body() dto: CreateContentDto): Promise<ContentEntity> {
    return this.adminContentService.createContent(dto);
  }

  @Patch('content/:id')
  @ApiOperation({ summary: 'Update content' })
  @ApiResponse({ status: 200, type: ContentEntity })
  updateContent(
    @Param('id') id: string,
    @Body() dto: UpdateContentDto,
  ): Promise<ContentEntity> {
    return this.adminContentService.updateContent(id, dto);
  }

  @Delete('content/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete content' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  deleteContent(@Param('id') id: string): Promise<void> {
    return this.adminContentService.deleteContent(id);
  }

  @Get('content')
  @ApiOperation({ summary: 'List all content for admin management' })
  @ApiResponse({ status: 200 })
  listContent(
    @Query() query: QueryAdminContentDto,
  ): Promise<PaginatedResponseDto<ContentEntity>> {
    return this.adminContentService.listContent(query);
  }
}
