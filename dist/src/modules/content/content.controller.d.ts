import { ContentService } from './content.service';
import { ContentEntity } from './entities';
import { QueryContentDto } from './dto';
import { BaseService } from '../../common/services/base.service';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class ContentController extends BaseService {
    private readonly contentService;
    constructor(contentService: ContentService);
    browse(query: QueryContentDto): Promise<PaginatedResponseDto<ContentEntity>>;
    search(q: string, limit?: number): Promise<{
        items: ContentEntity[];
    }>;
    getFeatured(): Promise<{
        featured: ContentEntity[];
        recentlyAdded: ContentEntity[];
        topRated: ContentEntity[];
    }>;
    getDetail(slug: string, req: RequestWithUser): Promise<ContentEntity>;
}
