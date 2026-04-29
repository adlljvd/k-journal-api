---
name: ux-coder-visual-sanity
description: 'Visual decision verification. Ensure choices support UX purpose.'
---

## Visual Decision Verification

### Core Principle

**You determine visual treatment, then verify it supports the UX purpose.**

### Visual Weight Distribution

When implementing each screen, ensure your visual choices support the hierarchy:

| Hierarchy     | Your Visual Decision                 | Verification                         |
| ------------- | ------------------------------------ | ------------------------------------ |
| **PRIMARY**   | Largest, boldest, prominent position | Would user notice this first?        |
| **SECONDARY** | Normal weight, supporting position   | Does it help without competing?      |
| **TERTIARY**  | Smallest, muted, lower position      | Is it available but not distracting? |

### Visual Decision Process

```
1. Read PURPOSE from dispatch
   "What does this screen achieve?"
        ↓
2. Read HIERARCHY from dispatch
   "Which fields are PRIMARY/SECONDARY/TERTIARY?"
        ↓
3. DETERMINE visual treatment
   "How do I make PRIMARY prominent?"
   - Color choice (bg-blue-600? text-red-500?)
   - Size choice (text-xl? text-2xl?)
   - Position choice (top-left? center?)
   - Spacing choice (more whitespace around it?)
        ↓
4. VERIFY your choice supports purpose
   "Does this help user achieve their goal?"
        ↓
5. IMPLEMENT
```

### Visual Weight Self-Check

After implementing, verify your choices:

| Check                 | Question                                | Self-Correction                     |
| --------------------- | --------------------------------------- | ----------------------------------- |
| **One PRIMARY**       | Is there ONE visually dominant element? | If multiple, differentiate or group |
| **Action prominence** | Is primary action the most prominent?   | Increase size/color if needed       |
| **Weight match**      | Does visual weight match hierarchy?     | Adjust sizes accordingly            |
| **Scanning path**     | Does eye naturally go to PRIMARY first? | Reposition if needed                |

### Visual Decision Guidelines

**For PRIMARY fields:**

```markdown
PURPOSE: "Sales rep quickly identifies leads"
PRIMARY: Lead Score

Your decisions:

- Color: Badge with color-coding (red=hot, yellow=warm, gray=cold)
  WHY: Instant recognition without reading
- Size: text-lg font-semibold
  WHY: Stands out from other fields
- Position: Left column, first data field
  WHY: Natural scanning path
```

**For SECONDARY fields:**

```markdown
SECONDARY: Customer Name, Status

Your decisions:

- Color: Default text color
  WHY: Visible but not competing
- Size: text-base font-normal
  WHY: Readable but not emphasized
- Position: After PRIMARY, natural flow
  WHY: Supports decision context
```

**For TERTIARY fields:**

```markdown
TERTIARY: Created Date, Internal Notes

Your decisions:

- Color: text-gray-500
  WHY: Available but not calling attention
- Size: text-sm
  WHY: Smaller, reference-only
- Position: Right side, below fold
  WHY: Out of main flow
```

### Common Visual Decisions

| Situation               | Your Decision                        |
| ----------------------- | ------------------------------------ |
| PRIMARY is a number     | Large, bold, possibly colored badge  |
| PRIMARY is a name       | text-lg, prominent position          |
| PRIMARY is an action    | Colored button, prominent position   |
| PRIMARY is status       | Color-coded badge or chip            |
| SECONDARY needs context | Normal size, possibly with label     |
| TERTIARY is timestamp   | text-sm text-gray-500, right-aligned |

### Visual Balance Check

| Aspect                 | Check                               | Adjust If Needed        |
| ---------------------- | ----------------------------------- | ----------------------- |
| **Left-right balance** | Is layout visually balanced?        | Adjust column widths    |
| **Density**            | Is information density appropriate? | Add/remove spacing      |
| **Grouping**           | Are related elements grouped?       | Use borders/backgrounds |
| **Spacing**            | Is there adequate whitespace?       | Add padding/margin      |

### Self-Verification Report

Include in your return:

```markdown
VISUAL DECISIONS:
───────────────────────────────────────────────────────────────────────────
Screen S-01: Lead Queue

PURPOSE: Sales rep quickly identifies which leads to prioritize

HIERARCHY IMPLEMENTED:

- PRIMARY (Lead Score): Badge, color-coded
  WHY: Instant visual identification for quick triage
- SECONDARY (Customer Name, Status): Normal weight, left-aligned
  WHY: Supports identification without competing for attention
- TERTIARY (Created Date, Rep): text-sm text-gray-500, right-aligned
  WHY: Available for reference, not in main decision flow

LAYOUT: Table with row highlighting
WHY: Familiar pattern for data review, efficient scanning

COLORS: Blue actions, gray neutrals, status-coded badges
WHY: Professional context, color for quick categorization
───────────────────────────────────────────────────────────────────────────
```

### When Your Choice Might Be Wrong

| Signal                         | What It Means               | Action                       |
| ------------------------------ | --------------------------- | ---------------------------- |
| PRIMARY doesn't feel prominent | Your treatment is too weak  | Increase size/color/position |
| Screen feels cluttered         | Too much visual competition | Simplify, add whitespace     |
| Eye goes to wrong element      | Hierarchy not clear         | Reassess visual weight       |
| User would miss this           | Affordance unclear          | Add emphasis or affordance   |

### 2-Second Glance Test (Self-Check)

After building, step back and ask:

**"If I look at this screen for 2 seconds, what do I notice first?"**

- If answer matches PRIMARY field: ✓ Your choices are correct
- If answer is something else: ⚠️ Reassess your visual decisions

### Summary Table

| Your Role       | What You Do                                     |
| --------------- | ----------------------------------------------- |
| Decide          | Choose colors, sizes, spacing, layout           |
| Implement       | Build based on your decisions                   |
| Verify          | Check that visual supports purpose              |
| Explain         | Document WHY you made each choice               |
| Accept feedback | If designer says "not prominent enough", adjust |
