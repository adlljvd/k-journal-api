import { ContentRequest } from '@prisma/client';
import { ContentRequestEntity } from './content-request.entity';

export * from './content-request.entity';

export function toContentRequestEntity(
  request: ContentRequest,
): ContentRequestEntity {
  return new ContentRequestEntity(
    request as unknown as Partial<ContentRequestEntity>,
  );
}
