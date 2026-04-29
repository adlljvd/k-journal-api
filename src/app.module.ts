import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/content/content.module';
import { ContentRequestModule } from './modules/content-request/content-request.module';
import { ProfileModule } from './modules/profile/profile.module';
import { JournalModule } from './modules/journal/journal.module';
import { AdminModule } from './modules/admin/admin.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { RateLimitGuard } from './auth/guards/rate-limit.guard';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ContentModule,
    ContentRequestModule,
    ProfileModule,
    JournalModule,
    AdminModule,
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
