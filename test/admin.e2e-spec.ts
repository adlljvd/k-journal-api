/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import pg from 'pg';
import request from 'supertest';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../src/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '../src/common/filters/validation-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { createValidationPipe } from '../src/common/pipes/validation.pipe';
import { AppModule } from '../src/app.module';
import { createTestUser, TestUser } from './helpers';

describe('Admin E2E (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;
  let adminUser: TestUser;
  let regularUser: TestUser;

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

    // Create admin user by directly setting role

    const passwordHash = await argon2.hash('adminpassword123', {
      type: argon2.argon2id,
    });

    const admin = await prisma.user.create({
      data: {
        email: `admin${Date.now()}@test.com`,
        username: `adminuser${Date.now()}`,
        passwordHash,
        role: Role.ADMIN,
      },
      include: { profile: true },
    });

    // Create profile if not created automatically
    if (!admin.profile) {
      await prisma.userProfile.create({
        data: { userId: admin.id },
      });
    }

    // Login as admin
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: admin.email,
        password: 'adminpassword123',
      })
      .expect(200);

    adminUser = {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
      accessToken: loginResponse.body.data.accessToken,
      refreshToken: loginResponse.body.data.refreshToken,
    };

    // Create regular user
    regularUser = await createTestUser(app, {
      email: `regular${Date.now()}@test.com`,
      username: `regularuser${Date.now()}`,
    });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    try {
      await prisma.journalEntry.deleteMany({
        where: {
          user: { email: { in: [regularUser.email, adminUser.email] } },
        },
      });
      await prisma.contentRequest.deleteMany({
        where: {
          user: { email: { in: [regularUser.email, adminUser.email] } },
        },
      });
      await prisma.user.deleteMany({
        where: { email: { in: [regularUser.email, adminUser.email] } },
      });
    } catch {
      // Ignore errors
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Admin Dashboard', () => {
    it('should load admin dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('pendingRequestsCount');
      expect(response.body.data).toHaveProperty('totalContentCount');
      expect(response.body.data).toHaveProperty('recentRequests');
    });

    it('should block non-admin from dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${regularUser.accessToken}`)
        .expect(403);

      expect(response.body.data.code).toBeDefined();
    });

    it('should block unauthenticated from dashboard', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .expect(401);
    });
  });

  describe('Content Request Review', () => {
    it('should approve content request', async () => {
      // Regular user submits content request
      const requestResponse = await request(app.getHttpServer())
        .post('/api/v1/content-requests')
        .set('Authorization', `Bearer ${regularUser.accessToken}`)
        .send({
          title: 'New K-Drama',
          type: 'DRAMA',
          year: 2024,
          notes: 'Please add this drama',
        })
        .expect(201);

      const requestId = requestResponse.body.data.id;

      // Admin approves request
      const approveResponse = await request(app.getHttpServer())
        .post(`/api/v1/admin/content-requests/${requestId}/approve`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          contentData: {
            title: 'New K-Drama',
            slug: 'new-k-drama-' + Date.now(),
            type: 'DRAMA',
            year: 2024,
            synopsis: 'Approved synopsis',
            genres: ['Drama'],
          },
        })
        .expect(201);

      expect(approveResponse.body.data.request).toHaveProperty('status');
      expect(approveResponse.body.data.request.status).toBe('APPROVED');
      expect(approveResponse.body.data.content).toHaveProperty('id');
    });

    it('should reject content request', async () => {
      // Create pending request
      const requestResponse = await request(app.getHttpServer())
        .post('/api/v1/content-requests')
        .set('Authorization', `Bearer ${regularUser.accessToken}`)
        .send({
          title: 'Rejected K-Drama',
          type: 'MOVIE',
        })
        .expect(201);

      const requestId = requestResponse.body.data.id;

      // Admin rejects request
      const rejectResponse = await request(app.getHttpServer())
        .post(`/api/v1/admin/content-requests/${requestId}/reject`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          reason: 'Not enough information',
        })
        .expect(201);

      expect(rejectResponse.body.data.status).toBe('REJECTED');
      expect(rejectResponse.body.data.rejectionReason).toBe(
        'Not enough information',
      );
    });

    it('should list all content requests', async () => {
      // Submit some requests
      await request(app.getHttpServer())
        .post('/api/v1/content-requests')
        .set('Authorization', `Bearer ${regularUser.accessToken}`)
        .send({
          title: 'Test Request 1',
          type: 'DRAMA',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/content-requests')
        .set('Authorization', `Bearer ${regularUser.accessToken}`)
        .send({
          title: 'Test Request 2',
          type: 'MOVIE',
        })
        .expect(201);

      // Admin lists requests
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/content-requests')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
    });

    it('should filter requests by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/content-requests?status=PENDING')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
    });
  });

  describe('Content CRUD Operations', () => {
    it('should create new content', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/content')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          title: 'Admin Test Drama',
          slug: 'admin-test-drama-' + Date.now(),
          type: 'DRAMA',
          year: 2024,
          synopsis: 'Test synopsis',
          genres: ['Drama', 'Romance'],
          cast: 'Actor 1, Actor 2',
          episodes: 16,
          country: 'South Korea',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Admin Test Drama');
    });

    it('should update existing content', async () => {
      // Create content first
      const content = await request(app.getHttpServer())
        .post('/api/v1/admin/content')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          title: 'Update Test',
          slug: 'update-test-' + Date.now(),
          type: 'DRAMA',
          year: 2024,
          genres: ['Drama'],
        })
        .expect(201);

      // Update content
      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/v1/admin/content/${content.body.data.id}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          title: 'Updated Title',
          synopsis: 'Updated synopsis',
        })
        .expect(200);

      expect(updateResponse.body.data.title).toBe('Updated Title');
    });

    it('should delete content', async () => {
      // Create content first
      const content = await request(app.getHttpServer())
        .post('/api/v1/admin/content')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          title: 'Delete Test',
          slug: 'delete-test-' + Date.now(),
          type: 'DRAMA',
          year: 2024,
          genres: ['Drama'],
        })
        .expect(201);

      const contentId = content.body.data.id;

      // Delete content
      await request(app.getHttpServer())
        .delete(`/api/v1/admin/content/${contentId}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(204);

      // Verify deleted
      await request(app.getHttpServer())
        .get(`/api/v1/admin/content/${contentId}`)
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(404);
    });

    it('should list all content for admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/content?page=1&limit=10')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
      expect(response.body.data.meta).toHaveProperty('total');
    });

    it('should search content by title', async () => {
      // Create some content
      await request(app.getHttpServer())
        .post('/api/v1/admin/content')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .send({
          title: 'Searchable Title',
          slug: 'searchable-title-' + Date.now(),
          type: 'DRAMA',
          year: 2024,
          genres: ['Drama'],
        })
        .expect(201);

      // Search
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/content?search=Searchable')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items.length).toBeGreaterThan(0);
    });

    it('should filter content by type', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/content?type=DRAMA')
        .set('Authorization', `Bearer ${adminUser.accessToken}`)
        .expect(200);

      expect(response.body.data.items).toBeDefined();
    });
  });

  describe('Non-admin Access Control', () => {
    const adminEndpoints = [
      { method: 'get', path: '/api/v1/admin/dashboard' },
      { method: 'get', path: '/api/v1/admin/content-requests' },
      { method: 'post', path: '/api/v1/admin/content' },
      { method: 'get', path: '/api/v1/admin/content' },
    ];

    it.each(adminEndpoints)(
      'should block non-admin from $method $path',
      async ({ method, path }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const req = (request(app.getHttpServer()) as any)
          [method](path)
          .set('Authorization', `Bearer ${regularUser.accessToken}`);

        if (method === 'post') {
          await req
            .send({
              title: 'Test',
              type: 'DRAMA',
              year: 2024,
              genres: ['Drama'],
            })
            .expect(403);
        } else {
          await req.expect(403);
        }
      },
    );
  });
});
