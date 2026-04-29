---
name: frontend-reference
description: 'Frontend tech stack and TypeScript rules. Use for allowed libraries and type definitions.'
---

## Tech Stack — Locked

Do not introduce new libraries without an ADR. Do not use alternative libraries for concerns already covered.

### Allowed Libraries

| Concern         | Library           | Import Path                        |
| --------------- | ----------------- | ---------------------------------- |
| Framework       | Next.js 15.x      | `next/navigation`, `next/link`     |
| UI Components   | shadcn/ui         | `@/components/ui/*`                |
| State (Server)  | TanStack Query v5 | `@tanstack/react-query`            |
| State (Client)  | Zustand v5        | `zustand`                          |
| Forms           | React Hook Form   | `react-hook-form`                  |
| Validation      | Zod               | `zod`, `@hookform/resolvers/zod`   |
| Authorization   | CASL 6.x          | `@casl/react`, `@casl/ability`     |
| Styling         | Tailwind CSS v4   | Tailwind utility classes           |
| HTTP Client     | Axios             | `axios` (via `@/lib/api/axios.ts`) |
| Testing (Unit)  | Vitest            | `vitest`, `@testing-library/react` |
| Testing (E2E)   | Playwright        | `@playwright/test`                 |
| Components Docs | Storybook         | `@storybook/react`                 |

### Forbidden

| Forbidden                         | Reason                                     |
| --------------------------------- | ------------------------------------------ |
| `@tanstack/react-form`            | Use `react-hook-form` instead              |
| `any` type                        | See type-rules below                       |
| `@ts-ignore` / `@ts-expect-error` | Fix the type error                         |
| `eslint-disable`                  | Fix the lint error, do not suppress it     |
| `as` type assertion               | Only allowed after Zod parse               |
| Inline `style={{}}`               | Use Tailwind classes                       |
| `lodash`                          | Use native JS methods                      |
| `moment`                          | Use `Date` or `dayjs` if absolutely needed |
| `process.env` directly            | Use validated `env` object                 |

---

## Type Rules — No Redundancy, No Shortcuts

### Forbidden Types

```typescript
// ❌ NEVER — any of these
const data: any = ...;
function process(input: any): any { ... }
const result = JSON.parse(str) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

```typescript
// ❌ NEVER — unknown without narrowing
function handle(error: unknown) {
  console.log(error.message); // error is unknown, this will fail
}

// ✅ CORRECT — unknown with narrowing
function handle(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

```typescript
// ❌ NEVER — Object (capital O)
const data: Object = ...;
```

### Required Return Types

```typescript
// ✅ CORRECT — explicit return types on hooks and utilities
export function useUsers(search?: string): UseQueryResult<User[], Error> { ... }
export function formatDate(date: Date): string { ... }
export function cn(...inputs: ClassValue[]): string { ... }
```

### Interface vs Type

```typescript
// ✅ CORRECT — interface for object shapes (DTOs, component props)
export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline';
  children: React.ReactNode;
}

// ✅ CORRECT — type for unions, intersections, and mapped types
export type Status = 'pending' | 'active' | 'inactive';
export type UserWithRole = UserDTO & { role: Role };
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';
```

### Zod Schema Derivation

```typescript
// ✅ CORRECT — derive types from Zod schemas
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  roleId: z.string().min(1, 'Role is required'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

// ✅ CORRECT — validate API responses
async function fetchUser(id: string): Promise<User> {
  const response = await apiClient.get(`/users/${id}`);
  return userSchema.parse(response.data);
}
```

---

## Environment Variables

Never use `process.env` directly in components. All environment variables must be accessed through the validated `env` object.

```typescript
// ❌ DON'T
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ✅ DO
import { env } from '@/lib/config/env';
const apiUrl = env.NEXT_PUBLIC_API_URL;
```

---

## Hard Rules

| Rule                                 | Details                             |
| ------------------------------------ | ----------------------------------- |
| No `any`                             | Use explicit types always           |
| No `Object` (capital O)              | Use `object` or explicit type       |
| No `eslint-disable`                  | Fix the lint error                  |
| No `@ts-ignore` / `@ts-expect-error` | Fix the type error                  |
| No `as` assertion                    | Only after Zod parse                |
| Explicit return types                | On all hooks and utility functions  |
| `interface` for object shapes        | DTOs, component props               |
| `type` for derived types             | Unions, intersections, mapped types |
| Validate API boundaries              | Use Zod for all external data       |
| No `process.env` direct              | Use validated `env` object          |

---

## Quick Reference

| Scenario           | Use                          |
| ------------------ | ---------------------------- |
| Component props    | `interface`                  |
| API response type  | `z.infer<typeof schema>`     |
| Status/State union | `type`                       |
| Form validation    | Zod schema + react-hook-form |
| Global state       | Zustand store                |
| Server state       | TanStack Query hook          |
| URL state          | useSearchParams / useRouter  |
