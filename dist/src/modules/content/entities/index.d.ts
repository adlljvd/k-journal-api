import { Content, Genre } from '@prisma/client';
import { ContentEntity } from './content.entity';
import { GenreEntity } from './genre.entity';
export * from './content.entity';
export * from './genre.entity';
export declare function toContentEntity(content: Content): ContentEntity;
export declare function toGenreEntity(genre: Genre): GenreEntity;
