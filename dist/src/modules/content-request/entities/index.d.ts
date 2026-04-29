import { ContentRequest } from '@prisma/client';
import { ContentRequestEntity } from './content-request.entity';
export * from './content-request.entity';
export declare function toContentRequestEntity(request: ContentRequest): ContentRequestEntity;
