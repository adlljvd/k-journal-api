import { IsOptionalUrl } from './is-optional-url.decorator';
import { validate } from 'class-validator';

class TestOptionalUrlDto {
  @IsOptionalUrl()
  url?: string;
}

describe('IsOptionalUrl Decorator', () => {
  describe('valid URLs', () => {
    it('should accept valid http URL', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'http://example.com';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept valid https URL', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'https://example.com';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept valid URL with path', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'https://example.com/path/to/resource';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept valid URL with query params', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'https://example.com?query=value&other=123';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept valid URL with port', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'http://localhost:3000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept valid URL with subdomain', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'https://sub.example.com';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('optional field behavior', () => {
    it('should accept null value (optional field)', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (dto as any).url = null;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept undefined value (optional field)', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = undefined;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept empty string (optional field)', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('invalid URLs', () => {
    it('should reject invalid URL string', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'not-a-valid-url';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject URL with ftp protocol', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'ftp://example.com';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject URL with file protocol', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'file:///path/to/file';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject URL without protocol', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'example.com';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject URL with malformed protocol', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'http//example.com';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('non-string values', () => {
    it('should reject number value', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      (dto as unknown as Record<string, unknown>).url = 12345;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject object value', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      (dto as unknown as Record<string, unknown>).url = {
        href: 'https://example.com',
      };

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject array value', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      (dto as unknown as Record<string, unknown>).url = ['https://example.com'];

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });

    it('should reject boolean value', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      (dto as unknown as Record<string, unknown>).url = true;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
    });
  });

  describe('error message', () => {
    it('should return correct error message for invalid URL', async () => {
      // Arrange
      const dto = new TestOptionalUrlDto();
      dto.url = 'not-a-url';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors[0].constraints).toEqual(
        expect.objectContaining({
          customValidation: 'If provided, must be a valid URL (http or https)',
        }),
      );
    });
  });
});
