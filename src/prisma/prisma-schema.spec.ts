import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Prisma Schema Verification Tests
 *
 * These tests verify the Prisma schema file contains all required models,
 * fields, constraints, and indexes as specified in the SPEC.
 */
describe('Prisma Schema', () => {
  const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma');
  let schemaContent: string;

  beforeAll(() => {
    schemaContent = readFileSync(schemaPath, 'utf-8');
  });

  describe('Models', () => {
    it('should have User model', () => {
      expect(schemaContent).toMatch(/model\s+User\s*{/);
    });

    it('should have UserProfile model', () => {
      expect(schemaContent).toMatch(/model\s+UserProfile\s*{/);
    });

    it('should have Content model', () => {
      expect(schemaContent).toMatch(/model\s+Content\s*{/);
    });

    it('should have Genre model', () => {
      expect(schemaContent).toMatch(/model\s+Genre\s*{/);
    });

    it('should have JournalEntry model', () => {
      expect(schemaContent).toMatch(/model\s+JournalEntry\s*{/);
    });

    it('should have ContentRequest model', () => {
      expect(schemaContent).toMatch(/model\s+ContentRequest\s*{/);
    });

    it('should have RefreshToken model', () => {
      expect(schemaContent).toMatch(/model\s+RefreshToken\s*{/);
    });

    it('should have exactly 7 models', () => {
      const modelMatches = schemaContent.match(/model\s+\w+\s*{/g);
      expect(modelMatches).toHaveLength(7);
    });
  });

  describe('Enums', () => {
    it('should have Role enum', () => {
      expect(schemaContent).toMatch(/enum\s+Role\s*{/);
    });

    it('should have ContentType enum', () => {
      expect(schemaContent).toMatch(/enum\s+ContentType\s*{/);
    });

    it('should have WatchStatus enum', () => {
      expect(schemaContent).toMatch(/enum\s+WatchStatus\s*{/);
    });

    it('should have RequestStatus enum', () => {
      expect(schemaContent).toMatch(/enum\s+RequestStatus\s*{/);
    });

    it('should have exactly 4 enums', () => {
      const enumMatches = schemaContent.match(/enum\s+\w+\s*{/g);
      expect(enumMatches).toHaveLength(4);
    });
  });

  describe('Unique constraints', () => {
    it('should have unique email on User', () => {
      expect(schemaContent).toMatch(/email\s+String.*@unique/);
    });

    it('should have unique username on User', () => {
      expect(schemaContent).toMatch(/username\s+String.*@unique/);
    });

    it('should have unique slug on Content', () => {
      expect(schemaContent).toMatch(/slug\s+String.*@unique/);
    });

    it('should have unique tokenHash on RefreshToken', () => {
      expect(schemaContent).toMatch(/tokenHash\s+String.*@unique/);
    });

    it('should have unique constraint on JournalEntry (userId, contentId)', () => {
      expect(schemaContent).toMatch(/@@unique\(\[userId,\s*contentId\]\)/);
    });
  });

  describe('Indexes', () => {
    it('should have index on User email', () => {
      expect(schemaContent).toMatch(/@@index\(\[email\]\)/);
    });

    it('should have index on User username', () => {
      expect(schemaContent).toMatch(/@@index\(\[username\]\)/);
    });

    it('should have index on JournalEntry userId', () => {
      expect(schemaContent).toMatch(/@@index\(\[userId\]\)/);
    });

    it('should have index on JournalEntry contentId', () => {
      expect(schemaContent).toMatch(/@@index\(\[contentId\]\)/);
    });

    it('should have index on Content slug', () => {
      expect(schemaContent).toMatch(/@@index\(\[slug\]\)/);
    });
  });

  describe('Relations', () => {
    it('should have User -> UserProfile relation', () => {
      expect(schemaContent).toMatch(/profile\s+UserProfile\?/);
    });

    it('should have User -> JournalEntry relation', () => {
      expect(schemaContent).toMatch(/journal\s+JournalEntry\[\]/);
    });

    it('should have User -> ContentRequest relation', () => {
      expect(schemaContent).toMatch(/requests\s+ContentRequest\[\]/);
    });

    it('should have Content -> JournalEntry relation', () => {
      expect(schemaContent).toMatch(/journalEntries\s+JournalEntry\[\]/);
    });

    it('should have Content -> ContentRequest relation', () => {
      expect(schemaContent).toMatch(/requests\s+ContentRequest\[\]/);
    });
  });

  describe('Cascading deletes', () => {
    it('should have cascade delete on UserProfile', () => {
      expect(schemaContent).toMatch(/onDelete:\s*Cascade/);
    });

    it('should have cascade delete on JournalEntry user relation', () => {
      expect(schemaContent).toMatch(/user\s+User.*onDelete:\s*Cascade/);
    });

    it('should have cascade delete on JournalEntry content relation', () => {
      expect(schemaContent).toMatch(/content\s+Content.*onDelete:\s*Cascade/);
    });
  });

  describe('Field constraints', () => {
    it('should define email as Cit extension', () => {
      expect(schemaContent).toMatch(/email\s+String\s+@unique\s+@db\.Citext/);
    });

    it('should define username as Cit extension', () => {
      expect(schemaContent).toMatch(
        /username\s+String\s+@unique\s+@db\.Citext/,
      );
    });

    it('should define rating as Decimal', () => {
      expect(schemaContent).toMatch(
        /rating\s+Decimal\?\s+@db\.Decimal\(2,\s*1\)/,
      );
    });

    it('should define bio with max length 160', () => {
      expect(schemaContent).toMatch(/bio\s+String\?\s+@db\.VarChar\(160\)/);
    });

    it('should define avatarUrl with max length 500', () => {
      expect(schemaContent).toMatch(
        /avatarUrl\s+String\?\s+@db\.VarChar\(500\)/,
      );
    });

    it('should define posterUrl with max length 500', () => {
      expect(schemaContent).toMatch(
        /posterUrl\s+String\?\s+@db\.VarChar\(500\)/,
      );
    });
  });

  describe('Default values', () => {
    it('should have default role as USER', () => {
      expect(schemaContent).toMatch(/role\s+Role\s+@default\(USER\)/);
    });

    it('should have default isFeatured as false', () => {
      expect(schemaContent).toMatch(/isFeatured\s+Boolean\s+@default\(false\)/);
    });

    it('should have default isFavorite as false', () => {
      expect(schemaContent).toMatch(/isFavorite\s+Boolean\s+@default\(false\)/);
    });

    it('should have default status as PENDING', () => {
      expect(schemaContent).toMatch(
        /status\s+RequestStatus\s+@default\(PENDING\)/,
      );
    });

    it('should have default country as South Korea', () => {
      expect(schemaContent).toMatch(
        /country\s+String\s+@default\("South Korea"\)/,
      );
    });

    it('should have default genres as empty array', () => {
      expect(schemaContent).toMatch(/genres\s+Json\s+@default\("\[\]"\)/);
    });
  });
});
