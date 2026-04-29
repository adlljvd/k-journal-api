import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminContentService } from './admin-content.service';
import { AdminContentRequestService } from './admin-content-request.service';
import { ContentModule } from '../content/content.module';
import { ContentRequestModule } from '../content-request/content-request.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ContentModule, ContentRequestModule],
  controllers: [AdminController],
  providers: [AdminService, AdminContentService, AdminContentRequestService],
})
export class AdminModule {}
