import { validate } from 'class-validator';
import { CreateJournalEntryDto } from './create-journal-entry.dto';
import { WatchStatus } from '../../../common/enums/watch-status.enum';

describe('CreateJournalEntryDto', () => {
  it('should accept entry with status only', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
    dto.status = WatchStatus.WATCHING;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept entry with all fields', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
    dto.status = WatchStatus.COMPLETED;
    dto.rating = 4.5;
    dto.review = 'A masterpiece of storytelling.';
    dto.isFavorite = true;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should reject entry without contentId', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.status = WatchStatus.WATCHING;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('contentId');
  });

  it('should reject entry without status', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });

  it('should reject invalid contentId format', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = 'not-a-uuid';
    dto.status = WatchStatus.WATCHING;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('contentId');
  });

  it('should reject invalid status value', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
    (dto as unknown as Record<string, unknown>).status = 'INVALID_STATUS';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });

  it('should accept WATCHING status', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
    dto.status = WatchStatus.WATCHING;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept COMPLETED status', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
    dto.status = WatchStatus.COMPLETED;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept DROPPED status', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
    dto.status = WatchStatus.DROPPED;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should accept PLAN_TO_WATCH status', async () => {
    // Arrange
    const dto = new CreateJournalEntryDto();
    dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
    dto.status = WatchStatus.PLAN_TO_WATCH;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  describe('rating validation', () => {
    it('should accept valid rating 0.5', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.rating = 0.5;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept valid rating 5.0', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.rating = 5.0;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should reject rating below 0.5', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.rating = 0.4;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('rating');
    });

    it('should reject rating above 5.0', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.rating = 5.1;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('rating');
    });

    it('should reject rating not in 0.5 increments', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.rating = 3.7;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('rating');
    });

    it('should accept null rating (optional)', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (dto as any).rating = null;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept undefined rating (optional)', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.rating = undefined;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('isFavorite default', () => {
    it('should default isFavorite to false when not provided', () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;

      // Assert
      expect(dto.isFavorite).toBe(false);
    });

    it('should accept isFavorite true', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.isFavorite = true;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should accept isFavorite false', async () => {
      // Arrange
      const dto = new CreateJournalEntryDto();
      dto.contentId = '550e8400-e29b-41d4-a716-446655440000';
      dto.status = WatchStatus.WATCHING;
      dto.isFavorite = false;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });
});
