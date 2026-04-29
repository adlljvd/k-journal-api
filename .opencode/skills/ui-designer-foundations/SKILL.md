---
name: ui-designer-foundations
description: 'UI Designer foundations. Design tokens, Tailwind patterns, theme system, and accessibility. Use when defining visual language and ensuring WCAG compliance.'
---

## Design Tokens Rules

### Token Categories

| Category   | Tokens                                     |
| ---------- | ------------------------------------------ |
| Colors     | primary, secondary, background, foreground |
| Typography | fontFamily, fontSize, fontWeight           |
| Spacing    | 0-96, px, py, margin, padding              |
| Shadows    | sm, md, lg, xl                             |
| Radius     | sm, md, lg, full                           |
| Motion     | duration, easing                           |

### Color Tokens

| Token       | CSS Variable    | Use                |
| ----------- | --------------- | ------------------ |
| background  | `--background`  | Page background    |
| foreground  | `--foreground`  | Primary text       |
| primary     | `--primary`     | Primary actions    |
| secondary   | `--secondary`   | Secondary elements |
| destructive | `--destructive` | Errors, delete     |
| muted       | `--muted`       | Subdued elements   |
| accent      | `--accent`      | Highlights         |
| border      | `--border`      | Borders            |

### Typography Tokens

| Token       | Value        | Use            |
| ----------- | ------------ | -------------- |
| `font-sans` | System fonts | Body text      |
| `text-xs`   | 0.75rem      | Labels, badges |
| `text-sm`   | 0.875rem     | Secondary text |
| `text-base` | 1rem         | Body text      |
| `text-lg`   | 1.125rem     | Emphasis       |
| `text-xl`   | 1.25rem      | Headings       |
| `text-2xl`  | 1.5rem       | Page titles    |

### Spacing Scale

| Token | Value          |
| ----- | -------------- |
| `0`   | 0              |
| `1`   | 0.25rem (4px)  |
| `2`   | 0.5rem (8px)   |
| `3`   | 0.75rem (12px) |
| `4`   | 1rem (16px)    |
| `6`   | 1.5rem (24px)  |
| `8`   | 2rem (32px)    |

### Radius Tokens

| Token          | Value    | Use            |
| -------------- | -------- | -------------- |
| `rounded-sm`   | 0.125rem | Subtle corners |
| `rounded`      | 0.25rem  | Default        |
| `rounded-md`   | 0.375rem | Cards          |
| `rounded-lg`   | 0.5rem   | Modals         |
| `rounded-full` | 9999px   | Pills, avatars |

---

## Tailwind CSS Rules

### Utility Classes

| Rule           | Detail                                     |
| -------------- | ------------------------------------------ |
| Mobile-first   | Base = mobile, `md:` = tablet+             |
| Responsive     | Use breakpoints: `sm`, `md`, `lg`, `xl`    |
| State variants | `hover:`, `focus:`, `active:`, `disabled:` |
| Dark mode      | `dark:` prefix                             |

### Common Patterns

| Pattern     | Classes                                                          |
| ----------- | ---------------------------------------------------------------- |
| Flex center | `flex items-center justify-center`                               |
| Grid gap    | `grid gap-4`                                                     |
| Container   | `container mx-auto px-4`                                         |
| Card        | `rounded-lg border bg-card p-4 shadow`                           |
| Button base | `inline-flex items-center justify-center rounded-md font-medium` |

### Responsive Breakpoints

| Breakpoint | Min width |
| ---------- | --------- |
| `sm:`      | 640px     |
| `md:`      | 768px     |
| `lg:`      | 1024px    |
| `xl:`      | 1280px    |
| `2xl:`     | 1536px    |

### State Variants

| State         | Prefix           |
| ------------- | ---------------- |
| Hover         | `hover:`         |
| Focus         | `focus:`         |
| Focus visible | `focus-visible:` |
| Active        | `active:`        |
| Disabled      | `disabled:`      |
| Dark mode     | `dark:`          |

### Color System

| Token                     | Use             |
| ------------------------- | --------------- |
| `text-foreground`         | Primary text    |
| `text-muted-foreground`   | Secondary text  |
| `bg-background`           | Page background |
| `bg-card`                 | Card background |
| `bg-primary`              | Primary action  |
| `text-primary-foreground` | Text on primary |
| `border-border`           | Default border  |

