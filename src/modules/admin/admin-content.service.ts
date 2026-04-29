import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ContentRepository } from '../content/content.repository';
import {
  CreateContentDto,
  UpdateContentDto,
  QueryAdminContentDto,
} from './dto';
import { ContentEntity, toContentEntity } from '../content/entities';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminContentService {
  constructor(private readonly contentRepository: ContentRepository) {}

  async createContent(dto: CreateContentDto): Promise<ContentEntity> {
    const slug = dto.slug || this.slugify(dto.title);

    const existing = await this.contentRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException({
        code: ErrorCode.VALIDATION_FAILED,
        message: `Content with slug ${slug} already exists`,
      });
    }

    const content = await this.contentRepository.create({
      title: dto.title,
      slug,
      type: dto.type,
      year: dto.year,
      synopsis: dto.synopsis,
      posterUrl: dto.posterUrl,
      genres: dto.genres, // Prisma expects JsonValue
      cast: dto.cast,
      episodes: dto.episodes,
      durationMinutes: dto.durationMinutes,
      country: dto.country || 'South Korea',
      isFeatured: dto.isFeatured || false,
    });

    return toContentEntity(content);
  }

  async updateContent(
    id: string,
    dto: UpdateContentDto,
  ): Promise<ContentEntity> {
    const existing = await this.contentRepository.findById({ id });
    if (!existing) {
      throw new NotFoundException({
        code: ErrorCode.VALIDATION_FAILED,
        message: `Content with ID ${id} not found`,
      });
    }

    if (dto.slug) {
      const slugConflict = await this.contentRepository.findBySlug(dto.slug);
      if (slugConflict && slugConflict.id !== id) {
        throw new ConflictException({
          code: ErrorCode.VALIDATION_FAILED,
          message: `Content with slug ${dto.slug} already exists`,
        });
      }
    }

    const updated = await this.contentRepository.update(
      { id },
      {
        ...dto,
        genres: dto.genres,
      },
    );

    return toContentEntity(updated);
  }

  async deleteContent(id: string): Promise<void> {
    const existing = await this.contentRepository.findById({ id });
    if (!existing) {
      throw new NotFoundException({
        code: ErrorCode.VALIDATION_FAILED,
        message: `Content with ID ${id} not found`,
      });
    }

    await this.contentRepository.delete({ id });
  }

  async listContent(
    query: QueryAdminContentDto,
  ): Promise<PaginatedResponseDto<ContentEntity>> {
    const { page, limit, search, type, sort, order } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContentWhereInput = {
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(type && (type as string) !== 'ALL' && { type }),
    };

    const [items, total] = await Promise.all([
      this.contentRepository.findMany(where, {
        skip,
        take: limit,
        orderBy: { [sort || 'createdAt']: order || 'desc' },
      }),
      this.contentRepository.count(where),
    ]);

    return new PaginatedResponseDto<ContentEntity>(
      items.map((item) => toContentEntity(item)),
      total,
      page,
      limit,
    );
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }
}
