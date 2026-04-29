import { Injectable, Inject, Logger, Optional } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

/**
 * Token for injecting a Prisma transaction client
 */
export const PRISMA_TRANSACTION = 'PRISMA_TRANSACTION';

/**
 * Maximum number of retry attempts for transient errors
 */
const MAX_RETRIES = 3;

/**
 * Initial delay in milliseconds for exponential backoff
 */
const INITIAL_DELAY_MS = 100;

/**
 * Maximum pagination limit (NFR-007)
 */
const MAX_PAGINATION_LIMIT = 100;

/**
 * Default pagination limit
 */
const DEFAULT_PAGINATION_LIMIT = 20;

/**
 * Transient error codes that should trigger a retry
 */
const TRANSIENT_ERROR_CODES = [
  'P1001', // Can't reach database server
  'P1002', // Database server reached but timed out
  'P1008', // Operations timed out
  'P1017', // Server has closed the connection
  'P1024', // Timeout exceeded
];

/**
 * Base repository providing standard CRUD operations with retry logic,
 * pagination support, and transaction handling.
 *
 * @typeParam T - The Prisma model type (e.g., User, Content)
 * @typeParam CreateInput - The Prisma create input type
 * @typeParam UpdateInput - The Prisma update input type
 * @typeParam WhereUniqueInput - The Prisma where unique input type
 * @typeParam WhereInput - The Prisma where input type
 * @typeParam Delegate - The Prisma model delegate type
 */
@Injectable()
export abstract class BaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereUniqueInput,
  WhereInput = object,
  Delegate = PrismaClient[keyof PrismaClient],
