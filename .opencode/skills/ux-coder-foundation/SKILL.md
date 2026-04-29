---
name: ux-coder-foundation
description: 'Foundation rules. Workflow, file structure, tokens. Load first.'
license: MIT
compatibility: opencode
metadata:
  audience: ux-coder
  category: foundation
  priority: 1
  layer: 1
---

## What I Do

Foundation knowledge for creating wireframes. Load me FIRST, before other skills.

### 1. File Structure

```
docs/requirements/FEATURE-XXX-feature-name/wireframes/
├── index.html              # Overview hub (required)
├── _shared.css            # Design tokens (required)
├── 01-module-name.html   # Module files
└── 02-module-name.html
```

**Rules:**

- Index.html MUST include: screen map, cross-file nav, user flows, legend
- Module files MUST include: navbar, screens with states+annotations
- Copy from: `docs/wireframe-template/`

### 2. Naming Conventions

**Files:** `XX-module-name.html` (kebab-case, 2-digit prefix)
**Screens:** `S-XX` (sequential)
**Variants:** `S-XXb` (for alternative flows)

### 3. Design Tokens

```css
bg-wire-bg: #f8fafc          # Page background
bg-wire-surface: #ffffff     # Cards/surfaces
border-wire-border: #e2e8f0   # Default borders
text-wire-muted: #64748b      # Secondary text
text-wire-text: #0f172a        # Primary text
```

**Semantic Colors:**

- Success: `green-50/100/200/600/800`
- Error: `red-50/100/200/300/500/600/800`
- Warning: `yellow-50/100/200/600/800`
- Info/Primary: `blue-50/100/200/300/400/500/600/800/900`

**Badge Classes:**

- `badge-neutral` - General info (#f1f5f9)
- `badge-success` - Active/Completed (#dcfce7)
- `badge-warning` - Pending/Caution (#fef3c7)
- `badge-danger` - Inactive/Error (#fee2e2)
- `badge-info` - PCO Role (#e0f2fe)
- `badge-purple` - Nurse Role (#f3e8ff)
- `badge-teal` - Admin Role (#ccfbf1)

### 4. Spacing Scale

```css
1: 4px   (tight)
2: 8px   (small)
3: 12px  (compact)
4: 16px  (default)
6: 24px  (loose)
8: 32px  (large)
10: 40px  (component)
12: 48px  (margin)
16: 64px  (major)
```

### 5. Field Importance

**PRIMARY (required/critical):** Use `field-primary` wrapper

- Blue border (`border-blue-500`)
- Blue bg (`bg-blue-50`)
- Larger label (`text-sm font-bold`)

**SECONDARY/TERTIARY:** No wrapper, standard styling

### 6. Critical Rules

1. **ALWAYS** copy exact error/empty messages from PRD - never paraphrase
2. **NEVER** skip navbar on any page
3. **ALWAYS** use relative paths for cross-file navigation
4. **NEVER** use arbitrary hex codes - use Tailwind colors
5. **ALWAYS** include `id` attributes for form inputs
6. **NEVER** skip any state or annotation - all 5 states + 4 annotations required

### 7. References

**Template Files (PERTAHANKAN - Copy-paste source):**

- `docs/wireframe-template/index.html` - Overview hub template
- `docs/wireframe-template/module-template.html` - Module template with all screens
- `docs/wireframe-template/_shared.css` - Design tokens (copy to project)
- `docs/wireframe-template/components.html` - Component library reference
- `docs/wireframe-template/README.md` - Quick reference guide

**Quality Checklist:**

- `docs/wireframe-template/guide-best-practices.md` - Complete checklist for quality assurance

## When to Use Me

Load me FIRST when starting wireframe project. I provide foundation knowledge.

## Next Skills

After loading me, load:

- `ux-coder-screen` - To build complete screen structure
- `ux-coder-components-v2` - To add specific UI components
