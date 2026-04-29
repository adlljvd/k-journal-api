/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

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
import { createTestUser, TestUser } from './helpers';

describe('Profile E2E (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;
  let testUser: TestUser;
  let otherUser: TestUser;

  beforeAll(async () => {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
    await prisma.$connect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

    // Create test users
    testUser = await createTestUser(app, {
      email: `profile${Date.now()}@test.com`,
      username: `profileuser${Date.now()}`,
    });

    otherUser = await createTestUser(app, {
      email: `otherprofile${Date.now()}@test.com`,
      username: `otherprofileuser${Date.now()}`,
    });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    // Clean up test user data
    try {
      await prisma.journalEntry.deleteMany({
        where: {
          user: { email: { in: [testUser.email, otherUser.email] } },
        },
      });
      await prisma.user.deleteMany({
        where: { email: { in: [testUser.email, otherUser.email] } },
      });
    } catch {
      // Ignore cleanup errors
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('View Own Profile', () => {
    it('should view own profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('username');
      expect(response.body.data.username).toBe(testUser.username);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/nonexistentuser')
        .expect(404);

      expect(response.body.data.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('View Other Users Profile', () => {
    it('should view another users public profile', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${otherUser.username}`)
        .expect(200);

      expect(response.body.data.username).toBe(otherUser.username);
      expect(response.body.data).toHaveProperty('stats');
    });

    it('should view other users journal entries', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${otherUser.username}/journal`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
    });

    it('should allow guest to view profiles', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${otherUser.username}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
    });
  });

  describe('Search Users', () => {
    it('should search for users by username', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/search?q=${otherUser.username}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    it('should return empty results for no matches', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/search?q=nonexistentuser123456789')
        .expect(200);

      expect(response.body.data.items).toHaveLength(0);
    });

    it('should limit search results', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/search?q=user&limit=5')
        .expect(200);

      expect(response.body.data.items.length).toBeLessThanOrEqual(5);
    });

    it('should allow guest to search users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/search?q=user')
        .expect(200);

      expect(response.body.data).toBeDefined();
    });
  });

  describe('Profile Stats', () => {
    it('should calculate stats correctly', async () => {
      // Create some journal entries for testUser
      const contents = await prisma.content.findMany({ take: 3 });

      for (let i = 0; i < contents.length; i++) {
        await request(app.getHttpServer())
          .post('/api/v1/journal')
          .set('Authorization', `Bearer ${testUser.accessToken}`)
          .send({
            contentId: contents[i].id,
            status: 'COMPLETED',
            rating: 4.0 + i * 0.5,
            isFavorite: i === 0,
          })
          .expect(201);
      }

      // Check stats via public profile endpoint
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${testUser.username}`)
        .expect(200);

      const stats = response.body.data.stats;
      expect(stats.totalLogged).toBeGreaterThan(0);
      expect(stats.favoritesCount).toBeGreaterThan(0);
      expect(stats.meanRating).toBeGreaterThan(0);
    });

    it('should handle unrated entries in mean calculation', async () => {
      const contents = await prisma.content.findMany({ take: 2 });

      // One rated entry
      await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: contents[0].id,
          status: 'COMPLETED',
          rating: 4.0,
        })
        .expect(201);

      // One unrated entry
      await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: contents[1].id,
          status: 'WATCHING',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${testUser.username}`)
        .expect(200);

      expect(Number(response.body.data.stats.meanRating)).toBe(4.0);
    });
  });

  describe('Profile Updates', () => {
    it('should update own profile bio', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          bio: 'Updated bio text',
        })
        .expect(200);

      expect(response.body.data.profile.bio).toBe('Updated bio text');
    });

    it('should limit bio to 160 characters', async () => {
      const longBio = 'a'.repeat(161);
      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          bio: longBio,
        })
        .expect(400);

      expect(response.body.data.message).toContain(
        'shorter than or equal to 160 characters',
      );
    });
  });
});
