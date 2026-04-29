---
name: testing-strategy
description: 'Testing strategy and implementation. Use when writing or reviewing tests.'
---

## Testing Pyramid

| Type        | Tool                       | Target                | Proportion |
| ----------- | -------------------------- | --------------------- | ---------- |
| Unit        | Vitest                     | Utils, hooks, schemas | 70%        |
| Component   | Storybook                  | UI components         | Per UI     |
| Integration | Vitest + React Testing Lib | Feature components    | 20%        |
| E2E         | Playwright                 | Critical journeys     | 10%        |

---

## Two Testing Frameworks

This project uses **two separate testing frameworks** with different purposes and locations:

| Framework      | Purpose                  | Test Types                        | Location                            |
| -------------- | ------------------------ | --------------------------------- | ----------------------------------- |
| **Vitest**     | Unit & Integration Tests | Unit, Integration, A11y, Keyboard | `src/**/*.test.ts` (next to source) |
| **Playwright** | End-to-End Tests         | E2E                               | `e2e/*.spec.ts` (project root)      |

### Why Two Separate Locations?

| Folder      | Framework  | Contains                                                       |
| ----------- | ---------- | -------------------------------------------------------------- |
| `src/test/` | Vitest     | Setup files, fixtures, utils, mocks for Unit/Integration tests |
| `e2e/`      | Playwright | E2E tests, fixtures, utils for E2E tests                       |

**They are separate because:**

- Different tools (Vitest vs Playwright)
- Different test scopes (component-level vs full application)
- Different configurations and runners

### Directory Structure Overview

```
project/
├── e2e/                          # Playwright (E2E Tests)
│   ├── *.spec.ts                 # E2E test files
│   ├── fixtures/                 # E2E test data
│   └── utils/                    # E2E helpers
│
├── src/
│   ├── test/                     # Vitest Setup & Utilities
│   │   ├── setup-vitest.ts       # Vitest configuration
│   │   ├── fixtures/             # Unit test data
│   │   ├── utils/                # Unit test helpers
│   │   └── mocks/                # Mock implementations
│   │
│   └── components/ui/            # Source files with tests next to them
│       ├── button.tsx            # Source
│       ├── button.test.tsx       # Unit test (Vitest)
│       └── button.a11y.test.tsx  # A11y test (Vitest)
```

### What Goes Where?

| Content                               | `src/test/` | `e2e/`                             |
| ------------------------------------- | ----------- | ---------------------------------- |
| Test files (`*.test.ts`, `*.spec.ts`) | ❌ NO       | ✅ YES (`.spec.ts` only)           |
| Setup files (`setup-*.ts`)            | ✅ YES      | ❌ NO (use `playwright.config.ts`) |
| Fixtures (test data)                  | ✅ YES      | ✅ YES                             |
| Utils (helpers)                       | ✅ YES      | ✅ YES                             |
| Mocks                                 | ✅ YES      | ✅ YES                             |

---

## Test Location Rules

### Location Principle

**All tests MUST be placed next to the source file they test.**

```
src/components/ui/
├── button.tsx
├── button.test.tsx           # Unit test
├── button.a11y.test.tsx      # Accessibility test
├── button.integration.test.tsx  # Integration test
├── dialog.tsx
├── dialog.test.tsx
└── dialog.keyboard.test.tsx  # Keyboard test
```

### E2E Tests Location

**E2E tests MUST be in `e2e/` folder at project root.**

```
e2e/
├── auth.spec.ts
├── dashboard.spec.ts
├── users.spec.ts
├── fixtures/
│   └── auth-fixtures.ts
└── utils/
    └── mock-api.ts
```

### Test Utilities Location

**Vitest Utilities (`src/test/`):**

| Content       | Allowed | Example                   |
| ------------- | ------- | ------------------------- |
| Setup files   | ✅ YES  | `setup-vitest.ts`         |
| Fixtures      | ✅ YES  | `fixtures/test-data.ts`   |
| Utils/Helpers | ✅ YES  | `utils/query-wrapper.tsx` |
| Mocks         | ✅ YES  | `mocks/api-mock.ts`       |
| Test files    | ❌ NO   | Move next to source file  |

**Playwright Utilities (`e2e/`):**

| Content        | Allowed | Example                     |
| -------------- | ------- | --------------------------- |
| E2E test files | ✅ YES  | `auth.spec.ts`              |
| Fixtures       | ✅ YES  | `fixtures/auth-fixtures.ts` |
| Utils/Helpers  | ✅ YES  | `utils/mock-api.ts`         |

