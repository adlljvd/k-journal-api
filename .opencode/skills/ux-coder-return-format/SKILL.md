---
name: ux-coder-return-format
description: 'Return format for completed waves to @ux-designer.'
---

## Return Format

After completing a wave, return this to @ux-designer:

```markdown
=== WAVE [n] COMPLETE → @ux-designer ===
═══════════════════════════════════════════════════════════════════════════
FILES:

- wireframes/[filename].html (CREATED | APPENDED)
  [Lines: n total]
  ═══════════════════════════════════════════════════════════════════════════

COMPLETENESS CHECK:
| Screen | Purpose | Hierarchy | States | Status |
|--------|---------|-----------|--------|--------|
| S-01 | ✓ Clear | ✓ Domain reasoning | ✓ 4/4 | PASS |
| S-02 | ✓ Clear | ✓ Domain reasoning | ✓ 4/4 | PASS |

VISUAL DECISIONS:
───────────────────────────────────────────────────────────────────────────
Screen S-01: [Screen Name]

PURPOSE: [From dispatch]
HIERARCHY IMPLEMENTED:

- PRIMARY [field]: [Visual treatment chosen + WHY]
- SECONDARY [fields]: [Visual treatment chosen + WHY]
- TERTIARY [fields]: [Visual treatment chosen + WHY]

LAYOUT: [What layout used + WHY it supports purpose]
COLORS: [Color scheme + WHY appropriate for context]
INTERACTIONS: [Hover/focus states + WHY they provide feedback]
───────────────────────────────────────────────────────────────────────────

HIERARCHY VERIFICATION:
| Screen | PRIMARY Field | Visual Treatment | Matches Purpose? |
|--------|---------------|------------------|------------------|
| S-01 | Customer Name | text-xl font-bold, top-left | ✓ Decision-driving, prominent |
| S-02 | Lead Score | Badge with color coding | ✓ Quick identification |

SCREENS IMPLEMENTED:
| Screen | States | UX Note | Behaviors | Navigation |
|--------|--------|---------|-----------|------------|
| S-01 | ✓ 4/4 | ✓ exact | ✓ all | ✓ linked |
| S-02 | ✓ 4/4 | ✓ exact | ✓ all | ✓ linked |

CROSS-FILE LINKS:
| From | Action | Target File | Status |
|------|--------|-------------|--------|
| S-03 | Check In | 02-visits.html#s05 | ✓ |

ANYTHING NOT IMPLEMENTED:
[none | list specific issues]

QUESTIONS FOR @ux-designer:
[none | list clarifications needed]
═══════════════════════════════════════════════════════════════════════════
```

---

## Key Sections

### VISUAL DECISIONS (NEW - Most Important)

**This section explains WHY you made visual choices.**

For each screen, document:

| Element                 | What to Document                                  |
| ----------------------- | ------------------------------------------------- |
| **PRIMARY treatment**   | Visual choice + WHY it emphasizes importance      |
| **SECONDARY treatment** | Visual choice + WHY it supports without competing |
| **TERTIARY treatment**  | Visual choice + WHY it stays accessible but muted |
| **Layout**              | Structure + WHY it supports the screen purpose    |
| **Colors**              | Scheme + WHY appropriate for domain/context       |
| **Interactions**        | States + WHY they provide clear feedback          |

**Example:**

```markdown
VISUAL DECISIONS:
───────────────────────────────────────────────────────────────────────────
Screen S-01: Lead Queue

PURPOSE: Sales rep quickly identifies which leads to prioritize

HIERARCHY IMPLEMENTED:

- PRIMARY (Lead Score): Badge with color coding (red=hot, warm=yellow, cold=gray)
  WHY: Instant visual identification without reading numbers
- SECONDARY (Customer Name, Status): Normal weight, left-aligned
  WHY: Quick scanning, supports decision but doesn't dominate
- TERTIARY (Created Date, Assigned Rep): text-sm text-gray-500, right-aligned
  WHY: Available for reference but not competing for attention

LAYOUT: Table with row-hover highlight
WHY: Familiar pattern for data review, supports bulk scanning

COLORS: Blue primary actions, gray neutrals, status colors for score
WHY: Professional sales context, color coding for quick triage

INTERACTIONS: Row click selects, button hover darkens
WHY: Clear affordances, immediate feedback
───────────────────────────────────────────────────────────────────────────
```

