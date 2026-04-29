---
name: ui-designer-patterns
description: 'UI Designer patterns. Component architecture, shadcn/ui patterns, and states handling. Use when building React components.'
---

## Component Architecture Rules

### Structure

```
components/
├── ui/           # shadcn/ui primitives
├── forms/        # Form components
├── layout/       # Layout components
└── features/     # Feature-specific
```

### Component Principles

| Principle             | Rule                        |
| --------------------- | --------------------------- |
| Single responsibility | One job per component       |
| Composition           | Build from small components |
| Props                 | Use TypeScript interface    |
| Variants              | Use CVA for variants        |
| Accessibility         | ARIA attributes required    |

### Component Interface Pattern

```tsx
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}
```

### CVA Variants Pattern

Use `class-variance-authority` (CVA) for variants:

| Pattern  | Use When                |
| -------- | ----------------------- |
| Variants | Multiple visual styles  |
| Sizes    | Multiple size options   |
| States   | Loading, disabled, etc. |

### Composition Rules

| Pattern             | Rule                             |
| ------------------- | -------------------------------- |
| Compound components | Related components work together |
| Render props        | Flexible rendering logic         |
| Children            | Prefer composition over props    |

### TypeScript Rules

| Rule           | Detail                  |
| -------------- | ----------------------- |
| Strict props   | Interface for all props |
| Optional props | Use `?` with defaults   |
| Children       | `React.ReactNode` type  |
| Event handlers | Proper event types      |

---

## shadcn/ui Rules

### Installation

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Customization Rules

| Rule                 | Detail                                 |
| -------------------- | -------------------------------------- |
| Extend, don't modify | Keep shadcn base, extend in components |
| Theme variables      | Use CSS variables for colors           |
| Variants             | Add via CVA                            |
| Composition          | Wrap shadcn with feature components    |

### Common Patterns

| Component | Pattern                               |
| --------- | ------------------------------------- |
| Button    | Use variants, not multiple components |
| Dialog    | Compound component pattern            |
| Form      | react-hook-form integration           |
| Table     | TanStack Table integration            |
| Select    | Radix-based, not native               |

### Theming Variables

| Variable        | Purpose                   |
| --------------- | ------------------------- |
| `--background`  | Page background           |
| `--foreground`  | Text color                |
| `--primary`     | Primary action color      |
| `--secondary`   | Secondary elements        |
| `--destructive` | Error/destructive actions |
| `--muted`       | Muted/subdued elements    |
| `--accent`      | Accent/highlight color    |

---

## Component States Rules

### Required States

Every interactive component must handle:

| State    | Purpose              |
| -------- | -------------------- |
| Default  | Normal appearance    |
| Hover    | Mouse over feedback  |
| Focus    | Keyboard navigation  |
| Active   | Click/press feedback |
| Disabled | Not interactive      |
| Loading  | Async operation      |
| Error    | Validation failure   |

### State Priority

| Priority | State                    |
| -------- | ------------------------ |
| 1        | Disabled (overrides all) |
| 2        | Loading                  |
| 3        | Error                    |
| 4        | Focus                    |
| 5        | Hover                    |
| 6        | Default                  |

### Loading State Rules

| Rule                | Detail                  |
| ------------------- | ----------------------- |
| Show spinner        | Use skeleton or spinner |
| Disable interaction | Prevent double-submit   |
| Keep layout         | No layout shift         |
| Progress indicator  | For long operations     |

### Error State Rules

| Rule              | Detail                     |
| ----------------- | -------------------------- |
| Clear message     | Explain what went wrong    |
| Recovery path     | Tell user what to do       |
| Inline validation | Show errors at field level |
| Color + icon      | Don't rely on color alone  |

### Empty State Rules

| Element     | Required         |
| ----------- | ---------------- |
| Icon        | Visual indicator |
| Title       | Clear message    |
| Description | Helpful context  |
| CTA         | Action to take   |

### Disabled State Rules

| Rule             | Detail                          |
| ---------------- | ------------------------------- |
| Visual indicator | Reduced opacity or muted        |
| Cursor           | `cursor-not-allowed`            |
| No interaction   | Remove event handlers           |
| Tooltip          | Explain why disabled (optional) |
