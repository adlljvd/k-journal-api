import { INestApplication } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaClient, Role, WatchStatus } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import * as jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';

export interface TestUser {
  id: string;
  email: string;
  username: string;
  password: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export interface TestContent {
  id: string;
  title: string;
  slug: string;
  type: string;
  year: number;
}

export interface TestJournalEntry {
  id: string;
  userId: string;
  contentId: string;
  status: string;
  rating?: number;
  review?: string;
  isFavorite: boolean;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/**
 * Clean all tables in the database
 */
export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
  // Delete in order to respect foreign key constraints
  await prisma.journalEntry.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.contentRequest.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.content.deleteMany();
  await prisma.genre.deleteMany();
}

/**
 * Create a test user and return user info with auth tokens
 */
export async function createTestUser(
  prisma: PrismaClient,
  options: {
    email?: string;
    username?: string;
    password?: string;
    role?: string;
  } = {},
): Promise<TestUser> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  const email = options.email || `test-${timestamp}-${random}@example.com`;
  const username = options.username || `testuser_${timestamp}_${random}`;
  const password = options.password || 'TestPassword123!';
  const role = options.role || 'USER';

  // Hash password
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  // Create user and profile
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        passwordHash,
        role: role as Role,
      },
    });

    await tx.userProfile.create({
      data: {
        userId: newUser.id,
        avatarUrl: null,
        bio: null,
        profileFavorites: [],
      },
    });

    return newUser;
  });

  // Generate tokens manually for testing
  const accessToken = createTestJwtToken(
    { sub: user.id, email: user.email, role: user.role },
    { expiresIn: '15m' },
  );

  // Create refresh token
  const refreshToken = randomBytes(64).toString('hex');
  const refreshTokenHash = createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    password,
    role: user.role,
    accessToken,
    refreshToken,
  };
}

/**
 * Create test content
 */
export async function createTestContent(
  prisma: PrismaClient,
  options: {
    title?: string;
    type?: 'DRAMA' | 'MOVIE';
    year?: number;
    genres?: string[];
    isFeatured?: boolean;
  } = {},
): Promise<TestContent> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  const title = options.title || `Test Content ${timestamp}_${random}`;
  const type = options.type || 'DRAMA';
  const year = options.year || 2023;
  const genres = options.genres || ['Drama'];
  const isFeatured = options.isFeatured ?? false;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const content = await prisma.content.create({
    data: {
      title,
      slug,
      type: type,
      year,
      synopsis: 'Test synopsis for test content',
      posterUrl: 'https://example.com/poster.jpg',
      genres,
      cast: 'Test Actor 1, Test Actor 2',
      episodes: type === 'DRAMA' ? 16 : null,
      durationMinutes: type === 'MOVIE' ? 120 : null,
      country: 'South Korea',
      isFeatured,
    },
  });

  return {
    id: content.id,
    title: content.title,
    slug: content.slug,
    type: content.type,
    year: content.year,
  };
}

/**
 * Create a test journal entry
 */
export async function createTestJournalEntry(
  prisma: PrismaClient,
  options: {
    userId: string;
    contentId: string;
    status?: string;
    rating?: number;
    review?: string;
    isFavorite?: boolean;
  },
): Promise<TestJournalEntry> {
  const entry = await prisma.journalEntry.create({
    data: {
      userId: options.userId,
      contentId: options.contentId,
      status: (options.status || 'PLAN_TO_WATCH') as WatchStatus,
      rating: options.rating ?? null,
      review: options.review ?? null,
      isFavorite: options.isFavorite ?? false,
    },
  });

  return {
    id: entry.id,
    userId: entry.userId,
    contentId: entry.contentId,
    status: entry.status,
    rating: entry.rating ? Number(entry.rating) : undefined,
    review: entry.review ?? undefined,
    isFavorite: entry.isFavorite,
  };
}

/**
 * Create test genres
 */
export async function createTestGenres(prisma: PrismaClient): Promise<void> {
  const genres = [
    { name: 'Romance', slug: 'romance' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Thriller', slug: 'thriller' },
    { name: 'Mystery', slug: 'mystery' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Action', slug: 'action' },
    { name: 'Historical', slug: 'historical' },
    { name: 'Medical', slug: 'medical' },
    { name: 'Legal', slug: 'legal' },
    { name: 'School', slug: 'school' },
    { name: 'Slice of Life', slug: 'slice-of-life' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: {},
      create: genre,
    });
  }
}

/**
 * Create a test JWT token
 */
function createTestJwtToken(
  payload: JwtPayload,
  options: jwt.SignOptions = {},
): string {
  const secret = process.env.JWT_SECRET || 'test-secret-key';
  return jwt.sign(payload, secret, options);
}

/**
 * Helper to make authenticated requests
 */
export function authRequest(app: INestApplication<App>, accessToken: string) {
  return request(app.getHttpServer()).auth(accessToken, { type: 'bearer' });
}

/**
 * Helper to create authenticated supertest agent
 */
export function createAuthAgent(
  app: INestApplication<App>,
  accessToken: string,
) {
  return request
    .agent(app.getHttpServer())
    .auth(accessToken, { type: 'bearer' });
}
