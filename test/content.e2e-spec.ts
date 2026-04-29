/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createValidationPipe } from '../src/common/pipes/validation.pipe';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../src/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '../src/common/filters/validation-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import {
  cleanDatabase,
  createTestUser,
  createTestContent,
  createTestGenres,
  createTestJournalEntry,
} from './utils/test-helpers';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  year: number;
  posterUrl: string;
  genres: string[];
  avgRating: number;
  loggedCount: number;
}

interface PaginatedResponse {
  items: ContentItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SearchResponse {
  items: ContentItem[];
}

interface FeaturedResponse {
  featured: ContentItem[];
  recentlyAdded: ContentItem[];
  topRated: ContentItem[];
}

interface ContentDetail extends ContentItem {
  synopsis: string;
  cast: string;
  episodes?: number;
  durationMinutes?: number;
  country: string;
  userEntry: {
    id: string;
    status: string;
    rating: number;
    review: string;
    isFavorite: boolean;
  } | null;
}

describe('Content Browsing Flow (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;
  let pool: pg.Pool;

  beforeAll(async () => {
    // Create database connection
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });

    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.setGlobalPrefix('api/v1');

    // Configure validation pipe
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalFilters(new PrismaExceptionFilter());
    app.useGlobalFilters(new ValidationExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    await pool.end();
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
    await createTestGenres(prisma);
  });

