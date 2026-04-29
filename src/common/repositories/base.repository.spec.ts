import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

// Type alias for User model delegate
type UserModelDelegate = {
  create: jest.Mock;
  findUnique: jest.Mock;
  findMany: jest.Mock;
  count: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

// Concrete implementation for testing using User model
class TestUserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereUniqueInput,
  Prisma.UserWhereInput,
  UserModelDelegate
> {
  private model: UserModelDelegate;

  constructor(
    prismaService: PrismaService,
    model: UserModelDelegate,
    transactionClient?: unknown,
  ) {
    super(prismaService, transactionClient);
    this.model = model;
  }

  protected getModel(): UserModelDelegate {
    return this.model;
  }
}

describe('BaseRepository', () => {
  let repository: TestUserRepository;
  let prismaService: jest.Mocked<PrismaService>;
  let mockModel: UserModelDelegate;

  const mockUser: User = {
    id: 'test-id',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashedpassword',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockModel = {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    prismaService = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $transaction: jest.fn(),
    } as unknown as jest.Mocked<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestUserRepository,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    repository = module.get<TestUserRepository>(TestUserRepository);
    // Inject the mock model
    (repository as unknown as { model: UserModelDelegate }).model = mockModel;
  });

  describe('create', () => {
    it('should create an entity successfully', async () => {
      const createData: Prisma.UserCreateInput = {
        email: 'new@example.com',
        username: 'newuser',
        passwordHash: 'hashedpassword',
      };
      mockModel.create.mockResolvedValue(mockUser);

      const result = await repository.create(createData);

      expect(mockModel.create).toHaveBeenCalledWith({ data: createData });
      expect(result).toEqual(mockUser);
    });

    it('should retry on transient errors', async () => {
      const createData: Prisma.UserCreateInput = {
        email: 'new@example.com',
        username: 'newuser',
        passwordHash: 'hashedpassword',
      };
      const transientError = new Prisma.PrismaClientKnownRequestError(
        "Can't reach database server",
        {
          code: 'P1001',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );

      mockModel.create
        .mockRejectedValueOnce(transientError)
        .mockResolvedValueOnce(mockUser);

      const result = await repository.create(createData);

      expect(mockModel.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockUser);
    });

    it('should throw after max retries on persistent transient errors', async () => {
      const createData: Prisma.UserCreateInput = {
        email: 'new@example.com',
        username: 'newuser',
        passwordHash: 'hashedpassword',
      };
      const transientError = new Prisma.PrismaClientKnownRequestError(
        "Can't reach database server",
        {
          code: 'P1001',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );

      mockModel.create.mockRejectedValue(transientError);

      await expect(repository.create(createData)).rejects.toThrow(
        transientError,
      );

      expect(mockModel.create).toHaveBeenCalledTimes(3); // MAX_RETRIES
    });

    it('should not retry on non-transient errors', async () => {
      const createData: Prisma.UserCreateInput = {
        email: 'new@example.com',
        username: 'newuser',
        passwordHash: 'hashedpassword',
      };
      const nonTransientError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint violation',
        {
          code: 'P2002',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );

      mockModel.create.mockRejectedValue(nonTransientError);

      await expect(repository.create(createData)).rejects.toThrow(
        nonTransientError,
      );

      expect(mockModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should find an entity by id', async () => {
      mockModel.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findById({ id: 'test-id' });

      expect(mockModel.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when entity not found', async () => {
      mockModel.findUnique.mockResolvedValue(null);

      const result = await repository.findById({ id: 'non-existent' });

      expect(result).toBeNull();
    });
  });

  describe('findPaginated', () => {
    const mockUsers = [
      mockUser,
      { ...mockUser, id: 'test-id-2' },
      { ...mockUser, id: 'test-id-3' },
    ];

    it('should return paginated results with default pagination', async () => {
      mockModel.findMany.mockResolvedValue(mockUsers);
      mockModel.count.mockResolvedValue(3);

      const result = await repository.findPaginated({});

      expect(result).toBeInstanceOf(PaginatedResponseDto);
      expect(result.items).toEqual(mockUsers);
      expect(result.meta).toEqual({
        total: 3,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should apply custom pagination parameters', async () => {
      mockModel.findMany.mockResolvedValue([mockUser]);
      mockModel.count.mockResolvedValue(25);

      const result = await repository.findPaginated({ page: 2, limit: 10 });

      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: undefined,
        skip: 10, // (page - 1) * limit
        take: 10,
        orderBy: undefined,
      });
      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });
    });

    it('should enforce maximum pagination limit of 100', async () => {
      mockModel.findMany.mockResolvedValue([]);
      mockModel.count.mockResolvedValue(0);

      const result = await repository.findPaginated({ limit: 200 });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 }),
      );
      expect(result.meta.limit).toBe(100);
    });

    it('should enforce minimum page of 1', async () => {
      mockModel.findMany.mockResolvedValue([]);
      mockModel.count.mockResolvedValue(0);

      await repository.findPaginated({ page: 0 });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0 }), // (1 - 1) * 20 = 0
      );
    });

    it('should enforce minimum limit of 1', async () => {
      mockModel.findMany.mockResolvedValue([]);
      mockModel.count.mockResolvedValue(0);

      await repository.findPaginated({ limit: 0 });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 1 }),
      );
    });

    it('should apply where conditions', async () => {
      mockModel.findMany.mockResolvedValue([]);
      mockModel.count.mockResolvedValue(0);

      const where: Prisma.UserWhereInput = {
        email: { contains: 'test' },
      };
      await repository.findPaginated({ where });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where }),
      );
      expect(mockModel.count).toHaveBeenCalledWith({ where });
    });

    it('should apply orderBy', async () => {
      mockModel.findMany.mockResolvedValue([]);
      mockModel.count.mockResolvedValue(0);

      const orderBy = { createdAt: 'desc' };
      await repository.findPaginated({ orderBy });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy }),
      );
    });

    it('should calculate totalPages correctly', async () => {
      mockModel.findMany.mockResolvedValue([]);
      mockModel.count.mockResolvedValue(45);

      const result = await repository.findPaginated({ limit: 20 });

      expect(result.meta.totalPages).toBe(3); // Math.ceil(45 / 20)
    });
  });

  describe('update', () => {
    it('should update an entity successfully', async () => {
      const updateData: Prisma.UserUpdateInput = { username: 'updateduser' };
      const updatedUser = { ...mockUser, username: 'updateduser' };
      mockModel.update.mockResolvedValue(updatedUser);

      const result = await repository.update({ id: 'test-id' }, updateData);

      expect(mockModel.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: updateData,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should retry on transient errors', async () => {
      const updateData: Prisma.UserUpdateInput = { username: 'updateduser' };
      const transientError = new Prisma.PrismaClientKnownRequestError(
        'Timeout',
        {
          code: 'P1008',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );

      mockModel.update
        .mockRejectedValueOnce(transientError)
        .mockResolvedValueOnce(mockUser);

      const result = await repository.update({ id: 'test-id' }, updateData);

      expect(mockModel.update).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('should delete an entity successfully', async () => {
      mockModel.delete.mockResolvedValue(mockUser);

      const result = await repository.delete({ id: 'test-id' });

      expect(mockModel.delete).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should retry on transient errors', async () => {
      const transientError = new Prisma.PrismaClientKnownRequestError(
        'Connection closed',
        {
          code: 'P1017',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );

      mockModel.delete
        .mockRejectedValueOnce(transientError)
        .mockResolvedValueOnce(mockUser);

      const result = await repository.delete({ id: 'test-id' });

      expect(mockModel.delete).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findMany', () => {
    it('should find multiple entities', async () => {
      const users = [mockUser, { ...mockUser, id: 'test-id-2' }];
      mockModel.findMany.mockResolvedValue(users);

      const result = await repository.findMany();

      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: undefined,
        skip: undefined,
        take: undefined,
      });
      expect(result).toEqual(users);
    });

    it('should apply where conditions', async () => {
      mockModel.findMany.mockResolvedValue([]);

      const where: Prisma.UserWhereInput = { role: 'ADMIN' };
      await repository.findMany(where);

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where }),
      );
    });

    it('should apply options', async () => {
      mockModel.findMany.mockResolvedValue([]);

      await repository.findMany(undefined, {
        orderBy: { createdAt: 'desc' },
        skip: 10,
        take: 5,
      });

      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
        skip: 10,
        take: 5,
      });
    });
  });

  describe('count', () => {
    it('should count all entities', async () => {
      mockModel.count.mockResolvedValue(10);

      const result = await repository.count();

      expect(mockModel.count).toHaveBeenCalledWith({ where: undefined });
      expect(result).toBe(10);
    });

    it('should count with where conditions', async () => {
      mockModel.count.mockResolvedValue(5);

      const where: Prisma.UserWhereInput = { role: 'ADMIN' };
      const result = await repository.count(where);

      expect(mockModel.count).toHaveBeenCalledWith({ where });
      expect(result).toBe(5);
    });
  });

  describe('exists', () => {
    it('should return true when entities exist', async () => {
      mockModel.count.mockResolvedValue(5);

      const where: Prisma.UserWhereInput = { role: 'ADMIN' };
      const result = await repository.exists(where);

      expect(result).toBe(true);
    });

    it('should return false when no entities exist', async () => {
      mockModel.count.mockResolvedValue(0);

      const where: Prisma.UserWhereInput = { email: 'nonexistent@example.com' };
      const result = await repository.exists(where);

      expect(result).toBe(false);
    });
  });

  describe('transaction', () => {
    it('should execute operations within a transaction', async () => {
      const mockTransactionFn = jest.fn().mockResolvedValue('result');

      const mockTransaction = jest
        .fn()
        .mockImplementation((fn: () => Promise<string>) => fn());
      prismaService.$transaction = mockTransaction;

      const result = await repository.transaction(mockTransactionFn);

      expect(mockTransaction).toHaveBeenCalled();
      expect(result).toBe('result');
    });
  });

  describe('getClient', () => {
    it('should return model when no transaction client is provided', () => {
      // The repository was created without a transaction client
      const client = (
        repository as unknown as { getClient: () => UserModelDelegate }
      ).getClient();
      expect(client).toBe(mockModel);
    });

    it('should return transaction client when provided', () => {
      // Create a new repository with transaction client
      const transactionMockModel: UserModelDelegate = {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      };

      const repoWithTransaction = new TestUserRepository(
        prismaService,
        mockModel,
        transactionMockModel,
      );

      const client = (
        repoWithTransaction as unknown as { getClient: () => UserModelDelegate }
      ).getClient();
      expect(client).toBe(transactionMockModel);
    });
  });

  describe('withRetry', () => {
    it('should return result on first successful attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await (
        repository as unknown as {
          withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
        }
      ).withRetry(operation, 'testOperation');

      expect(operation).toHaveBeenCalledTimes(1);
      expect(result).toBe('success');
    });

    it("should retry on P1001 (Can't reach database)", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Can't reach database",
        {
          code: 'P1001',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );
      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('success');

      const result = await (
        repository as unknown as {
          withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
        }
      ).withRetry(operation, 'testOperation');

      expect(operation).toHaveBeenCalledTimes(2);
      expect(result).toBe('success');
    });

    it('should retry on P1002 (Database timeout)', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Database timeout',
        {
          code: 'P1002',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );
      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('success');

      await (
        repository as unknown as {
          withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
        }
      ).withRetry(operation, 'testOperation');

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on P1008 (Operation timeout)', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Operation timeout',
        {
          code: 'P1008',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );
      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('success');

      await (
        repository as unknown as {
          withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
        }
      ).withRetry(operation, 'testOperation');

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on P1017 (Connection closed)', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Connection closed',
        {
          code: 'P1017',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );
      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('success');

      await (
        repository as unknown as {
          withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
        }
      ).withRetry(operation, 'testOperation');

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on P1024 (Timeout exceeded)', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Timeout exceeded',
        {
          code: 'P1024',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );
      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('success');

      await (
        repository as unknown as {
          withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
        }
      ).withRetry(operation, 'testOperation');

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-transient errors', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint violation',
        {
          code: 'P2002',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );
      const operation = jest.fn().mockRejectedValue(error);

      await expect(
        (
          repository as unknown as {
            withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
          }
        ).withRetry(operation, 'testOperation'),
      ).rejects.toThrow(error);

      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should use exponential backoff', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Can't reach database",
        {
          code: 'P1001',
          clientVersion: '1.0.0',
          meta: undefined,
          batchRequestIdx: undefined,
        },
      );

      const delays: number[] = [];
      const originalSetTimeout = global.setTimeout;

      // Mock setTimeout to capture delay values
      jest
        .spyOn(global, 'setTimeout')
        .mockImplementation((callback: () => void, delay?: number) => {
          delays.push(delay ?? 0);
          return originalSetTimeout(callback, 0);
        });

      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('success');

      await (
        repository as unknown as {
          withRetry: <T>(op: () => Promise<T>, name: string) => Promise<T>;
        }
      ).withRetry(operation, 'testOperation');

      // First retry should have delay of 100ms (100 * 2^0 = 100)
      // Second retry should have delay of 200ms (100 * 2^1 = 200)
      expect(delays[0]).toBe(100);
      expect(delays[1]).toBe(200);

      jest.restoreAllMocks();
    });
  });
});