---

## HIERARCHY VERIFICATION Section

**Confirm that your visual treatment matches the hierarchy from dispatch.**

| Column           | What to Show                               |
| ---------------- | ------------------------------------------ |
| Screen           | Screen ID                                  |
| PRIMARY Field    | The field marked PRIMARY in dispatch       |
| Visual Treatment | How you made it prominent                  |
| Matches Purpose? | Does treatment support the screen purpose? |

**Example with issue:**

```markdown
HIERARCHY VERIFICATION:
| Screen | PRIMARY Field | Visual Treatment | Matches Purpose? |
|--------|---------------|------------------|------------------|
| S-01 | Lead Score | Badge, color-coded | ✓ Quick identification |
| S-02 | Created Date | text-xl font-bold | ⚠️ May not be decision-driving - please confirm |
```

---

## COMPLETENESS CHECK Section

**Verify all required information was present in dispatch.**

| Column    | What to Check                                          |
| --------- | ------------------------------------------------------ |
| Screen    | Screen ID                                              |
| Purpose   | Was PURPOSE statement present and clear?               |
| Hierarchy | Was HIERARCHY_REASONING present with domain reasoning? |
| States    | Were all 4 states documented with specific text?       |
| Status    | PASS if all present, FLAG if missing                   |

**Example with issues:**

```markdown
COMPLETENESS CHECK:
| Screen | Purpose | Hierarchy | States | Status |
|--------|---------|-----------|--------|--------|
| S-01 | ✓ Clear | ✓ Domain reasoning | ✓ 4/4 | PASS |
| S-02 | ⚠️ Vague | ✓ Domain reasoning | ❌ Missing EMPTY | FLAG |
```

---

## When to Flag Issues

### In COMPLETENESS CHECK

| Missing Info           | Flag                                     |
| ---------------------- | ---------------------------------------- |
| No PURPOSE             | "Missing purpose statement"              |
| Vague PURPOSE          | "Purpose unclear - needs specificity"    |
| No HIERARCHY_REASONING | "Missing hierarchy reasoning"            |
| Generic hierarchy      | "Generic reasoning, not domain-specific" |
| Missing state          | "Missing [state] state"                  |
| Generic message        | "Generic message for [state] state"      |

### In HIERARCHY VERIFICATION

| Issue                                 | Flag                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------- |
| PRIMARY doesn't seem decision-driving | "PRIMARY [field] may not support purpose - please confirm"              |
| Unsure about emphasis                 | "Unsure if [treatment] is appropriate for [context] - feedback welcome" |

---

## INCOMPLETE DISPATCH Report

If dispatch is missing required information:

```markdown
=== DISPATCH INCOMPLETE → @ux-designer ===
═══════════════════════════════════════════════════════════════════════════
WAVE: [n] - CANNOT PROCEED

MISSING INFORMATION:

┌─ SCREEN: [S-XX] ────────────────────────────────────────────────────────┐
│ ❌ PURPOSE: No purpose statement provided │
│ ❌ HIERARCHY: No domain reasoning provided │
│ ❌ STATE: Empty state has generic message "No data" │
└────────────────────────────────────────────────────────────────────────┘

REQUIRED BEFORE BUILDING:

1. Please provide purpose statement
2. Please provide domain reasoning for PRIMARY field
3. Please provide specific empty state message

═══════════════════════════════════════════════════════════════════════════
```

---

## Questions Format

When you need clarification:

```markdown
QUESTIONS FOR @ux-designer:

1. [Screen S-02] Is Created Date really the PRIMARY field? It seems more
   like TERTIARY reference info for this sales workflow.
2. [Screen S-03] The dispatch mentions "quick action" - should this be a
   floating action button or inline with each row?
```

---

## Summary

| Section                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| COMPLETENESS CHECK     | Verify dispatch had required info           |
| **VISUAL DECISIONS**   | **Explain WHY you chose visual treatments** |
| HIERARCHY VERIFICATION | Confirm visual matches hierarchy intent     |
| SCREENS IMPLEMENTED    | What was built                              |
| QUESTIONS              | What needs clarification                    |

**Remember: You make visual decisions, but explain your reasoning.**
