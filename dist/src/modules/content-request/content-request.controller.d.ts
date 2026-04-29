import { ContentRequestService } from './content-request.service';
import { ContentRequestEntity } from './entities';
import { CreateContentRequestDto, QueryContentRequestDto } from './dto';
import { BaseService } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class ContentRequestController extends BaseService {
    private readonly contentRequestService;
    constructor(contentRequestService: ContentRequestService);
    createRequest(dto: CreateContentRequestDto, req: RequestWithUser): Promise<ContentRequestEntity>;
    getMyRequests(query: QueryContentRequestDto, req: RequestWithUser): Promise<PaginatedResponseDto<ContentRequestEntity>>;
}