```
# Vitest utilities location
src/test/
├── setup-vitest.ts      # Required - Vitest setup
├── fixtures/            # Optional - Unit test data
├── utils/               # Optional - Test helpers (QueryClientWrapper, etc.)
└── mocks/               # Optional - Mock implementations

# Playwright utilities location
e2e/
├── *.spec.ts            # E2E test files
├── fixtures/            # E2E test data (mock responses, test users)
└── utils/               # E2E helpers (API mocking, page objects)
```

### Test File Naming Convention

| Test Type     | Suffix                   | Example                            |
| ------------- | ------------------------ | ---------------------------------- |
| Unit          | `.test.ts` / `.test.tsx` | `utils.test.ts`, `button.test.tsx` |
| Integration   | `.integration.test.ts`   | `user-table.integration.test.tsx`  |
| Accessibility | `.a11y.test.ts`          | `button.a11y.test.tsx`             |
| Keyboard      | `.keyboard.test.ts`      | `dialog.keyboard.test.tsx`         |
| Bundle        | `.bundle.test.ts`        | `accordion.bundle.test.ts`         |
| Type          | `.types.test.ts`         | `api.types.test.ts`                |
| Coverage      | `.coverage.test.ts`      | `button.coverage.test.ts`          |
| Animation     | `.animation.test.ts`     | `accordion.animation.test.ts`      |
| E2E           | `.spec.ts`               | `login.spec.ts`, `users.spec.ts`   |

### Prohibited Patterns

| Pattern              | Reason                              | Correct Pattern                       |
| -------------------- | ----------------------------------- | ------------------------------------- |
| `__tests__/` folders | Violates "next to source" principle | Place test next to source file        |
| `src/test/*.test.ts` | Tests must be next to source        | Move to appropriate source directory  |
| `src/test/e2e/`      | E2E must be at root                 | Use `e2e/` at project root            |
| Duplicate test files | One test file per aspect            | Use suffixes for different test types |

---

## Unit Tests (Vitest)

**Target:** Utility functions, Zod schemas, and custom React hooks.

**Location:** Next to the file being tested (e.g., `utils.test.ts`, `use-users.test.ts`).

**Command:** `pnpm test`

### Rules

- Use `@testing-library/react`'s `renderHook` to test custom hooks in isolation
- Mock the `apiClient` using `vi.mock()`
- Every utility function in `src/lib/` MUST have 100% branch coverage
- `beforeEach` for setup (fresh mocks each test)
- `afterEach` for cleanup (`vi.clearAllMocks()`)

### Example: Hook Test

```typescript
// src/components/features/users/hooks/use-users.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './use-users';
import { QueryClientWrapper } from '@/test/utils';
import { vi } from 'vitest';
import * as api from '../api/user-api';

vi.mock('../api/user-api');

test('fetches users successfully', async () => {
  vi.mocked(api.getUsers).mockResolvedValueOnce([{ id: '1', name: 'John' }]);
  const { result } = renderHook(() => useUsers(), { wrapper: QueryClientWrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(1);
});
```

### Example: Utility Test

```typescript
// src/lib/utils.test.ts
import { cn } from './utils';

test('cn merges class names correctly', () => {
  expect(cn('foo', 'bar')).toBe('foo bar');
  expect(cn('foo', false && 'bar')).toBe('foo');
  expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
});
```

---

## Component Tests (Storybook)

**Target:** Dumb UI components (`src/components/ui/`) and isolated feature components.

**Location:** Next to the component (e.g., `button.stories.tsx`).

**Command:** `pnpm storybook`

### Rules

- Every component in `src/components/ui/` MUST have a story demonstrating its variants
- Use Storybook's `play` function to test user interactions visually

### Example: Button Story

```typescript
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
};
```

---

## Integration Tests (Vitest + React Testing Library)

**Target:** Smart feature components (e.g., `UserTable`, `UserDialog`).

**Location:** Next to the component (e.g., `user-table.integration.test.tsx`).

**Naming:** Use `.integration.test.ts` suffix to distinguish from unit tests.

### Rules

- Verify component renders correctly, interacts with mocked API, and handles loading/error states
- Mock the Axios API layer or use MSW (Mock Service Worker)
- Wrap component in necessary providers (QueryClient, CASL AbilityContext)

### Example: Feature Component Test

