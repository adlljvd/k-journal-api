import { Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
export declare const PRISMA_TRANSACTION = "PRISMA_TRANSACTION";
export declare abstract class BaseRepository<T, CreateInput, UpdateInput, WhereUniqueInput, WhereInput = object, Delegate = PrismaClient[keyof PrismaClient]> {
    protected readonly prismaService: PrismaService;
    protected readonly transactionClient?: unknown | undefined;
    protected readonly logger: Logger;
    constructor(prismaService: PrismaService, transactionClient?: unknown | undefined);
    protected abstract getModel(): Delegate;
    protected getClient(): Delegate;
    protected withRetry<R>(operation: () => Promise<R>, operationName: string): Promise<R>;
    create(data: CreateInput): Promise<T>;
    findById(where: WhereUniqueInput): Promise<T | null>;
    findPaginated(options: {
        page?: number;
        limit?: number;
        where?: WhereInput;
        orderBy?: Prisma.SortOrder | object;
        skip?: number;
    }): Promise<PaginatedResponseDto<T>>;
    update(where: WhereUniqueInput, data: UpdateInput): Promise<T>;
    delete(where: WhereUniqueInput): Promise<T>;
    findMany(where?: WhereInput, options?: {
        orderBy?: Prisma.SortOrder | object;
        skip?: number;
        take?: number;
    }): Promise<T[]>;
    count(where?: WhereInput): Promise<number>;
    exists(where: WhereInput): Promise<boolean>;
    transaction<R>(fn: (tx: PrismaClient) => Promise<R>): Promise<R>;
    private sleep;
}
