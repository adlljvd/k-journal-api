/**
 * Test helper utilities for E2E tests
 * Provides authentication and test data helpers
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export interface TestUser {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  accessToken: string;
  refreshToken: string;
}

export interface TestContent {
  id: string;
  title: string;
  slug: string;
  type: 'DRAMA' | 'MOVIE';
  year: number;
}

export interface TestJournalEntry {
  id: string;
  status: 'WATCHING' | 'COMPLETED' | 'DROPPED' | 'PLAN_TO_WATCH';
  rating?: number;
  review?: string;
  isFavorite: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestApp = any;

/**
 * Register a test user and return auth tokens
 */
export async function createTestUser(
  app: INestApplication<TestApp>,
  options?: {
    email?: string;
    username?: string;
    password?: string;
  },
): Promise<TestUser> {
  const email = options?.email || `test${Date.now()}@test.com`;
  const username = options?.username || `testuser${Date.now()}`;
  const password = options?.password || 'testpassword123';

  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send({ email, username, password })
    .expect(201);

  const body = response.body.data || response.body;

  return {
    id: body.user.id,
    email: body.user.email,
    username: body.user.username,
    role: body.user.role,
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
  };
}

/**
 * Login as an existing user
 */
export async function loginTestUser(
  app: INestApplication<TestApp>,
  email: string,
  password: string,
): Promise<TestUser> {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);

  const body = response.body.data || response.body;

  return {
    id: body.user.id,
    email: body.user.email,
    username: body.user.username,
    role: body.user.role,
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
  };
}
