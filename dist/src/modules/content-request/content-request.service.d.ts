import { BaseService, Result } from '../../common/services/base.service';
import { ContentRequestRepository } from './content-request.repository';
import { ContentRequestEntity } from './entities';
import { CreateContentRequestDto, QueryContentRequestDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class ContentRequestService extends BaseService {
    private readonly contentRequestRepository;
    constructor(contentRequestRepository: ContentRequestRepository);
    createRequest(userId: string, dto: CreateContentRequestDto): Promise<Result<ContentRequestEntity>>;
    getMyRequests(userId: string, query: QueryContentRequestDto): Promise<Result<PaginatedResponseDto<ContentRequestEntity>>>;
    checkDailyLimit(userId: string): Promise<Result<{
        remaining: number;
    }>>;
}
