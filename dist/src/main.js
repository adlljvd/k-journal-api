"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
require("dotenv/config");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const validation_pipe_1 = require("./common/pipes/validation.pipe");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
const validation_exception_filter_1 = require("./common/filters/validation-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            logger.error(`Missing required environment variable: ${envVar}`);
            process.exit(1);
        }
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes((0, validation_pipe_1.createValidationPipe)());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    app.useGlobalFilters(new validation_exception_filter_1.ValidationExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const port = process.env.PORT ?? 3000;
    setupSwagger(app, port);
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: http://localhost:${port} (Fastify)`);
}
function setupSwagger(app, port) {
    const logger = new common_1.Logger('Swagger');
    if (process.env.ENABLE_SWAGGER === 'false') {
        return;
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle('K-Journal API')
        .setDescription('API documentation for K-Journal application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        jsonDocumentUrl: '/api/docs-json',
        yamlDocumentUrl: '/api/docs-yaml',
    });
    logger.log(`Swagger UI available at: http://localhost:${port}/api/docs`);
}
if (process.env.NODE_ENV !== 'test') {
    bootstrap().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=main.js.map