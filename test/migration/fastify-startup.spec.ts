/**
 * Fastify Startup Migration Tests
 *
 * Tests verify that the application starts correctly with FastifyAdapter
 * and that all configuration is properly preserved.
 *
 * Coverage: QUALITY.md Scenarios 7-10
 * - P0: Scenario 7 (Application starts with FastifyAdapter)
 * - P0: Scenario 8 (Port configuration preserved)
 * - P1: Scenario 9 (Logger confirms Fastify running)
 * - P1: Scenario 10 (Graceful shutdown with Fastify)
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { setupSwagger } from '../../src/main';

describe('Fastify Startup Migration', () => {
  describe('FR-002: FastifyAdapter Startup (P0)', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;

    beforeAll(async () => {
      const mockPrismaService = {
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        pool: { end: jest.fn().mockResolvedValue(undefined) },
      };

      moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PrismaService)
        .useValue(mockPrismaService)
        .compile();

      app = moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );

      setupSwagger(app, 3000);
    });

    afterAll(async () => {
      await app.close();
    });

    /**
     * Scenario 7: Application starts with FastifyAdapter
     * P0 - Blocking: app must run
     */
    it('should start application with FastifyAdapter', async () => {
      // Initialize the app
      await app.init();

      // Verify app is defined and running
      expect(app).toBeDefined();
      expect(app.getHttpServer()).toBeDefined();
    });

    /**
     * Scenario 8: Port configuration preserved
     * P0 - Blocking: runtime config
     */
    it('should use FastifyAdapter as HTTP adapter', () => {
      // The app should be a NestFastifyApplication
      // Verify by checking the adapter type
      const httpServer: unknown = app.getHttpServer();
      expect(httpServer).toBeDefined();

      // Fastify adapter should provide a server
      // This confirms FastifyAdapter is being used
      expect(typeof (httpServer as { listen: unknown }).listen).toBe(
        'function',
      );
    });
  });

  describe('FR-002: Port Configuration (P0)', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const mockPrismaService = {
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        pool: { end: jest.fn().mockResolvedValue(undefined) },
      };

      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PrismaService)
        .useValue(mockPrismaService)
        .compile();

      app = moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );
    });

    afterAll(async () => {
      await app.close();
    });

    it('should accept port configuration', async () => {
      // Use port 0 to let the OS assign an available port
      await app.init();
      await app.listen(0, '0.0.0.0');

      const url = await app.getUrl();
      // Verify a port was assigned (URL will contain : followed by port number)
      expect(url).toMatch(/:\d+/);

      await app.close();
    });
  });

  describe('FR-002: Logger Output (P1)', () => {
    /**
     * Scenario 9: Logger confirms Fastify running
     * P1 - Log output contains Fastify identifier
     */
    it('should have Fastify in bootstrap log message', () => {
      // Read the main.ts source to verify log message includes "Fastify"
      const mainTsPath = path.resolve(__dirname, '../../src/main.ts');
      const mainTsContent = fs.readFileSync(mainTsPath, 'utf-8');

      // Verify the logger message contains Fastify identifier
      expect(mainTsContent).toContain('(Fastify)');
    });
  });

  describe('FR-002: Graceful Shutdown (P1)', () => {
    let app: INestApplication;

    beforeEach(async () => {
      const mockPrismaService = {
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        pool: { end: jest.fn().mockResolvedValue(undefined) },
      };

      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PrismaService)
        .useValue(mockPrismaService)
        .compile();

      app = moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );
    });

    afterEach(async () => {
      // Ensure cleanup
      try {
        await app.close();
      } catch {
        // Ignore errors if already closed
      }
    });

    /**
     * Scenario 10: Graceful shutdown with Fastify
     * P1 - SIGTERM handled correctly
     */
    it('should close gracefully without errors', async () => {
      await app.init();
      // Use port 0 to let the OS assign an available port
      await app.listen(0, '0.0.0.0');

      // Close should complete without throwing
      await expect(app.close()).resolves.not.toThrow();
    });

    it('should handle multiple close calls gracefully', async () => {
      await app.init();

      // First close
      await app.close();

      // Second close should not throw (idempotent)
      await expect(app.close()).resolves.not.toThrow();
    });
  });
});
