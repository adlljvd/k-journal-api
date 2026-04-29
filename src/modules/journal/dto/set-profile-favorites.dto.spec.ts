import { validate } from 'class-validator';
import { SetProfileFavoritesDto } from './set-profile-favorites.dto';

describe('SetProfileFavoritesDto', () => {
  it('should accept exactly 4 entry IDs', async () => {
    // Arrange
    const dto = new SetProfileFavoritesDto();
    dto.entryIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
    ];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept less than 4 entry IDs', async () => {
    // Arrange
    const dto = new SetProfileFavoritesDto();
    dto.entryIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept empty array', async () => {
    // Arrange
    const dto = new SetProfileFavoritesDto();
    dto.entryIds = [];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should reject more than 4 entry IDs', async () => {
    // Arrange
    const dto = new SetProfileFavoritesDto();
    dto.entryIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005',
    ];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toBeDefined();
  });

  it('should reject 6 entry IDs', async () => {
    // Arrange
    const dto = new SetProfileFavoritesDto();
    dto.entryIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005',
      '550e8400-e29b-41d4-a716-446655440006',
    ];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should reject non-UUID entry IDs', async () => {
    // Arrange
    const dto = new SetProfileFavoritesDto();
    dto.entryIds = ['not-a-uuid', '550e8400-e29b-41d4-a716-446655440002'];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
  });

  it('should accept valid UUIDs', async () => {
    // Arrange
    const dto = new SetProfileFavoritesDto();
    dto.entryIds = [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should enforce max 4 profile favorites (QG-016)', async () => {
    // Test boundary: 4 is allowed
    const validDto = new SetProfileFavoritesDto();
    validDto.entryIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
    ];
    const validErrors = await validate(validDto);
    expect(validErrors).toHaveLength(0);

    // Test boundary: 5 is rejected
    const invalidDto = new SetProfileFavoritesDto();
    invalidDto.entryIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005',
    ];
    const invalidErrors = await validate(invalidDto);
    expect(invalidErrors).toHaveLength(1);
  });
});
