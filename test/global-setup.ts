/**
 * Global setup for E2E tests
 * Loads environment variables before tests run
 */
import 'dotenv/config';

export default function globalSetup(): void {
  // Verify required environment variables
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is required for E2E tests',
    );
  }
  if (!process.env.JWT_SECRET) {
    // Set a default for tests if not provided
    process.env.JWT_SECRET = 'test-secret-key-for-e2e-tests';
  }
}