> {
  protected readonly logger: Logger;

  constructor(
    protected readonly prismaService: PrismaService,
    @Optional()
    @Inject(PRISMA_TRANSACTION)
    protected readonly transactionClient?: unknown,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Returns the Prisma model delegate for this repository.
   * Must be implemented by concrete repository classes.
   */
  protected abstract getModel(): Delegate;

  /**
   * Returns the appropriate Prisma client (transaction or regular).
   * Used internally to support transaction handling.
   */
  protected getClient(): Delegate {
    if (this.transactionClient) {
      return this.transactionClient as Delegate;
    }
    return this.getModel();
  }

  /**
   * Wraps an operation with retry logic using exponential backoff.
   * Retries on transient database errors.
   *
   * @param operation - The async operation to execute
   * @param operationName - Name of the operation for logging
   * @returns The result of the operation
   */
  protected async withRetry<R>(
    operation: () => Promise<R>,
    operationName: string,
  ): Promise<R> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        const prismaError = error as Prisma.PrismaClientKnownRequestError;

        if (
          prismaError.code &&
          TRANSIENT_ERROR_CODES.includes(prismaError.code)
        ) {
          const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
          this.logger.warn(
            `${operationName} failed with transient error (attempt ${attempt}/${MAX_RETRIES}). ` +
              `Retrying in ${delay}ms...`,
          );

          if (attempt < MAX_RETRIES) {
            await this.sleep(delay);
            continue;
          }
        }

        // Re-throw the original error
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError ?? new Error('Unknown error occurred');
  }

  /**
   * Creates a new entity in the database.
   *
   * @param data - The data to create
   * @returns The created entity
   */
  async create(data: CreateInput): Promise<T> {
    return this.withRetry(async () => {
      const client = this.getClient();
      return (
        client as unknown as {
          create: (args: { data: CreateInput }) => Promise<T>;
        }
      ).create({ data });
    }, 'create');
  }

  /**
   * Finds a single entity by its unique identifier.
   *
   * @param where - Unique identifier conditions
   * @returns The found entity or null
   */
  async findById(where: WhereUniqueInput): Promise<T | null> {
    const client = this.getClient();
    return (
      client as unknown as {
        findUnique: (args: { where: WhereUniqueInput }) => Promise<T | null>;
      }
    ).findUnique({ where });
  }

  /**
   * Finds entities with pagination support.
   *
   * @param options - Pagination and filtering options
   * @returns Paginated response with items and metadata
   */
  async findPaginated(options: {
    page?: number;
    limit?: number;
    where?: WhereInput;
    orderBy?: Prisma.SortOrder | object;
    skip?: number;
  }): Promise<PaginatedResponseDto<T>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(
      Math.max(1, options.limit ?? DEFAULT_PAGINATION_LIMIT),
      MAX_PAGINATION_LIMIT,
    );
    const skip = options.skip ?? (page - 1) * limit;

    const client = this.getClient();

    const [items, total] = await Promise.all([
      (
        client as unknown as {
          findMany: (args: {
            where?: WhereInput;
            skip: number;
            take: number;
            orderBy?: Prisma.SortOrder | object;
          }) => Promise<T[]>;
        }
      ).findMany({
        where: options.where,
        skip,
        take: limit,
        orderBy: options.orderBy,
      }),
      (
        client as unknown as {
          count: (args: { where?: WhereInput }) => Promise<number>;
        }
      ).count({
        where: options.where,
      }),
    ]);

    return new PaginatedResponseDto<T>(items, total, page, limit);
  }

  /**
   * Updates an entity by its unique identifier.
   *
   * @param where - Unique identifier conditions
   * @param data - The data to update
   * @returns The updated entity
   */
  async update(where: WhereUniqueInput, data: UpdateInput): Promise<T> {
    return this.withRetry(async () => {
      const client = this.getClient();
      return (
        client as unknown as {
          update: (args: {
            where: WhereUniqueInput;
            data: UpdateInput;
          }) => Promise<T>;
        }
      ).update({ where, data });
    }, 'update');
  }

  /**
   * Deletes an entity by its unique identifier.
   *
   * @param where - Unique identifier conditions
   * @returns The deleted entity
   */
  async delete(where: WhereUniqueInput): Promise<T> {
    return this.withRetry(async () => {
      const client = this.getClient();
      return (
        client as unknown as {
          delete: (args: { where: WhereUniqueInput }) => Promise<T>;
        }
      ).delete({ where });
    }, 'delete');
  }

  /**
   * Finds all entities matching the given conditions.
   *
   * @param where - Filter conditions
   * @param options - Additional options (orderBy, skip, take)
   * @returns Array of matching entities
   */
  async findMany(
    where?: WhereInput,
    options?: {
      orderBy?: Prisma.SortOrder | object;
      skip?: number;
      take?: number;
    },
  ): Promise<T[]> {
    const client = this.getClient();
    return (
      client as unknown as {
        findMany: (args: {
          where?: WhereInput;
          orderBy?: Prisma.SortOrder | object;
          skip?: number;
          take?: number;
        }) => Promise<T[]>;
      }
    ).findMany({
      where,
      orderBy: options?.orderBy,
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Counts entities matching the given conditions.
   *
   * @param where - Filter conditions
   * @returns Count of matching entities
   */
  async count(where?: WhereInput): Promise<number> {
    const client = this.getClient();
    return (
      client as unknown as {
        count: (args: { where?: WhereInput }) => Promise<number>;
      }
    ).count({ where });
  }

  /**
   * Checks if any entity matches the given conditions.
   *
   * @param where - Filter conditions
   * @returns True if any entity matches
   */
  async exists(where: WhereInput): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  /**
   * Executes operations within a transaction.
   *
   * @param fn - Function to execute within transaction
   * @returns Result of the transaction
   */
  async transaction<R>(fn: (tx: PrismaClient) => Promise<R>): Promise<R> {
    return this.prismaService.$transaction(
      fn as Parameters<typeof this.prismaService.$transaction>[0],
    ) as Promise<R>;
  }

  /**
   * Utility function for sleeping (used in retry logic).
   *
   * @param ms - Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
