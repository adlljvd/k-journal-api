---
name: frontend-anti-patterns
description: 'Frontend anti-patterns to avoid. Use when reviewing code.'
---

## Anti-Patterns — What NEVER to Do

### Summary Table

| #   | Anti-Pattern                      | Correct Approach            |
| --- | --------------------------------- | --------------------------- |
| 1   | `any` type                        | Explicit type               |
| 2   | `@ts-ignore`                      | Fix the type error          |
| 3   | `eslint-disable`                  | Fix the lint error          |
| 4   | Client page for one button        | Push 'use client' down      |
| 5   | `useState` for search/filters     | URL state (useSearchParams) |
| 6   | Zustand for API data              | TanStack Query              |
| 7   | `@tanstack/react-form`            | react-hook-form             |
| 8   | Inline `style={{}}`               | Tailwind classes            |
| 9   | Feature importing another feature | Move shared to lib/         |
| 10  | UI component importing from app/  | Keep UI dumb                |
| 11  | `process.env` direct              | Use validated env object    |
| 12  | Manual role check                 | Use CASL permissions        |
| 13  | `undefined` for Prisma nulls      | Use `null`                  |
| 14  | Duplicate type definitions        | Single source of truth      |
| 15  | Magic numbers/strings             | Enums and constants         |

---

## Type Safety Anti-Patterns

### No `any`

```typescript
// ❌ NEVER
const data: any = response.data;
function process(input: any): any { ... }
const result = JSON.parse(str) as any;
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// ✅ CORRECT
interface UserData {
  id: string;
  name: string;
}
const data: UserData = userSchema.parse(response.data);
function process(input: UserInput): ProcessResult { ... }
```

### No `@ts-ignore` or `@ts-expect-error`

```typescript
// ❌ NEVER
// @ts-ignore
someCodeThatHasTypeError();

// ✅ CORRECT
// Fix the type error, or use proper type narrowing
```

### No `eslint-disable`

```typescript
// ❌ NEVER
// eslint-disable-next-line no-unused-vars
const unused = something;

// ✅ CORRECT
// Remove the unused variable or fix the lint error
```

---

## RSC Anti-Patterns

### No Client Page for Single Interactive Element

```tsx
// ❌ WRONG: Client Page
'use client';
export default function UsersPage() {
  const [search, setSearch] = useState('');
  return (
    <div>
      <input onChange={(e) => setSearch(e.target.value)} />
      <UserTable search={search} />
    </div>
  );
}

// ✅ CORRECT: Server Page + Client Island
export default async function UsersPage({ searchParams }) {
  return (
    <div>
      <UserSearchClient /> {/* Only this is 'use client' */}
      <UserTable initialSearch={searchParams.search} />
    </div>
  );
}
```

### No `useState` for Search/Filters

```tsx
// ❌ WRONG: useState for filters
const [search, setSearch] = useState('');

// ✅ CORRECT: URL state
const searchParams = useSearchParams();
const search = searchParams.get('search') || '';
```

---

## State Management Anti-Patterns

### No Zustand for API Data

```tsx
// ❌ WRONG: Zustand for API data
const useUserStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const res = await fetch('/api/users');
    set({ users: await res.json() });
  },
}));

// ✅ CORRECT: TanStack Query
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users').then((r) => r.data),
  });
}
```

### No `@tanstack/react-form`

```tsx
// ❌ WRONG: @tanstack/react-form
import { useForm } from '@tanstack/react-form';

// ✅ CORRECT: react-hook-form + zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
```

---

## Import Boundary Anti-Patterns

### No Cross-Feature Imports

```tsx
// ❌ WRONG: Feature A importing from Feature B
// src/components/features/users/components/user-list.tsx
import { RoleBadge } from '@/components/features/roles/components/role-badge';

// ✅ CORRECT: Move shared component to ui/
// src/components/ui/role-badge.tsx
export function RoleBadge({ role }) { ... }
```

### No UI Components Importing from App/Features

```tsx
// ❌ WRONG: UI importing from features
// src/components/ui/user-card.tsx
import { useUser } from '@/components/features/users/hooks/use-user';

// ✅ CORRECT: UI is dumb, receives data as props
export function UserCard({ user }: { user: User }) { ... }
```

---

## Styling Anti-Patterns

### No Inline Styles

```tsx
// ❌ WRONG: Inline styles
<div style={{ display: 'flex', gap: '16px' }}>

// ✅ CORRECT: Tailwind classes
<div className="flex gap-4">
```

---

## Authorization Anti-Patterns

### No Manual Role Checks

```tsx
// ❌ WRONG: Manual role check
{
  user.role === 'ADMIN' && <AdminButton />;
}

// ✅ CORRECT: CASL permission check
<Can I="manage" a="all">
  <AdminButton />
</Can>;
```

---

## Layer Boundaries

| Layer       | Allowed                   | Forbidden                 |
| ----------- | ------------------------- | ------------------------- |
| **UI**      | Nothing from app/features | Domain imports            |
| **Feature** | UI, lib, stores           | Other features            |
| **App**     | Features, layout, UI      | Direct lib business logic |
| **Lib**     | Nothing from app/features | UI components             |
| **Stores**  | lib types                 | Features, UI              |

---

## Environment Anti-Patterns

### No Direct `process.env`

```tsx
// ❌ WRONG: Direct process.env
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ✅ CORRECT: Validated env object
import { env } from '@/lib/config/env';
const apiUrl = env.NEXT_PUBLIC_API_URL;
```

---

## Quick Rules

| Rule                    | Details                    |
| ----------------------- | -------------------------- |
| No `any`                | Use explicit types         |
| No `@ts-ignore`         | Fix the type error         |
| No `eslint-disable`     | Fix the lint error         |
| No Zustand for API data | Use TanStack Query         |
| No cross-feature import | Move shared to lib/ or ui/ |
| No inline styles        | Use Tailwind               |
| No manual role checks   | Use CASL                   |
| No `process.env` direct | Use validated env object   |
