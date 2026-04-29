import { IsUsername } from './is-username.decorator';
import { validate } from 'class-validator';

class TestUsernameDto {
  @IsUsername()
  username!: string;
}

describe('IsUsername Decorator', () => {
  describe('valid usernames', () => {
    it('should accept username with exactly 3 characters', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'abc';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username with exactly 30 characters', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'a' + 'b'.repeat(29); // 30 chars, starts with letter

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username with letters and numbers', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user123';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username with underscores', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user_name_123';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username with only letters', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'johndoe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username starting with uppercase letter', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'JohnDoe';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username with mixed case', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'UsErNaMe123';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username ending with number', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user1';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept username ending with underscore', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user_';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('invalid usernames - length', () => {
    it('should reject username with exactly 2 characters', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'ab';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username with exactly 31 characters', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'a' + 'b'.repeat(30); // 31 chars

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username with 1 character', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'a';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject empty string username', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('invalid usernames - starting character', () => {
    it('should reject username starting with number', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = '1username';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username starting with underscore', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = '_username';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username starting with special character', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = '@username';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('invalid usernames - disallowed characters', () => {
    it('should reject username with spaces', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user name';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username with hyphen', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user-name';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username with at sign', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user@name';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username with dot', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user.name';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username with special characters', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'user$name';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject username with unicode characters', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = 'usérname';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('non-string values', () => {
    it('should reject null value', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (dto as any).username = null;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject undefined value', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = undefined as unknown as string;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject number value', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      (dto as unknown as Record<string, unknown>).username = 12345;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject object value', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      (dto as unknown as Record<string, unknown>).username = { name: 'test' };

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject array value', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      (dto as unknown as Record<string, unknown>).username = ['username'];

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject boolean value', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      (dto as unknown as Record<string, unknown>).username = true;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('error message', () => {
    it('should return correct error message for invalid username', async () => {
      // Arrange
      const dto = new TestUsernameDto();
      dto.username = '12';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors[0].constraints).toEqual(
        expect.objectContaining({
          customValidation:
            'Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores',
        }),
      );
    });
  });
});
