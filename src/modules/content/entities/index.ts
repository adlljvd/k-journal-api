import { Content, Genre } from '@prisma/client';
import { ContentEntity } from './content.entity';
import { GenreEntity } from './genre.entity';

export * from './content.entity';
export * from './genre.entity';

export function toContentEntity(content: Content): ContentEntity {
  return new ContentEntity(content as unknown as Partial<ContentEntity>);
}

export function toGenreEntity(genre: Genre): GenreEntity {
  return new GenreEntity(genre);
}
