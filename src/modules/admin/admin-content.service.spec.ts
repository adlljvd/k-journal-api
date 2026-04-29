import { Test, TestingModule } from '@nestjs/testing';
import { AdminContentService } from './admin-content.service';
import { ContentRepository } from '../content/content.repository';
import { ContentType, Content } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  CreateContentDto,
  UpdateContentDto,
  QueryAdminContentDto,
} from './dto';

describe('AdminContentService', () => {
  let service: AdminContentService;
  let contentRepository: jest.Mocked<ContentRepository>;

  beforeEach(async () => {
    const mockContentRepository = {
      findBySlug: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminContentService,
        { provide: ContentRepository, useValue: mockContentRepository },
      ],
    }).compile();

    service = module.get<AdminContentService>(AdminContentService);
    contentRepository = module.get(ContentRepository);
  });

  describe('createContent', () => {
    const dto: CreateContentDto = {
      title: 'Test Content',
      type: ContentType.DRAMA,
      year: 2024,
      genres: ['Drama'],
      slug: 'test-content',
      isFeatured: false,
      country: 'South Korea',
    };

    it('should create content with auto-generated slug', async () => {
      contentRepository.findBySlug.mockResolvedValue(null);
      contentRepository.create.mockResolvedValue({
        id: '1',
        ...dto,
        slug: 'test-content',
      } as Content);

      const result = await service.createContent(dto);

      expect(result.slug).toBe('test-content');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'test-content',
        }),
      );
    });

    it('should throw ConflictException if slug already exists', async () => {
      contentRepository.findBySlug.mockResolvedValue({
        id: 'existing',
      } as Content);

      await expect(service.createContent(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateContent', () => {
    const id = '1';
    const dto: UpdateContentDto = { title: 'Updated Title' };

    it('should update content', async () => {
      contentRepository.findById.mockResolvedValue({
        id,
        title: 'Old',
      } as Content);
      contentRepository.update.mockResolvedValue({ id, ...dto } as Content);

      const result = await service.updateContent(id, dto);

      expect(result.title).toBe('Updated Title');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if content not found', async () => {
      contentRepository.findById.mockResolvedValue(null);

      await expect(service.updateContent(id, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if new slug already exists', async () => {
      const updateDto: UpdateContentDto = { slug: 'new-slug' };
      contentRepository.findById.mockResolvedValue({
        id,
        slug: 'old-slug',
      } as Content);
      contentRepository.findBySlug.mockResolvedValue({
        id: 'other',
        slug: 'new-slug',
      } as Content);

      await expect(service.updateContent(id, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteContent', () => {
    const id = '1';

    it('should delete content', async () => {
      contentRepository.findById.mockResolvedValue({ id } as Content);
      contentRepository.delete.mockResolvedValue({ id } as Content);

      await service.deleteContent(id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRepository.delete).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if content not found', async () => {
      contentRepository.findById.mockResolvedValue(null);

      await expect(service.deleteContent(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('listContent', () => {
    it('should return paginated content list', async () => {
      const query: QueryAdminContentDto = { page: 1, limit: 10 };
      contentRepository.findMany.mockResolvedValue([
        { id: '1', title: 'Test' },
      ] as Content[]);
      contentRepository.count.mockResolvedValue(1);

      const result = await service.listContent(query);

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(contentRepository.findMany).toHaveBeenCalled();
    });
  });
});
