import { BaseService, Result } from '../../common/services/base.service';
import { ContentRepository } from './content.repository';
import { ContentEntity } from './entities';
import { QueryContentDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class ContentService extends BaseService {
    private readonly contentRepository;
    constructor(contentRepository: ContentRepository);
    browse(query: QueryContentDto): Promise<Result<PaginatedResponseDto<ContentEntity>>>;
    search(q: string, limit?: number): Promise<Result<{
        items: ContentEntity[];
    }>>;
    getDetail(slug: string, userId?: string): Promise<Result<ContentEntity>>;
    getFeatured(): Promise<Result<{
        featured: ContentEntity[];
        recentlyAdded: ContentEntity[];
        topRated: ContentEntity[];
    }>>;
}
