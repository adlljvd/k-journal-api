import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(input: { email: string; name?: string }) {
    return this.prisma.user.create({ data: input });
  }
}