```tsx
// src/components/features/users/components/user-table.integration.test.tsx
import { render, screen } from '@testing-library/react';
import { UserTable } from './user-table';
import { AppTestWrapper } from '@/test/utils';

test('renders loading state then data', async () => {
  render(<UserTable />, { wrapper: AppTestWrapper });
  expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();

  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

---

## Accessibility Tests

**Target:** Components with accessibility requirements.

**Location:** Next to the component (e.g., `button.a11y.test.tsx`).

**Naming:** Use `.a11y.test.ts` suffix.

### Rules

- Test ARIA attributes and roles
- Test keyboard navigation
- Test screen reader announcements
- Verify focus management

### Example

```typescript
// src/components/ui/dialog.a11y.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './dialog';

test('dialog traps focus when open', async () => {
  const user = userEvent.setup();
  render(<Dialog trigger="Open">Content</Dialog>);

  await user.click(screen.getByText('Open'));
  expect(screen.getByRole('dialog')).toHaveFocus();
});
```

---

## E2E Tests (Playwright)

**Target:** Critical user journeys (Login, Create User, Checkout).

**Location:** `e2e/` folder at project root (NOT inside `src/`).

**Naming:** Use `.spec.ts` suffix for E2E tests.

**Command:** `pnpm test:e2e`

### Rules

- Do NOT mock the frontend code
- Run actual Next.js build against a real or fully mocked backend
- Test the "Happy Path" and critical failure paths
- Focus on user-visible behavior, not implementation details

### Example: Login E2E Test

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can login with valid credentials', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('shows error for invalid credentials', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', 'wrong@example.com');
  await page.fill('input[name="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');

  await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials');
});
```

---

## Test Naming Convention

```typescript
// Pattern: should [expected behavior] when [condition]
it('should return user when found', async () => { ... });
it('should throw NotFoundException when user not found', async () => { ... });
it('should hash password before saving', async () => { ... });
it('should return paginated results with correct meta', async () => { ... });
```

---

## Mocking Strategy

### API Client Mocking

```typescript
import { vi } from 'vitest';
import * as api from '../api/user-api';

vi.mock('../api/user-api');

test('fetches users', async () => {
  vi.mocked(api.getUsers).mockResolvedValueOnce([{ id: '1', name: 'John' }]);
  // ... test code
});
```

### TanStack Query Wrapper

```typescript
// src/test/utils/query-wrapper.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

const createQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export const renderWithProviders = (ui: ReactElement, options?: RenderOptions) => {
  return render(ui, { wrapper: QueryClientWrapper, ...options });
};
```

---

## Hard Rules

### Test Implementation

| Rule                      | Details                              |
| ------------------------- | ------------------------------------ |
| Test types per QUALITY.md | Use specified test type              |
| One assertion per test    | Test one thing per test case         |
| Fully isolated            | No shared state                      |
| Descriptive names         | `should [behavior] when [condition]` |
| No test skips in commits  | `it.skip` forbidden in PRs           |
| Coverage meets target     | Check QUALITY.md requirements        |
| All tests pass            | Fix failures before proceeding       |

### Test Location (NON-NEGOTIABLE)

| Rule                         | Details                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| NO `__tests__/` folders      | Tests MUST be next to source files                               |
| E2E at root only             | E2E tests MUST be in `e2e/` at project root, NEVER inside `src/` |
| NO test files in `src/test/` | Only setup files, fixtures, utils, mocks allowed                 |
| One test file per aspect     | Use suffixes: `.a11y.test.ts`, `.integration.test.ts`            |
| NO duplicate tests           | Remove duplicates, keep the one next to source                   |
| Follow naming convention     | `.test.ts` for unit, `.spec.ts` for E2E                          |

---

## Run Commands

```bash
# Unit tests
pnpm test

# Unit tests watch mode
pnpm test --watch

# Unit tests coverage
pnpm test --coverage

# E2E tests
pnpm test:e2e

# Storybook
pnpm storybook
```

---

## Test Type Decision Matrix

| Test Type   | Speed  | Confidence | When to Use                   |
| ----------- | ------ | ---------- | ----------------------------- |
| Unit        | Fast   | Low        | Business logic, hooks, utils  |
| Component   | Fast   | Medium     | UI components, visual testing |
| Integration | Medium | High       | Feature components with API   |
| E2E         | Slow   | Highest    | Critical user journeys        |

---

## Reference

- ADR-002: Test Location Standard
- `e2e/` - E2E test directory at project root
- `src/test/` - Test utilities, fixtures, and setup files only
