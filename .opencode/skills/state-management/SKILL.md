---
name: state-management
description: 'State management matrix and patterns. Use when deciding where to store state.'
---

## State Management Matrix

You must choose the correct state management tool based on the data's lifecycle:

| State Type        | Tool                            | Use Case                                 | Rule                                                                                                 |
| :---------------- | :------------------------------ | :--------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **URL State**     | `useSearchParams` / `useRouter` | Search, Filters, Pagination, Active Tabs | **MANDATORY** for any state that changes the view of data. Enables deep-linking.                     |
| **Server State**  | TanStack React Query v5         | API Data, Caching, Loading States        | **MANDATORY** for all asynchronous backend data. Never store API responses in Zustand or `useState`. |
| **Global Client** | Zustand v5                      | Auth Session, Theme, Global UI Toggles   | Keep minimal. Do not use for domain data.                                                            |
| **Local Client**  | `useState` / `useReducer`       | Dropdown open state, temporary input     | Use only for ephemeral UI state.                                                                     |
| **Form State**    | React Hook Form + Zod           | Complex forms, validation                | Use for all data entry.                                                                              |

---

## URL State (MANDATORY for View State)

URL state enables deep-linking and shareable URLs. Use for any state that changes the view of data.

### Example: Search with URL State

```tsx
// src/components/features/users/components/user-search.tsx
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

  return (
    <input
      defaultValue={searchParams.get('search') || ''}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search users..."
    />
  );
}
```

### When to Use URL State

| Use Case       | Example                     |
| -------------- | --------------------------- |
| Search queries | `?search=john`              |
| Filters        | `?status=active&role=admin` |
| Pagination     | `?page=2&limit=20`          |
| Active tabs    | `?tab=settings`             |
| Sort order     | `?sortBy=name&order=asc`    |

---

## Server State (TanStack React Query v5)

All API interactions must go through the configured Axios instance and be wrapped in custom TanStack Query hooks.

### Query Key Factories

Every feature MUST have a `keys.ts` file for strongly typed, consistent query keys:

```typescript
// src/components/features/users/api/keys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

### Custom Hooks

Never use `useQuery` or `useMutation` directly in a UI component. Always create a custom hook:

```typescript
// src/components/features/users/hooks/use-users.ts
import { useQuery } from '@tanstack/react-query';
import { userKeys } from '../api/keys';
import { getUsers } from '../api/user-api';

export function useUsers(search?: string) {
  return useQuery({
    queryKey: userKeys.list(search || ''),
    queryFn: () => getUsers(search),
  });
}
```

### Mutation & Invalidation

Mutations MUST invalidate relevant queries on success:

```typescript
// src/components/features/users/hooks/use-user-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../api/keys';
import { createUser } from '../api/user-api';
import { toast } from 'sonner';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      toast.error('Failed to create user');
    },
  });
}
```

---

## Global Client State (Zustand v5)

Keep Zustand stores minimal. Use only for auth session, theme, and global UI toggles.

### When to Use Zustand

| Use Case      | Example                           |
| ------------- | --------------------------------- |
| Auth session  | User object, tokens, permissions  |
| Theme         | Dark/light mode toggle            |
| Sidebar state | Open/collapsed                    |
| Global modals | Notification drawer, search modal |

### When NOT to Use Zustand

| Don't Use For  | Use Instead                   |
| -------------- | ----------------------------- |
| API data       | TanStack Query                |
| Form state     | React Hook Form               |
| Search/filters | URL state                     |
| Feature data   | Local state or TanStack Query |

---

## Local Client State (`useState`)

Use `useState` / `useReducer` only for ephemeral UI state within a single component.

### When to Use Local State

| Use Case            | Example                 |
| ------------------- | ----------------------- |
| Dropdown open state | `const [open, setOpen]` |
| Temporary input     | Draft before submit     |
| Modal visibility    | `const [show, setShow]` |
| Accordion state     | Expanded/collapsed      |

### When NOT to Use Local State

| Don't Use For      | Use Instead     |
| ------------------ | --------------- |
| Search query       | URL state       |
| API data           | TanStack Query  |
| Global preferences | Zustand         |
| Form data          | React Hook Form |

---

## Form State (React Hook Form + Zod)

Use for all data entry. See `component-patterns` skill for detailed implementation.

### Stack

- React Hook Form for form state management
- Zod for validation schema
- `@hookform/resolvers/zod` for integration

---

## Hard Rules

| Rule                               | Details                                       |
| ---------------------------------- | --------------------------------------------- |
| URL state for view changes         | Search, filters, pagination in URL            |
| TanStack Query for API data        | NEVER store API responses in Zustand/useState |
| Zustand for minimal global state   | Auth, theme, UI toggles only                  |
| Local state for ephemeral UI       | Dropdowns, modals within one component        |
| Forms use react-hook-form + zod    | No @tanstack/react-form                       |
| Custom hooks for queries/mutations | Never use useQuery/useMutation in UI          |
| Query key factories required       | Every feature needs keys.ts                   |
| Invalidate on mutation success     | Keep UI consistent                            |

---

## State Decision Flowchart

```
Is it from an API?
├── Yes → TanStack Query
└── No → Does it affect the URL/view?
         ├── Yes → URL state (useSearchParams)
         └── No → Is it needed across components?
                  ├── Yes → Zustand
                  └── No → Is it form data?
                           ├── Yes → React Hook Form
                           └── No → useState
```
