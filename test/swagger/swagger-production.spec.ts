import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../../src/app.module';
import { setupSwagger } from '../../src/main';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Swagger Production Safety (e2e)', () => {
  let app: NestFastifyApplication;
  const originalEnv = process.env.ENABLE_SWAGGER;

  const mockPrismaService = {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
  };

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    process.env.ENABLE_SWAGGER = originalEnv;
  });

  it('should return 404 when ENABLE_SWAGGER=false', async () => {
    process.env.ENABLE_SWAGGER = 'false';
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
    setupSwagger(app, 3000);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    const response = await app.inject({
      method: 'GET',
      url: '/api/docs',
    });
    expect(response.statusCode).toBe(404);
  });

  it('should return 200 when ENABLE_SWAGGER=true', async () => {
    process.env.ENABLE_SWAGGER = 'true';
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
    setupSwagger(app, 3000);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Swagger UI usually redirects /api/docs to /api/docs/
    const response = await app.inject({
      method: 'GET',
      url: '/api/docs/',
    });
    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('swagger');
  });

  it('should return 200 when ENABLE_SWAGGER is undefined', async () => {
    delete process.env.ENABLE_SWAGGER;
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
    setupSwagger(app, 3000);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    const response = await app.inject({
      method: 'GET',
      url: '/api/docs/',
    });
    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('swagger');
  });
});
