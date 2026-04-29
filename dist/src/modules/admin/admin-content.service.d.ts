import { ContentRepository } from '../content/content.repository';
import { CreateContentDto, UpdateContentDto, QueryAdminContentDto } from './dto';
import { ContentEntity } from '../content/entities';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class AdminContentService {
    private readonly contentRepository;
    constructor(contentRepository: ContentRepository);
    createContent(dto: CreateContentDto): Promise<ContentEntity>;
    updateContent(id: string, dto: UpdateContentDto): Promise<ContentEntity>;
    deleteContent(id: string): Promise<void>;
    listContent(query: QueryAdminContentDto): Promise<PaginatedResponseDto<ContentEntity>>;
    private slugify;
}
