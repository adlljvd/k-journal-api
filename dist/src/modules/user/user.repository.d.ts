import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/repositories/base.repository';
export declare class UserRepository extends BaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput, Prisma.UserWhereUniqueInput, Prisma.UserWhereInput, Prisma.UserDelegate> {
    constructor(prismaService: PrismaService, transactionClient?: unknown);
    protected getModel(): Prisma.UserDelegate;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByIdWithProfile(id: string): Promise<User | null>;
    updateEmail(id: string, email: string): Promise<User>;
    updatePassword(id: string, passwordHash: string): Promise<User>;
    deleteUser(id: string): Promise<User>;
}
