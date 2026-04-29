/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { setupSwagger } from '../../src/main';

/**
 * Swagger UI Integration Tests
 *
 * Tests verify Swagger UI configuration is correct and accessible.
 * Coverage: QUALITY.md Scenarios 11-15
 * - P0 Scenario 11: Swagger UI accessible at /api/docs
 * - P0 Scenario 12: JSON spec accessible at /api/docs-json
 * - P0 Scenario 13: Bearer auth configuration preserved
 * - P0 Scenario 14: All endpoints displayed with @ApiTags
 * - P1 Scenario 15: SwaggerDocumentOptions valid for Fastify
 */
describe('Swagger UI Endpoints (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const mockPrismaService = {
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.setGlobalPrefix('api/v1');

    // Setup Swagger using the shared helper
    setupSwagger(app, 3000);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/docs', () => {
    /**
     * Scenario 11: Swagger UI accessible at /api/docs
     * P0 - Explicit FR acceptance criteria
     */
    it('should return HTTP 200 with HTML content type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    it('should return Swagger UI HTML page', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs',
      });

      expect(response.statusCode).toBe(200);
      // Swagger UI HTML contains swagger-ui specific elements
      expect(response.payload).toContain('swagger');
    });
  });

  describe('GET /api/docs-json', () => {
    /**
     * Scenario 12: JSON spec accessible at /api/docs-json
     * P0 - Explicit FR acceptance criteria
     */
    it('should return HTTP 200 with JSON content type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return valid OpenAPI spec JSON', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      // Verify it's a valid OpenAPI document structure
      expect(body).toHaveProperty('openapi');
      expect(body).toHaveProperty('info');
      expect(body).toHaveProperty('paths');
    });
  });

  describe('OpenAPI Spec Metadata', () => {
    it('should contain info.title matching configured title', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.info).toHaveProperty('title', 'K-Journal API');
    });

    it('should contain info.description', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.info).toHaveProperty('description');
      expect(body.info.description).toBe(
        'API documentation for K-Journal application',
      );
    });

    it('should contain info.version', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.info).toHaveProperty('version', '1.0');
    });
  });

  describe('Bearer Authentication Configuration', () => {
    /**
     * Scenario 13: Bearer auth configuration preserved
     * P0 - Security-critical
     */
    it('should have components.securitySchemes defined', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toHaveProperty('components');
      expect(body.components).toHaveProperty('securitySchemes');
    });

    it('should have bearer security scheme with type http', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.components.securitySchemes).toHaveProperty('bearer');
      expect(body.components.securitySchemes.bearer).toHaveProperty(
        'type',
        'http',
      );
    });

    it('should have bearer security scheme with scheme bearer', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.components.securitySchemes.bearer).toHaveProperty(
        'scheme',
        'bearer',
      );
    });
  });

  describe('Registered Routes', () => {
    /**
     * Scenario 14: All endpoints displayed with @ApiTags
     * P0 - Explicit FR acceptance criteria
     */
    it('should have non-empty paths object', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      const paths = body.paths;
      expect(paths).toBeDefined();
      expect(Object.keys(paths).length).toBeGreaterThan(0);
    });

    it('should contain auth registration endpoint', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      const paths = body.paths;
      // Auth module should have registration endpoint
      expect(paths).toHaveProperty('/api/v1/auth/register');
    });

    it('should contain auth login endpoint', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      const paths = body.paths;
      // Auth module should have login endpoint
      expect(paths).toHaveProperty('/api/v1/auth/login');
    });

    it('should contain user profile endpoint', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      const paths = body.paths;
      // User module should have profile endpoint
      expect(paths).toHaveProperty('/api/v1/users/me');
    });
  });

  describe('SwaggerDocumentOptions (P1)', () => {
    /**
     * Scenario 15: SwaggerDocumentOptions valid for Fastify
     * P1 - Configuration object matches Fastify schema
     */
    it('should generate valid OpenAPI 3.0 spec', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      // Verify OpenAPI version is 3.x
      expect(body.openapi).toMatch(/^3\./);
    });

    it('should have valid document structure for Fastify Swagger', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/docs-json',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      // Valid OpenAPI 3.0 document structure
      expect(body).toHaveProperty('openapi');
      expect(body).toHaveProperty('info');
      expect(body).toHaveProperty('paths');

      // Info object structure
      expect(body.info).toHaveProperty('title');
      expect(body.info).toHaveProperty('version');
    });
  });
});
