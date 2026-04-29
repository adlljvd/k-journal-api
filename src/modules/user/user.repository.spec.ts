/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../common/enums/role.enum';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockUser = {
    id: 'user-uuid-1234',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashed-password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: null,
  };

  const mockUserWithProfile = {
    ...mockUser,
    profile: {
      userId: 'user-uuid-1234',
      avatarUrl: null,
      bio: 'Test bio',
      profileFavorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await repository.findByEmail('test@example.com');

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent email', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await repository.findByUsername('testuser');

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent username', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByUsername('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByIdWithProfile', () => {
    it('should return user with profile', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUserWithProfile);

      // Act
      const result = await repository.findByIdWithProfile('user-uuid-1234');

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
        include: { profile: true },
      });
      expect(result).toEqual(mockUserWithProfile);
      expect((result as any)?.profile).toBeDefined();
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findByIdWithProfile('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateEmail', () => {
    it('should update user email', async () => {
      // Arrange
      const updatedUser = { ...mockUser, email: 'newemail@example.com' };
      prismaService.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await repository.updateEmail(
        'user-uuid-1234',
        'newemail@example.com',
      );

      // Assert
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
        data: { email: 'newemail@example.com' },
      });
      expect(result.email).toBe('newemail@example.com');
    });
  });

  describe('updatePassword', () => {
    it('should update user password hash', async () => {
      // Arrange
      prismaService.user.update.mockResolvedValue(mockUser);

      // Act
      const result = await repository.updatePassword(
        'user-uuid-1234',
        'new-hashed-password',
      );

      // Assert
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
        data: { passwordHash: 'new-hashed-password' },
      });
      expect(result).toBeDefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      // Arrange
      prismaService.user.delete.mockResolvedValue(mockUser);

      // Act
      const result = await repository.deleteUser('user-uuid-1234');

      // Assert
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create user with provided data', async () => {
      // Arrange
      const createData = {
        email: 'newuser@example.com',
        username: 'newuser',
        passwordHash: 'hashed-password',
        role: Role.USER,
      };
      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...createData,
      });

      // Act
      const result = await repository.create(createData);

      // Assert
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result.email).toBe(createData.email);
    });
  });

  describe('update', () => {
    it('should update user with provided data', async () => {
      // Arrange
      const updateData = { username: 'newusername' };
      prismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      // Act
      const result = await repository.update(
        { id: 'user-uuid-1234' },
        updateData,
      );

      // Assert
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
        data: updateData,
      });
      expect(result.username).toBe('newusername');
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await repository.findById({ id: 'user-uuid-1234' });

      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent id', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findById({ id: 'non-existent-id' });

      // Assert
      expect(result).toBeNull();
    });
  });
});
