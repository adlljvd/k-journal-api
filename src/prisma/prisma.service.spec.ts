import { Logger } from '@nestjs/common';

// Mock process.exit before any imports
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`process.exit(${code})`);
});

// Store original environment
const originalEnv = { ...process.env };

// Mock pg module
const mockPoolEnd = jest.fn().mockResolvedValue(undefined);
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    end: mockPoolEnd,
  })),
}));

// Mock PrismaPg adapter
jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

// Mock PrismaClient with class structure to allow extension
jest.mock('@prisma/client', () => {
  class MockPrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return {
    PrismaClient: MockPrismaClient,
  };
});

// Import after mocks
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  afterAll(() => {
    mockExit.mockRestore();
  });

  describe('constructor', () => {
    it('should throw error when DATABASE_URL is not set', () => {
      // Arrange
      delete process.env.DATABASE_URL;

      // Act & Assert
      expect(() => new PrismaService()).toThrow(
        'DATABASE_URL environment variable is not set',
      );
    });

    it('should throw error when DATABASE_URL is empty string', () => {
      // Arrange
      process.env.DATABASE_URL = '';

      // Act & Assert
      expect(() => new PrismaService()).toThrow(
        'DATABASE_URL environment variable is not set',
      );
    });

    it('should create instance with valid DATABASE_URL', () => {
      // Arrange
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

      // Act
      const service = new PrismaService();

      // Assert
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(PrismaService);
    });

    it('should implement OnModuleInit interface', () => {
      // Arrange
      const service = new PrismaService();

      // Assert
      expect(typeof service.onModuleInit).toBe('function');
    });

    it('should implement OnModuleDestroy interface', () => {
      // Arrange
      const service = new PrismaService();

      // Assert
      expect(typeof service.onModuleDestroy).toBe('function');
    });
  });

  describe('onModuleInit', () => {
    it('should call $connect and log success message', async () => {
      // Arrange
      const service = new PrismaService();
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Mock $connect to resolve
      (service.$connect as jest.Mock).mockResolvedValueOnce(undefined);

      // Act
      await service.onModuleInit();

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.$connect).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        'Successfully connected to the database',
      );
    });

    it('should log error and call process.exit when $connect fails', async () => {
      // Arrange
      const service = new PrismaService();
      const error = new Error('Connection failed');
      (service.$connect as jest.Mock).mockRejectedValueOnce(error);
      const errorSpy = jest.spyOn(service['logger'], 'error');

      // Act & Assert
      await expect(service.onModuleInit()).rejects.toThrow('process.exit(1)');
      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to connect to the database',
        error,
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect, pool.end and log success message', async () => {
      // Arrange
      const service = new PrismaService();
      (service.$disconnect as jest.Mock).mockResolvedValueOnce(undefined);
      mockPoolEnd.mockResolvedValueOnce(undefined);
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.onModuleDestroy();

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.$disconnect).toHaveBeenCalledTimes(1);
      expect(mockPoolEnd).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(
        'Successfully disconnected from the database',
      );
    });
  });

  describe('Logger', () => {
    it('should have a logger instance', () => {
      // Arrange
      const service = new PrismaService();

      // Assert
      expect(service['logger']).toBeDefined();
      expect(service['logger']).toBeInstanceOf(Logger);
    });
  });
});
