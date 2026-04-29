import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserRepository } from '../user/user.repository';
import { UserProfileRepository } from '../user/user-profile.repository';
import { JournalRepository } from '../journal/journal.repository';
import { ContentRepository } from '../content/content.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    UserRepository,
    UserProfileRepository,
    JournalRepository,
    ContentRepository,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
