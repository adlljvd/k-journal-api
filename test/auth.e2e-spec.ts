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
import { cleanDatabase, createTestUser } from './utils/test-helpers';
import { createValidationPipe } from '../src/common/pipes/validation.pipe';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../src/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '../src/common/filters/validation-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

interface RegisterResponse {
  user: { id: string; email: string; username: string; role: string };
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  user: { id: string; email: string; username: string; role: string };
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

interface UserMeResponse {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface ErrorResponse {
  code: string;
  message: string;
}

describe('Authentication Flow (e2e)', () => {
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
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'TestPassword123!',
        })
        .expect(201);

      const body = response.body.data as RegisterResponse;
      expect(body).toHaveProperty('user');
      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('refreshToken');
      expect(body.user.email).toBe('newuser@example.com');
      expect(body.user.username).toBe('newuser');
      expect(body.user.role).toBe('USER');
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
    });

    it('should reject duplicate email registration', async () => {
      // Create first user
      await createTestUser(prisma, {
        email: 'existing@example.com',
        username: 'existinguser',
      });

      // Try to register with same email
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'existing@example.com',
          username: 'differentuser',
          password: 'TestPassword123!',
        })
        .expect(409);

      const body = response.body.data as ErrorResponse;
      expect(body.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('should reject duplicate username registration', async () => {
      // Create first user
      await createTestUser(prisma, {
        email: 'user1@example.com',
        username: 'existinguser',
      });

      // Try to register with same username
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'different@example.com',
          username: 'existinguser',
          password: 'TestPassword123!',
        })
        .expect(409);

      const body = response.body.data as ErrorResponse;
      expect(body.code).toBe('USERNAME_ALREADY_EXISTS');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          username: 'testuser',
          password: 'TestPassword123!',
        })
        .expect(400);

      expect(response.body.data).toHaveProperty('message');
    });

    it('should reject short password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'short',
        })
        .expect(400);

      expect(response.body.data).toHaveProperty('message');
    });

    it('should reject invalid username format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          username: 'invalid username!',
          password: 'TestPassword123!',
        })
        .expect(400);

      expect(response.body.data).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create user
      await createTestUser(prisma, {
        email: 'login@example.com',
        username: 'loginuser',
        password: 'TestPassword123!',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      const body = response.body.data as LoginResponse;
      expect(body).toHaveProperty('user');
      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('refreshToken');
      expect(body.user.email).toBe('login@example.com');
      expect(body.user.username).toBe('loginuser');
    });

    it('should reject invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        })
        .expect(401);

      const body = response.body.data as ErrorResponse;
      expect(body.code).toBe('AUTH_INVALID_CREDENTIALS');
    });

    it('should reject invalid password', async () => {
      // Create user
      await createTestUser(prisma, {
        email: 'login2@example.com',
        username: 'loginuser2',
        password: 'TestPassword123!',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'login2@example.com',
          password: 'WrongPassword!',
        })
        .expect(401);

      const body = response.body.data as ErrorResponse;
      expect(body.code).toBe('AUTH_INVALID_CREDENTIALS');
    });

    it('should login with rememberMe option', async () => {
      // Create user
      await createTestUser(prisma, {
        email: 'remember@example.com',
        username: 'rememberuser',
        password: 'TestPassword123!',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'remember@example.com',
          password: 'TestPassword123!',
          rememberMe: true,
        })
        .expect(200);

      const body = response.body.data as LoginResponse;
      expect(body).toHaveProperty('refreshToken');

      // Verify refresh token has longer expiry (30 days)
      const refreshToken = await prisma.refreshToken.findFirst({
        where: { userId: body.user.id },
        orderBy: { createdAt: 'desc' },
      });

      expect(refreshToken).toBeDefined();
      const daysUntilExpiry = Math.ceil(
        (refreshToken!.expiresAt.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );
      expect(daysUntilExpiry).toBeGreaterThan(25); // Should be around 30 days
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      const testUser = await createTestUser(prisma);

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ refreshToken: testUser.refreshToken })
        .expect(200);

      expect(response.body.data).toHaveProperty('message');
    });

    it('should reject logout without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const testUser = await createTestUser(prisma);

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: testUser.refreshToken })
        .expect(200);

      const body = response.body.data as RefreshResponse;
      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('refreshToken');
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      const body = response.body.data as ErrorResponse;
      expect(body.code).toBe('AUTH_TOKEN_INVALID');
    });
  });

  describe('Protected routes', () => {
    it('should access protected route with valid token', async () => {
      const testUser = await createTestUser(prisma);

      const response = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      const body = response.body.data as UserMeResponse;
      expect(body.id).toBe(testUser.id);
      expect(body.email).toBe(testUser.email);
      expect(body.username).toBe(testUser.username);
    });

    it('should reject protected route without token', async () => {
      await request(app.getHttpServer()).get('/api/v1/users/me').expect(401);
    });

    it('should reject protected route with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Complete authentication flow', () => {
    it('should complete Register -> Login -> Access protected route -> Logout flow', async () => {
      // Step 1: Register
      const registerResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'flow@example.com',
          username: 'flowuser',
          password: 'TestPassword123!',
        })
        .expect(201);

      const registerBody = registerResponse.body.data as RegisterResponse;
      expect(registerBody).toHaveProperty('accessToken');
      const accessToken = registerBody.accessToken;

      // Step 2: Access protected route with token from registration
      await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Step 3: Logout
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken: registerBody.refreshToken })
        .expect(200);

      // Step 4: Login again
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'flow@example.com',
          password: 'TestPassword123!',
        })
        .expect(200);

      const loginBody = loginResponse.body.data as LoginResponse;
      expect(loginBody).toHaveProperty('accessToken');

      // Step 5: Access protected route with new token
      await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${loginBody.accessToken}`)
        .expect(200);
    });
  });
});
