---
name: react-architecture
description: 'RSC patterns, Feature-Sliced Design, import boundaries. Use when deciding component placement or organizing features.'
---

## Core Architectural Principles

1. **React Server Components (RSC) First:** Default to Server Components. Only use `'use client'` when absolutely necessary (interactivity, browser APIs, hooks).
2. **Push State Down:** Keep `'use client'` as low in the component tree as possible. Do not make an entire page a Client Component just because one button needs `onClick`.
3. **Strict Feature Isolation:** Business logic lives in `src/components/features/[feature-name]`. Features are isolated silos.
4. **URL is the Source of Truth:** Search queries, filters, and pagination MUST live in the URL, not in `useState`.
5. **Single Source of Truth for Forms:** Use `react-hook-form` + `zod`. Do NOT use `@tanstack/react-form`.
6. **Strict Typing (No `any`):** TypeScript is our safety net. The use of `any` is strictly forbidden. All API boundaries must be validated with Zod.

---

## Directory Structure (Feature-Sliced Design)

```text
src/
├── app/                    # Routing, Pages, Layouts (RSC by default)
├── components/
│   ├── features/           # Domain modules (e.g., users, roles)
│   ├── ui/                 # Dumb, reusable components (shadcn/ui)
│   └── layout/             # Global layout components
├── lib/                    # Shared utilities (api, auth, utils)
└── stores/                 # Global client state (Zustand)
```

---

## Import Boundaries (CRITICAL)

### Strict Import Rules (NEVER VIOLATE)

- **Feature Isolation:** A feature (e.g., `features/users`) **MUST NOT** import anything from another feature (e.g., `features/roles`). If they need to share logic, it belongs in `src/lib/` or `src/components/ui/`.
- **UI Components:** `components/ui/` components **MUST NOT** import from `components/features/` or `app/`. They must remain completely dumb and domain-agnostic.
- **App Router:** `app/` can import from anywhere, but should primarily compose components from `features/` and `layout/`.

### Import Boundary Matrix

| From → To     | app/ | features/ | ui/ | lib/ | stores/ |
| ------------- | ---- | --------- | --- | ---- | ------- |
| **app/**      | ✅   | ✅        | ✅  | ✅   | ✅      |
| **features/** | ❌   | ❌\*      | ✅  | ✅   | ✅      |
| **ui/**       | ❌   | ❌        | ✅  | ✅   | ❌      |
| **lib/**      | ❌   | ❌        | ✅  | ✅   | ✅      |
| **stores/**   | ❌   | ❌        | ❌  | ✅   | ✅      |

\*Features cannot import from other features.

---

## Server vs Client Components

### Server Component (Default)

```tsx
// app/(protected)/users/page.tsx
// NO 'use client' here! This is a Server Component.
import { UserTableWrapper } from '@/components/features/users/components/user-table-wrapper';

export default async function UsersPage({ searchParams }: { searchParams: { search?: string } }) {
  const search = searchParams.search || '';

  return (
    <div>
      <PageHeader title="Users" />
      <UserTableWrapper initialSearch={search} />
    </div>
  );
}
```

### Client Component (Use sparingly)

```tsx
// components/features/users/components/user-search.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export function UserSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('search', term);
    else params.delete('search');
    router.push(`?${params.toString()}`);
  };
  // ...
}
```

### When to Use 'use client'

| Use Case                    | Requires 'use client' |
| --------------------------- | --------------------- |
| Event handlers (onClick)    | ✅ Yes                |
| Browser APIs (localStorage) | ✅ Yes                |
| React hooks (useState)      | ✅ Yes                |
| Data fetching (Server)      | ❌ No                 |
| Static content              | ❌ No                 |

---

## Hard Rules

| Rule                    | Details                                 |
| ----------------------- | --------------------------------------- |
| RSC First               | Default to Server Components            |
| Push 'use client' down  | Keep client boundary as low as possible |
| Feature isolation       | No cross-feature imports                |
| UI components stay dumb | No domain logic in components/ui/       |
| URL for view state      | Search, filters, pagination in URL      |
| No `any` type           | Use explicit types always               |
| Validate API boundaries | Use Zod for all external data           |

---

## What NOT to Do

| Don't                               | Why                                |
| ----------------------------------- | ---------------------------------- |
| Make entire page a Client Component | Only the interactive parts need it |
| Import feature A from feature B     | Move shared logic to lib/          |
| Use useState for search/filters     | Use URL state (useSearchParams)    |
| Store API data in Zustand           | Use TanStack Query                 |
| Use `any` type                      | TypeScript is our safety net       |
