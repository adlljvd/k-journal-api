import { IsPassword } from './is-password.decorator';
import { validate } from 'class-validator';

class TestPasswordDto {
  @IsPassword()
  password!: string;
}

describe('IsPassword Decorator', () => {
  describe('valid passwords', () => {
    it('should accept password with exactly 8 characters', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = '12345678';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept password with more than 8 characters', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = 'this-is-a-long-password-123';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept password with mixed characters', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = 'P@ssw0rd!#%';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept password with only numbers', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = '12345678';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept password with spaces', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = 'pass word 12';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept very long password', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = 'a'.repeat(1000);

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('invalid passwords', () => {
    it('should reject password with exactly 7 characters', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = '1234567';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject password with 1 character', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = 'a';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject empty string password', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('non-string values', () => {
    it('should reject null value', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (dto as any).password = null;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject undefined value', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = undefined as unknown as string;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject number value', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      (dto as unknown as Record<string, unknown>).password = 12345678;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject object value', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      (dto as unknown as Record<string, unknown>).password = {
        value: 'password123',
      };

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject array value', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      (dto as unknown as Record<string, unknown>).password = ['password'];

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject boolean value', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      (dto as unknown as Record<string, unknown>).password = true;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('error message', () => {
    it('should return correct error message for short password', async () => {
      // Arrange
      const dto = new TestPasswordDto();
      dto.password = 'short';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors[0].constraints).toEqual(
        expect.objectContaining({
          customValidation: 'Password must be at least 8 characters long',
        }),
      );
    });
  });
});
