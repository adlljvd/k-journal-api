import { IsRating } from './is-rating.decorator';
import { validate } from 'class-validator';

class TestRatingDto {
  @IsRating()
  rating?: number;
}

describe('IsRating Decorator', () => {
  it('should accept rating 0.5', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 0.5;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept rating 5.0', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 5.0;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept rating 1.0', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 1.0;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept rating 2.5', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 2.5;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept rating 3.0', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 3.0;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept rating 4.5', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 4.5;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should reject rating below 0.5', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 0.4;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toBeDefined();
  });

  it('should reject rating of 0', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 0;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should reject rating above 5.0', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 5.1;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should reject rating of 6.0', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 6.0;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should reject rating not in 0.5 increments (3.7)', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 3.7;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should reject rating not in 0.5 increments (2.3)', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 2.3;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should reject rating not in 0.5 increments (4.99)', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 4.99;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should accept null rating (rating is optional)', async () => {
    // Arrange
    const dto = new TestRatingDto();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (dto as any).rating = null;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept undefined rating (rating is optional)', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = undefined;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should reject non-numeric rating (string)', async () => {
    // Arrange
    const dto = new TestRatingDto();
    (dto as unknown as Record<string, unknown>).rating = '4.5';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should reject non-numeric rating (object)', async () => {
    // Arrange
    const dto = new TestRatingDto();
    (dto as unknown as Record<string, unknown>).rating = { value: 4 };

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should return correct error message', async () => {
    // Arrange
    const dto = new TestRatingDto();
    dto.rating = 3.7;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors[0].constraints).toEqual(
      expect.objectContaining({
        customValidation:
          'Rating must be between 0.5 and 5.0 in 0.5 increments',
      }),
    );
  });

  // P0-JRN-003: Rating must be 0.5-5.0 in 0.5 increments
  it('should enforce rating range 0.5-5.0 (P0-JRN-003)', async () => {
    // Test lower bound
    const lowerDto = new TestRatingDto();
    lowerDto.rating = 0.49;
    const lowerErrors = await validate(lowerDto);
    expect(lowerErrors).toHaveLength(1);

    // Test upper bound
    const upperDto = new TestRatingDto();
    upperDto.rating = 5.01;
    const upperErrors = await validate(upperDto);
    expect(upperErrors).toHaveLength(1);

    // Test valid bounds
    const validLowerDto = new TestRatingDto();
    validLowerDto.rating = 0.5;
    const validLowerErrors = await validate(validLowerDto);
    expect(validLowerErrors).toHaveLength(0);

    const validUpperDto = new TestRatingDto();
    validUpperDto.rating = 5.0;
    const validUpperErrors = await validate(validUpperDto);
    expect(validUpperErrors).toHaveLength(0);
  });

  it('should enforce 0.5 increments (P0-JRN-003)', async () => {
    // Test all valid increments
    const validRatings = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    for (const rating of validRatings) {
      const dto = new TestRatingDto();
      dto.rating = rating;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }

    // Test invalid increments
    const invalidRatings = [0.6, 1.2, 1.7, 2.3, 3.4, 4.8];
    for (const rating of invalidRatings) {
      const dto = new TestRatingDto();
      dto.rating = rating;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    }
  });
});
