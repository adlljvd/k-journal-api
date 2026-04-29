/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import request from 'supertest';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../src/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '../src/common/filters/validation-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { createValidationPipe } from '../src/common/pipes/validation.pipe';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestUser, TestUser } from './helpers';

// Use seeded content from the database or create test content
describe('Journal E2E (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;
  let testUser: TestUser;
  let testContent: { id: string; slug: string; title: string };

  const SEEDED_CONTENT_SLUG = 'crash-landing-on-you'; // Example seeded content

  beforeAll(async () => {
    // Connect to real test database
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });

    // Ensure database is seeded with content
    await prisma.$connect();
  });

  beforeEach(async () => {
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
    app.useGlobalPipes(createValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalFilters(new PrismaExceptionFilter());
    app.useGlobalFilters(new ValidationExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Create a test user
    testUser = await createTestUser(app, {
      email: `journal${Date.now()}@test.com`,
      username: `journaluser${Date.now()}`,
    });

    // Get a test content from database (use seeded content)
    const content = await prisma.content.findFirst({
      where: { slug: SEEDED_CONTENT_SLUG },
    });

    if (!content) {
      // Create test content if not found
      testContent = await prisma.content
        .create({
          data: {
            title: 'Test Drama',
            slug: `test-drama-${Date.now()}`,
            type: 'DRAMA',
            year: 2024,
            synopsis: 'Test synopsis',
            genres: ['Drama'],
          },
        })
        .then((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
        }));
    } else {
      testContent = {
        id: content.id,
        slug: content.slug,
        title: content.title,
      };
    }
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    // Clean up test user data
    try {
      await prisma.journalEntry.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.user.deleteMany({
        where: { email: testUser.email },
      });
    } catch {
      // Ignore cleanup errors
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Journal CRUD Operations', () => {
    it('should add content to journal with status', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'WATCHING',
          rating: 4.0,
          review: 'Great drama!',
          isFavorite: false,
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe('WATCHING');
      expect(response.body.data.content.id).toBe(testContent.id);
    });

    it('should add content with minimal data (status only)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'PLAN_TO_WATCH',
        })
        .expect(201);

      expect(response.body.data.status).toBe('PLAN_TO_WATCH');
      expect(response.body.data.rating).toBeNull();
    });

    it('should reject duplicate journal entry', async () => {
      // Create first entry
      await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'WATCHING',
        })
        .expect(201);

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'COMPLETED',
        })
        .expect(409);

      expect(response.body.data.message).toContain('already exists');
    });
  });

  describe('Journal Update Operations', () => {
    it('should update journal entry', async () => {
      // Create entry first
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'WATCHING',
        })
        .expect(201);

      const entryId = createResponse.body.data.id;

      // Update entry
      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/journal/${entryId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          status: 'COMPLETED',
          rating: 5.0,
        })
        .expect(200);

      expect(updateResponse.body.data.status).toBe('COMPLETED');
      expect(Number(updateResponse.body.data.rating)).toBe(5.0);
    });

    it('should allow partial update', async () => {
      // Create entry with a review
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'WATCHING',
          review: 'Original review',
        })
        .expect(201);

      const entryId = createResponse.body.data.id;

      // Update only status
      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/journal/${entryId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          status: 'COMPLETED',
        })
        .expect(200);

      expect(updateResponse.body.data.status).toBe('COMPLETED');
      expect(updateResponse.body.data.review).toBe('Original review');
    });
  });

  describe('Journal Delete Operations', () => {
    it('should delete journal entry', async () => {
      // Create entry first
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'WATCHING',
        })
        .expect(201);

      const entryId = createResponse.body.data.id;

      // Delete entry
      await request(app.getHttpServer())
        .delete(`/api/v1/journal/${entryId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(204);

      // Verify deleted
      const getResponse = await request(app.getHttpServer())
        .get(`/api/v1/journal/${entryId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`);

      expect(getResponse.status).toBe(404);
    });
  });

  describe('Journal Filtering and Sorting', () => {
    it('should filter journal entries by status', async () => {
      // Create entries with different statuses
      await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'WATCHING',
        })
        .expect(201);

      // Filter by status
      const response = await request(app.getHttpServer())
        .get('/api/v1/journal?status=WATCHING')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
      if (response.body.data.items.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.body.data.items.forEach((item: any) => {
          expect(item.status).toBe('WATCHING');
        });
      }
    });

    it('should sort journal entries', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/journal?sort=createdAt&order=desc')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
    });

    it('should return paginated results', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/journal?page=1&limit=10')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.data.meta).toHaveProperty('total');
      expect(response.body.data.meta).toHaveProperty('page');
      expect(response.body.data.meta).toHaveProperty('limit');
    });
  });

  describe('Favorites', () => {
    it('should mark content as favorite', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'COMPLETED',
          isFavorite: true,
        })
        .expect(201);

      expect(response.body.data.isFavorite).toBe(true);
    });

    it('should get favorite entries', async () => {
      // First mark as favorite
      await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: testContent.id,
          status: 'COMPLETED',
          isFavorite: true,
        })
        .expect(201);

      // Get favorites
      const response = await request(app.getHttpServer())
        .get('/api/v1/journal/favorites')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
    });
  });

  describe('Authorization', () => {
    it('should reject access without authentication', async () => {
      await request(app.getHttpServer()).get('/api/v1/journal').expect(401);
    });

    it('should reject update of another users entry', async () => {
      // Create another user with journal entry
      const otherUser = await createTestUser(app, {
        email: `other${Date.now()}@test.com`,
        username: `otheruser${Date.now()}`,
      });

      const otherContent = await prisma.content.findFirst({
        where: { title: { not: testContent.title } },
      });

      if (otherContent) {
        await request(app.getHttpServer())
          .post('/api/v1/journal')
          .set('Authorization', `Bearer ${otherUser.accessToken}`)
          .send({
            contentId: otherContent.id,
            status: 'WATCHING',
          })
          .expect(201);

        // Create entry for main user
        const entry = await request(app.getHttpServer())
          .post('/api/v1/journal')
          .set('Authorization', `Bearer ${testUser.accessToken}`)
          .send({
            contentId: testContent.id,
            status: 'COMPLETED',
          })
          .expect(201);

        // Try to access with other user's token
        const response = await request(app.getHttpServer())
          .get(`/api/v1/journal/${entry.body.data.id}`)
          .set('Authorization', `Bearer ${otherUser.accessToken}`);

        expect(response.status).toBe(404);
      }
    });
  });
});
