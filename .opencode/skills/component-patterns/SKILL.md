---
name: component-patterns
description: 'UI components, forms, feature components. Use when creating or modifying components.'
---

## Server vs Client Components

### Server Component (Default)

- No `'use client'` directive
- No `useState`, `useEffect`, event handlers
- Can fetch data directly
- Preferred for static content and data fetching

### Client Component (Use sparingly)

- Add `'use client'` at top of file
- Required for: interactivity, browser APIs, hooks
- Push down the tree (don't make whole page client)

---

## Component Types

| Type    | Location               | Purpose                   | 'use client' |
| ------- | ---------------------- | ------------------------- | ------------ |
| UI      | `components/ui/`       | Dumb, reusable, no domain | Varies       |
| Feature | `components/features/` | Domain-specific, smart    | Usually yes  |
| Layout  | `components/layout/`   | Page structure            | Varies       |
| Page    | `app/`                 | Route segments            | Rarely       |

---

## Component Rendering & RSC Optimization

### Anti-Pattern: Client Page

```tsx
// ❌ DON'T: Client Page
// app/(protected)/users/page.tsx
'use client'; // BAD: Makes the whole page a client component
import { useState } from 'react';
import { UserTable } from '@/components/features/users/components';

export default function UsersPage() {
  const [search, setSearch] = useState(''); // BAD: Should be URL state
  return (
    <div>
      <input onChange={(e) => setSearch(e.target.value)} />
      <UserTable search={search} />
    </div>
  );
}
```

### Correct: Server Page + Client Islands

```tsx
// ✅ DO: Server Page + Client Islands
// app/(protected)/users/page.tsx
// NO 'use client' here! This is a Server Component.
import { UserTableWrapper } from '@/components/features/users/components/user-table-wrapper';
import { PageHeader } from '@/components/layout/dashboard/page-header';

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

---

## Forms & Validation

### Library Stack

- **Form Library:** React Hook Form
- **Validation:** Zod with `@hookform/resolvers/zod`
- **UI Components:** shadcn/ui `<Form>` wrappers

### Schema Definition

Define Zod schemas in the feature's `api/types.ts` or a dedicated `schema.ts`:

```typescript
// src/components/features/users/api/types.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  roleId: z.string().min(1, 'Role is required'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
```

### Form Component Pattern

```tsx
// src/components/features/users/components/user-form.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { createUserSchema, CreateUserDTO } from '../api/types';
import { useCreateUser } from '../hooks/use-user-mutation';

export function UserForm() {
  const form = useForm<CreateUserDTO>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', roleId: '' },
  });

  const mutation = useCreateUser();

  const onSubmit = (data: CreateUserDTO) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Error Mapping (Backend Validation to Form)

When a form submission fails due to backend validation (HTTP 422), map errors back to form fields:

```tsx
import { isAxiosError } from 'axios';

const onSubmit = (data: CreateUserDTO) => {
  mutation.mutate(data, {
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        Object.entries(backendErrors).forEach(([field, messages]) => {
          form.setError(field as keyof CreateUserDTO, {
            type: 'server',
            message: (messages as string[])[0],
          });
        });
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });
};
```

---

## Loading States

### Mutation Loading (Button State)

```tsx
<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
  Save Changes
</Button>
```

### Query Loading (Skeleton)

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export function UserTable() {
  const { data, isPending } = useUsers();

  if (isPending) {
    return (
      <div className="space-y-2" data-testid="skeleton-loader">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  // render table...
}
```

---

## Authorization (CASL)

### Protecting Routes/Pages

```tsx
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function AdminPage() {
  return (
    <PermissionGuard permissions={[{ action: 'manage', subject: 'all' }]}>
      <AdminDashboard />
    </PermissionGuard>
  );
}
```

### Protecting UI Elements

```tsx
import { Can } from '@/components/auth/can';

export function UserActions({ user }) {
  return (
    <div>
      <Can I="update" a="User">
        <Button>Edit</Button>
      </Can>
      <Can I="delete" a="User">
        <Button variant="destructive">Delete</Button>
      </Can>
    </div>
  );
}
```

---

## Styling (Tailwind CSS v4)

### Utility Classes

Use Tailwind CSS for all styling. Do not use inline `style={{}}` unless dynamically calculating values.

### Merging Classes

Always use the `cn()` utility when combining conditional classes:

```tsx
import { cn } from '@/lib/utils';

export function Badge({ className, variant, ...props }) {
  return (
    <div
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5', className)}
      {...props}
    />
  );
}
```

---

## Hard Rules

| Rule                            | Details                                    |
| ------------------------------- | ------------------------------------------ |
| Server Components first         | Default to RSC, use 'use client' sparingly |
| Push 'use client' down          | Keep client boundary as low as possible    |
| Forms use react-hook-form + zod | No @tanstack/react-form                    |
| Loading states on mutations     | Disable buttons, show spinner              |
| Skeleton for query loading      | Don't show empty/undefined data            |
| CASL for authorization          | Never check roles manually                 |
| cn() for class merging          | Safe Tailwind class combination            |
| shadcn/ui Form wrappers         | For accessibility and error styling        |