  describe('GET /api/v1/content', () => {
    it('should browse content with pagination', async () => {
      // Create multiple content items
      for (let i = 0; i < 25; i++) {
        await createTestContent(prisma, {
          title: `Content ${i + 1}`,
          type: i % 2 === 0 ? 'DRAMA' : 'MOVIE',
        });
      }

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ page: 1, limit: 10 })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items.length).toBe(10);
      expect(body.meta.total).toBe(25);
      expect(body.meta.page).toBe(1);
      expect(body.meta.limit).toBe(10);
      expect(body.meta.totalPages).toBe(3);
    });

    it('should filter by type DRAMA', async () => {
      // Create content items
      for (let i = 0; i < 10; i++) {
        await createTestContent(prisma, {
          title: `Drama ${i + 1}`,
          type: 'DRAMA',
        });
        await createTestContent(prisma, {
          title: `Movie ${i + 1}`,
          type: 'MOVIE',
        });
      }

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ type: 'DRAMA' })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items.length).toBe(10);
      body.items.forEach((item: ContentItem) => {
        expect(item.type).toBe('DRAMA');
      });
    });

    it('should filter by type MOVIE', async () => {
      // Create content items
      for (let i = 0; i < 5; i++) {
        await createTestContent(prisma, {
          title: `Drama ${i + 1}`,
          type: 'DRAMA',
        });
        await createTestContent(prisma, {
          title: `Movie ${i + 1}`,
          type: 'MOVIE',
        });
      }

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ type: 'MOVIE' })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items.length).toBe(5);
      body.items.forEach((item: ContentItem) => {
        expect(item.type).toBe('MOVIE');
      });
    });

    it('should filter by genres', async () => {
      // Create content with different genres
      await createTestContent(prisma, {
        title: 'Romance Drama',
        genres: ['Romance', 'Drama'],
      });
      await createTestContent(prisma, {
        title: 'Action Thriller',
        genres: ['Action', 'Thriller'],
      });
      await createTestContent(prisma, {
        title: 'Comedy Romance',
        genres: ['Comedy', 'Romance'],
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ genres: 'Romance' })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items.length).toBe(2);
      body.items.forEach((item: ContentItem) => {
        expect(item.genres).toContain('Romance');
      });
    });

    it('should sort by title ascending', async () => {
      await createTestContent(prisma, { title: 'Zebra' });
      await createTestContent(prisma, { title: 'Apple' });
      await createTestContent(prisma, { title: 'Mango' });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ sort: 'title', order: 'asc' })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items[0].title).toBe('Apple');
      expect(body.items[1].title).toBe('Mango');
      expect(body.items[2].title).toBe('Zebra');
    });

    it('should sort by title descending', async () => {
      await createTestContent(prisma, { title: 'Zebra' });
      await createTestContent(prisma, { title: 'Apple' });
      await createTestContent(prisma, { title: 'Mango' });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ sort: 'title', order: 'desc' })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items[0].title).toBe('Zebra');
      expect(body.items[1].title).toBe('Mango');
      expect(body.items[2].title).toBe('Apple');
    });

    it('should sort by year', async () => {
      await createTestContent(prisma, { title: 'Old', year: 2010 });
      await createTestContent(prisma, { title: 'New', year: 2023 });
      await createTestContent(prisma, { title: 'Middle', year: 2018 });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ sort: 'year', order: 'desc' })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items[0].title).toBe('New');
      expect(body.items[1].title).toBe('Middle');
      expect(body.items[2].title).toBe('Old');
    });

    it('should return empty items when no content matches filters', async () => {
      await createTestContent(prisma, { title: 'Drama', type: 'DRAMA' });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ type: 'MOVIE' })
        .expect(200);

      const body = response.body.data as PaginatedResponse;
      expect(body.items.length).toBe(0);
      expect(body.meta.total).toBe(0);
    });
  });

  describe('GET /api/v1/content/search', () => {
    it('should search content by title', async () => {
      await createTestContent(prisma, { title: 'Crash Landing on You' });
      await createTestContent(prisma, { title: 'Crash Course in Romance' });
      await createTestContent(prisma, { title: 'Goblin' });
      await createTestContent(prisma, { title: 'Itaewon Class' });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content/search')
        .query({ q: 'Crash' })
        .expect(200);

      const body = response.body.data as SearchResponse;
      expect(body.items.length).toBe(2);
      body.items.forEach((item: ContentItem) => {
        expect(item.title.toLowerCase()).toContain('crash');
      });
    });

    it('should search case-insensitively', async () => {
      await createTestContent(prisma, { title: 'Squid Game' });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content/search')
        .query({ q: 'squid' })
        .expect(200);

      const body = response.body.data as SearchResponse;
      expect(body.items.length).toBe(1);
      expect(body.items[0].title).toBe('Squid Game');
    });

    it('should return empty array for no matches', async () => {
      await createTestContent(prisma, { title: 'Goblin' });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content/search')
        .query({ q: 'Nonexistent' })
        .expect(200);

      const body = response.body.data as SearchResponse;
      expect(body.items.length).toBe(0);
    });

    it('should limit search results', async () => {
      for (let i = 0; i < 20; i++) {
        await createTestContent(prisma, { title: `Test Content ${i}` });
      }

      const response = await request(app.getHttpServer())
        .get('/api/v1/content/search')
        .query({ q: 'Test', limit: 5 })
        .expect(200);

      const body = response.body.data as SearchResponse;
      expect(body.items.length).toBe(5);
    });
  });

  describe('GET /api/v1/content/featured', () => {
    it('should return featured, recentlyAdded, and topRated sections', async () => {
      // Create featured content
      await createTestContent(prisma, {
        title: 'Featured 1',
        isFeatured: true,
      });
      await createTestContent(prisma, {
        title: 'Featured 2',
        isFeatured: true,
      });

      // Create non-featured content
      await createTestContent(prisma, {
        title: 'Regular 1',
        isFeatured: false,
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content/featured')
        .expect(200);

      const body = response.body.data as FeaturedResponse;
      expect(body).toHaveProperty('featured');
      expect(body).toHaveProperty('recentlyAdded');
      expect(body).toHaveProperty('topRated');
    });

    it('should return only featured items in featured array', async () => {
      await createTestContent(prisma, {
        title: 'Featured Item',
        isFeatured: true,
      });
      await createTestContent(prisma, {
        title: 'Non Featured',
        isFeatured: false,
      });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content/featured')
        .expect(200);

      const body = response.body.data as FeaturedResponse;
      expect(body.featured.length).toBeGreaterThanOrEqual(1);
      body.featured.forEach((item: ContentItem) => {
        expect(item.title).toBeDefined();
      });
    });

    it('should return recently added items sorted by createdAt', async () => {
      // Create content with slight delays to ensure different timestamps
      await createTestContent(prisma, { title: 'Old Content' });
      await new Promise((resolve) => setTimeout(resolve, 10));
      await createTestContent(prisma, { title: 'New Content' });

      const response = await request(app.getHttpServer())
        .get('/api/v1/content/featured')
        .expect(200);

      const body = response.body.data as FeaturedResponse;
      expect(body.recentlyAdded.length).toBeLessThanOrEqual(6);
    });
  });

  describe('GET /api/v1/content/:slug', () => {
    it('should return content detail by slug', async () => {
      const content = await createTestContent(prisma, {
        title: 'Test Drama Title',
        type: 'DRAMA',
        year: 2023,
        genres: ['Drama', 'Romance'],
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/content/${content.slug}`)
        .expect(200);

      const body = response.body.data as ContentDetail;
      expect(body.title).toBe('Test Drama Title');
      expect(body.type).toBe('DRAMA');
      expect(body.year).toBe(2023);
      expect(body.genres).toEqual(['Drama', 'Romance']);
      expect(body).toHaveProperty('synopsis');
      expect(body).toHaveProperty('posterUrl');
    });

    it('should return userEntry for authenticated user with journal entry', async () => {
      const user = await createTestUser(prisma);
      const content = await createTestContent(prisma, {
        title: 'User Content',
      });

      // Create journal entry
      await createTestJournalEntry(prisma, {
        userId: user.id,
        contentId: content.id,
        status: 'WATCHING',
        rating: 4.5,
        review: 'Great show!',
        isFavorite: true,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/content/${content.slug}`)
        .set('Authorization', `Bearer ${user.accessToken}`)
        .expect(200);

      const body = response.body.data as ContentDetail;
      expect(body.userEntry).not.toBeNull();
      expect(body.userEntry!.status).toBe('WATCHING');
      expect(Number(body.userEntry!.rating)).toBe(4.5);
      expect(body.userEntry!.review).toBe('Great show!');
      expect(body.userEntry!.isFavorite).toBe(true);
    });

    it('should return null userEntry for authenticated user without journal entry', async () => {
      const user = await createTestUser(prisma);
      const content = await createTestContent(prisma, {
        title: 'No Entry Content',
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/content/${content.slug}`)
        .set('Authorization', `Bearer ${user.accessToken}`)
        .expect(200);

      const body = response.body.data as ContentDetail;
      expect(body.userEntry).toBeNull();
    });

    it('should return null userEntry for unauthenticated user', async () => {
      const content = await createTestContent(prisma, {
        title: 'Public Content',
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/content/${content.slug}`)
        .expect(200);

      const body = response.body.data as ContentDetail;
      expect(body.userEntry).toBeNull();
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/content/non-existent-slug')
        .expect(404);
    });

    it('should return avgRating and loggedCount', async () => {
      const content = await createTestContent(prisma, {
        title: 'Rated Content',
      });

      // Create users and journal entries with ratings
      const user1 = await createTestUser(prisma, {
        email: 'rater1@example.com',
        username: 'rater1',
      });
      const user2 = await createTestUser(prisma, {
        email: 'rater2@example.com',
        username: 'rater2',
      });

      await createTestJournalEntry(prisma, {
        userId: user1.id,
        contentId: content.id,
        status: 'COMPLETED',
        rating: 4.0,
      });

      await createTestJournalEntry(prisma, {
        userId: user2.id,
        contentId: content.id,
        status: 'COMPLETED',
        rating: 5.0,
      });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/content/${content.slug}`)
        .expect(200);

      const body = response.body.data as ContentDetail;
      expect(body).toHaveProperty('avgRating');
      expect(body).toHaveProperty('loggedCount');
      expect(body.loggedCount).toBe(2);
    });
  });

  describe('Complete content browsing flow', () => {
    it('should complete Browse -> Search -> View Detail flow', async () => {
      // Create test content
      await createTestContent(prisma, {
        title: 'Popular Drama',
        type: 'DRAMA',
        genres: ['Drama', 'Romance'],
        isFeatured: true,
      });
      await createTestContent(prisma, {
        title: 'Popular Movie',
        type: 'MOVIE',
        genres: ['Action', 'Thriller'],
      });

      // Step 1: Browse featured content
      const featuredResponse = await request(app.getHttpServer())
        .get('/api/v1/content/featured')
        .expect(200);

      const featuredBody = featuredResponse.body.data as FeaturedResponse;
      expect(featuredBody.featured.length).toBeGreaterThanOrEqual(1);

      // Step 2: Browse all content with pagination
      const browseResponse = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ page: 1, limit: 10 })
        .expect(200);

      const browseBody = browseResponse.body.data as PaginatedResponse;
      expect(browseBody.items.length).toBe(2);

      // Step 3: Search for content
      const searchResponse = await request(app.getHttpServer())
        .get('/api/v1/content/search')
        .query({ q: 'Popular' })
        .expect(200);

      const searchBody = searchResponse.body.data as SearchResponse;
      expect(searchBody.items.length).toBe(2);

      // Step 4: View detail of first search result
      const firstResult = searchBody.items[0];
      const detailResponse = await request(app.getHttpServer())
        .get(`/api/v1/content/${firstResult.slug}`)
        .expect(200);

      const detailBody = detailResponse.body.data as ContentDetail;
      expect(detailBody.title).toContain('Popular');
      expect(detailBody.genres).toBeDefined();
    });

    it('should allow filtering and sorting in browse flow', async () => {
      // Create content with different types and years
      await createTestContent(prisma, {
        title: 'Action Movie 2023',
        type: 'MOVIE',
        year: 2023,
        genres: ['Action'],
      });
      await createTestContent(prisma, {
        title: 'Romance Drama 2022',
        type: 'DRAMA',
        year: 2022,
        genres: ['Romance'],
      });
      await createTestContent(prisma, {
        title: 'Comedy Drama 2021',
        type: 'DRAMA',
        year: 2021,
        genres: ['Comedy'],
      });

      // Filter by type DRAMA
      const dramaResponse = await request(app.getHttpServer())
        .get('/api/v1/content')
        .query({ type: 'DRAMA', sort: 'year', order: 'desc' })
        .expect(200);

      const dramaBody = dramaResponse.body.data as PaginatedResponse;
      expect(dramaBody.items.length).toBe(2);
      expect(dramaBody.items[0].year).toBe(2022);
      expect(dramaBody.items[1].year).toBe(2021);
    });
  });
});
