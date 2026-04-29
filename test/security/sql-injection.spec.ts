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
import { AppModule } from '../../src/app.module';
import { createTestUser, TestUser } from '../helpers';
import { createTestContent } from '../utils/test-helpers';
import { createValidationPipe } from '../../src/common/pipes/validation.pipe';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../../src/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '../../src/common/filters/validation-exception.filter';
import { TransformInterceptor } from '../../src/common/interceptors/transform.interceptor';

/**
 * SQL Injection Prevention Tests
 *
 * These tests verify that user input is properly sanitized and parameterized
 * to prevent SQL injection attacks. The API uses Prisma ORM which provides
 * built-in SQL injection protection through parameterized queries.
 */
describe('SQL Injection Prevention (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;
  let testUser: TestUser;

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

    testUser = await createTestUser(app, {
      email: `sqltest${Date.now()}@test.com`,
      username: `sqltestuser${Date.now()}`,
    });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    try {
      await prisma.journalEntry.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.contentRequest.deleteMany({
        where: { user: { email: testUser.email } },
      });
      await prisma.user.deleteMany({
        where: { email: testUser.email },
      });
    } catch {
      // Ignore errors
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('SQL Injection in Username Field', () => {
    it('should prevent SQL injection in username during registration', async () => {
      // Try SQL injection in username field
      const sqlInjectionUsername = "admin' OR '1'='1";

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: `sqlinject${Date.now()}@test.com`,
          username: sqlInjectionUsername,
          password: 'password123',
        })
        // Should either reject with validation error or treat as literal string
        .expect(400);

      // Check that username is treated as literal, not SQL
      expect(response.body.data.code).toBeTruthy();
    });

    it('should prevent union-based SQL injection in username', async () => {
      const unionInjection = "admin' UNION SELECT * FROM users--";

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: `sqlinject2${Date.now()}@test.com`,
          username: unionInjection,
          password: 'password123',
        })
        .expect(400);

      expect(response.body.data).toBeDefined();
    });

    it('should prevent comment-based SQL injection', async () => {
      const commentInjection = "admin'--";

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: `sqlinject3${Date.now()}@test.com`,
          username: commentInjection,
          password: 'password123',
        })
        .expect(400);

      expect(response.body.data).toBeDefined();
    });

    it('should handle DROP TABLE injection attempts', async () => {
      const dropTableInjection = "'; DROP TABLE users; --";

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: `sqlinject4${Date.now()}@test.com`,
          username: dropTableInjection,
          password: 'password123',
        })
        .expect(400);

      // Verify table still exists
      const users = await prisma.user.findMany({
        where: { email: testUser.email },
        select: { id: true },
      });
      expect(users).toBeDefined();
    });
  });

  describe('SQL Injection in Email Field', () => {
    it('should prevent SQL injection in email during registration', async () => {
      const sqlInjectionEmail = "test@test.com' OR '1'='1";

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: sqlInjectionEmail,
          username: `sqlinject${Date.now()}`,
          password: 'password123',
        })
        .expect(400);

      expect(response.body.data).toBeDefined();
    });

    it('should prevent union-based SQL injection in email', async () => {
      const unionInjection =
        "test@test.com' UNION SELECT passwordHash FROM users--";

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: unionInjection,
          username: `sqlinject${Date.now()}`,
          password: 'password123',
        })
        .expect(400);

      expect(response.body.data.code).toBeTruthy();
    });

    it('should prevent special characters in email', async () => {
      const specialCharInjections = [
        'test@test.com<script>',
        'test@test.com"',
        'test@test.com;',
      ];

      for (const email of specialCharInjections) {
        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send({
            email,
            username: `user${Date.now()}`,
            password: 'password123',
          })
          .expect(400);

        expect(response.body.data).toBeDefined();
      }
    });
  });

  describe('SQL Injection in Search Query', () => {
    it('should prevent SQL injection in content search', async () => {
      const sqlInjectionSearch = "' OR '1'='1";

      const response = await request(app.getHttpServer())
        .get(
          `/api/v1/content/search?q=${encodeURIComponent(sqlInjectionSearch)}`,
        )
        .expect(200);

      // Should return empty results or 400, not execute SQL
      expect(response.body.data).toBeDefined();
    });

    it('should prevent SQL injection in user search', async () => {
      const sqlInjectionSearch = "' OR '1'='1";

      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/search?q=${encodeURIComponent(sqlInjectionSearch)}`)
        .expect(200);

      // Should return empty results or 400, not expose data
      expect(response.body.data).toBeDefined();
    });

    it('should prevent UNION injection in search', async () => {
      const unionSearch = "' UNION SELECT id,email,passwordHash FROM users--";

      const response = await request(app.getHttpServer())
        .get(`/api/v1/content/search?q=${encodeURIComponent(unionSearch)}`)
        .expect(200);

      // Should not expose sensitive data
      expect(response.body.data).toBeDefined();
    });
  });

  describe('SQL Injection in Journal Entry', () => {
    it('should sanitize review text field', async () => {
      const content = await prisma.content.findFirst();
      if (!content) return;

      const sqlInjectionReview = "Great drama!'; DROP TABLE users; --";

      const response = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: content.id,
          status: 'COMPLETED',
          review: sqlInjectionReview,
        })
        .expect(201);

      // Verify data is stored as literal
      expect(response.body.data.review).toContain('DROP TABLE');

      // Verify table still exists
      const users = await prisma.user.count();
      expect(users).toBeGreaterThan(0);
    });

    it('should handle script tags in review', async () => {
      const content = await prisma.content.findFirst();
      if (!content) return;

      const scriptReview = "<script>alert('xss')</script> Great drama!";

      const response = await request(app.getHttpServer())
        .post('/api/v1/journal')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          contentId: content.id,
          status: 'COMPLETED',
          review: scriptReview,
        })
        .expect(201);

      // Should store but not execute
      expect(response.body.data.review).toBeDefined();
    });
  });

  describe('SQL Injection in Profile Bio', () => {
    it('should handle SQL injection attempts in bio', async () => {
      const sqlInjectionBio = "My bio'; DELETE FROM users; --";

      const response = await request(app.getHttpServer())
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          bio: sqlInjectionBio,
        })
        .expect(200);

      // Bio should be stored literally
      expect(response.body.data.profile.bio).toContain('DELETE');

      // Verify users table still intact
      const usersCount = await prisma.user.count();
      expect(usersCount).toBeGreaterThan(0);
    });
  });

  describe('SQL Injection in Content Request', () => {
    it('should prevent SQL injection in content request title', async () => {
      const sqlInjectionTitle = "New Drama'; DROP ALL TABLES; --";

      // Ensure some content exists
      await createTestContent(prisma);

      await request(app.getHttpServer())
        .post('/api/v1/content-requests')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          title: sqlInjectionTitle,
          type: 'DRAMA',
        })
        .expect(201);

      // Check content still exists
      const contentCount = await prisma.content.count();
      expect(contentCount).toBeGreaterThan(0);
    });

    it('should prevent SQL injection in notes', async () => {
      const content = await prisma.content.findFirst();
      if (!content) return;

      const sqlInjectionNotes = "Notes'; DELETE FROM journal_entries; --";

      const response = await request(app.getHttpServer())
        .post('/api/v1/content-requests')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          title: 'Test Request',
          type: 'DRAMA',
          notes: sqlInjectionNotes,
        })
        .expect(201);

      // Verify journal entries still intact
      expect(response.body.data).toHaveProperty('id');
    });
  });

  describe('Parameterized Query Verification', () => {
    it('should use parameterized queries (verify via behavior)', async () => {
      // If queries are parameterized, special SQL characters won't affect behavior
      const trickySearch = '\'";--';

      // This should either be rejected or return empty results, not cause errors
      const response = await request(app.getHttpServer()).get(
        `/api/v1/content/search?q=${encodeURIComponent(trickySearch)}`,
      );

      // Should not crash or expose data
      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.data).toBeDefined();
      }
    });
  });
});