---

## Theme System Rules

### Theme Modes

| Mode   | Trigger                            |
| ------ | ---------------------------------- |
| Light  | Default or system preference       |
| Dark   | `class="dark"` on `<html>`         |
| System | `prefers-color-scheme` media query |

### CSS Variables Approach

Define in `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

### Theme Toggle Pattern

| Step | Action                                  |
| ---- | --------------------------------------- |
| 1    | Check localStorage for saved preference |
| 2    | Fall back to system preference          |
| 3    | Add/remove `dark` class on `<html>`     |
| 4    | Save preference to localStorage         |

### Tailwind Dark Mode

| Config     | Value                |
| ---------- | -------------------- |
| `darkMode` | `'class'`            |
| Usage      | `dark:bg-background` |

---

## Accessibility Patterns

**Accessibility is not optional.** Every component must work for all users.

### WCAG AA Requirements

| Requirement    | Standard                                  |
| -------------- | ----------------------------------------- |
| Color contrast | 4.5:1 for text, 3:1 for large text        |
| Keyboard       | All functionality accessible via keyboard |
| Focus visible  | Clear focus indicator, never remove       |
| Screen reader  | Proper ARIA attributes                    |
| Motion         | Respect prefers-reduced-motion            |

### Keyboard Navigation Rules

| Pattern     | Rule                                    |
| ----------- | --------------------------------------- |
| Tab order   | Natural order preferred, avoid tabIndex |
| Enter/Space | Trigger buttons, links                  |
| Escape      | Close modals, dropdowns                 |
| Arrow keys  | Navigate lists, menus, tabs             |
| Home/End    | Jump to start/end of lists              |

### Screen Reader Support Rules

| Pattern      | ARIA Attribute                     |
| ------------ | ---------------------------------- |
| Labels       | `htmlFor` or `aria-label`          |
| Descriptions | `aria-describedby`                 |
| Errors       | `aria-invalid`, `aria-describedby` |
| Live updates | `aria-live="polite"`               |
| Status       | `role="status"`                    |

### Focus Management Rules

| Pattern      | Rule                                     |
| ------------ | ---------------------------------------- |
| Focus ring   | Never remove, use `focus-visible:`       |
| Focus trap   | Required for modals                      |
| Auto focus   | Focus first interactive element in modal |
| Return focus | Return focus to trigger on close         |

### ARIA Patterns Quick Reference

| Component  | Required ARIA                                                   |
| ---------- | --------------------------------------------------------------- |
| Button     | `aria-pressed` (toggle), `aria-expanded` (disclosure)           |
| Dialog     | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`         |
| Tabs       | `role="tablist/tab/tabpanel"`, `aria-selected`, `aria-controls` |
| Disclosure | `aria-expanded`, `aria-controls`                                |
| Listbox    | `role="listbox/option"`, `aria-selected`                        |

### Color Contrast Requirements

| Element                         | Ratio         |
| ------------------------------- | ------------- |
| Normal text                     | 4.5:1 minimum |
| Large text (18px+ or 14px bold) | 3:1 minimum   |
| UI components                   | 3:1 minimum   |

**Never rely on color alone** - always provide text or icon backup.

### Motion Preferences

| Preference                       | Handling                    |
| -------------------------------- | --------------------------- |
| `prefers-reduced-motion: reduce` | Disable/reduce animations   |
| Tailwind                         | Use `motion-reduce:` prefix |
| JavaScript                       | Check `window.matchMedia`   |

### Accessibility Checklist

| Check                | Question                                    |
| -------------------- | ------------------------------------------- |
| ☐ Keyboard           | Can all actions be performed with keyboard? |
| ☐ Tab order          | Is tab order logical?                       |
| ☐ Focus visible      | Is focus clearly visible?                   |
| ☐ Labels             | Are all inputs labeled?                     |
| ☐ ARIA               | Are ARIA attributes correct?                |
| ☐ Color contrast     | Does text meet 4.5:1 ratio?                 |
| ☐ Color independence | Is info conveyed without color alone?       |
| ☐ Motion             | Is motion reduced for preference?           |
| ☐ Screen reader      | Does it work with VoiceOver/NVDA?           |
| ☐ Zoom               | Does it work at 200% zoom?                  |
