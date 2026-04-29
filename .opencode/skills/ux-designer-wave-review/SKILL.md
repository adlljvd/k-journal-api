---
name: ux-designer-wave-review
description: 'Wave review protocol. Use when reviewing @ux-coder output.'
---

## Wave Review Protocol

When `@ux-coder` returns a wave, review for **UX alignment**, not pixel-perfect matching.

### Key Principle

**You review WHAT and WHY, not HOW.**

| You Review                       | Coder Determines               |
| -------------------------------- | ------------------------------ |
| Does hierarchy match UXSPEC?     | Exact colors, sizes, spacing   |
| Do behaviors work as specified?  | Visual treatment details       |
| Do states have correct messages? | Animation/transition specifics |
| Does purpose feel achieved?      | Component exact structure      |

---

### Review Format

```markdown
=== WAVE [n] REVIEW ===

FILE: wireframes/[filename].html

PURPOSE ALIGNMENT:
| Screen | Purpose | Visual treatment supports purpose? | Status |
|--------|---------|-----------------------------------|--------|
| S-01 | Quick lead identification | ✓ Color-coded badges, prominent names | ALIGNED |
| S-02 | Bulk action execution | ✓ Clear checkboxes, action bar | ALIGNED |

HIERARCHY ALIGNMENT:
| Screen | PRIMARY | Visually Prominent? | SECONDARY | Appropriately Muted? |
|--------|---------|--------------------|-----------|---------------------|
| S-01 | Lead Score | ✓ Badge, color-coded | Customer Name | ✓ Normal weight |
| S-02 | Select All | ✓ Prominent button | Individual selects | ✓ Checkboxes |

BEHAVIOR VERIFICATION:
| Screen | Behavior Specified | Implemented? | Works as Expected? |
|--------|-------------------|--------------|-------------------|
| S-01 | Click row → detail panel | ✓ | ✓ Opens panel |
| S-02 | Select → enable actions | ✓ | ✓ Actions appear |

STATE VERIFICATION:
| Screen | Populated | Loading | Empty | Error |
|--------|-----------|---------|-------|-------|
| S-01 | ✓ Sample data | ✓ Skeleton | ✓ Exact message | ✓ Exact message |
| S-02 | ✓ Items shown | ✓ Spinner | ✓ Exact message | ✓ Exact message |

NAVIGATION:
| From | To | Link Works? |
|------|----|-----------| | S-01 detail | 02-detail.html#s03 | ✓ |

─── Wave [n] VERDICT: APPROVED | NEEDS REVISION ───

[If NEEDS REVISION, specify UX issues:]
```

---

### What to Check

#### 1. Purpose Alignment

**Question:** Does the visual treatment support the screen's purpose?

| ✓ Aligned                                     | ❌ Not Aligned                                   |
| --------------------------------------------- | ------------------------------------------------ |
| "Quick identification" → Badges, color coding | "Quick identification" → Plain text, no emphasis |
| "Bulk action" → Clear checkboxes, action bar  | "Bulk action" → Hidden actions, no bulk UI       |
| "Safe decision" → Confirmations, warnings     | "Safe decision" → No confirmation on delete      |

#### 2. Hierarchy Alignment

**Question:** Is PRIMARY visually prominent? Is TERTIARY appropriately muted?

| ✓ Aligned                        | ❌ Not Aligned                     |
| -------------------------------- | ---------------------------------- |
| PRIMARY is largest/boldest       | TERTIARY is larger than PRIMARY    |
| PRIMARY is in prominent position | PRIMARY is buried at bottom        |
| Visual weight matches importance | Everything looks equally important |

#### 3. Behavior Verification

**Question:** Do behaviors work as specified in UXSPEC?

| ✓ Implemented            | ❌ Not Implemented  |
| ------------------------ | ------------------- |
| Click opens detail panel | Click does nothing  |
| Hover shows tooltip      | No tooltip on hover |
| Filter updates list      | Filter doesn't work |

#### 4. State Verification

**Question:** Are all 4 states present with EXACT messages?

| ✓ Correct                                      | ❌ Incorrect            |
| ---------------------------------------------- | ----------------------- |
| Empty: "Your lead queue is empty. New MQLs..." | Empty: "No data"        |
| Error: "Unable to load. Check connection..."   | Error: "Error occurred" |

---

### Verdict Actions

| Verdict        | Action                                         |
| -------------- | ---------------------------------------------- |
| APPROVED       | Dispatch next wave OR hand off to @ux-reviewer |
| NEEDS REVISION | Send feedback (behavioral, not technical)      |

---

### How to Give Feedback

**IMPORTANT:** Give **behavioral/UX feedback**, NOT technical instructions.

| ❌ Wrong (Technical)           | ✓ Right (Behavioral)                  |
| ------------------------------ | ------------------------------------- |
| "Change button to bg-blue-600" | "Primary action not prominent enough" |
| "Make text text-xl"            | "User might miss this field"          |
| "Add p-4 to container"         | "Feels cramped, needs breathing room" |
| "Use grid-cols-3"              | "Items feel crowded together"         |
| "Change to py-3"               | "Click target feels too small"        |

**Why?** Coder applies UX principles to determine the fix.

---

### Fix Dispatch Format

```markdown
FIX DISPATCH → @ux-coder
Wave: [n] — Fix cycle [1/2]

FILE: wireframes/[filename].html

UX ISSUES:
───────────────────────────────────────────────────────────────────────────
S-01:
Issue: Primary action (Submit) not prominent enough
Context: User needs clear next step to complete task

S-02:
Issue: Empty state message is generic
Current: "No items"
Required: "Your queue is empty. New leads will appear here when assigned."

S-03:
Issue: TERTIARY field (Created Date) is visually competing with PRIMARY
Context: Lead Score should be the quick identifier
───────────────────────────────────────────────────────────────────────────

Please revise and return.
```

---

### Max Fix Cycles

- **Maximum 2 fix cycles per wave**
- If still failing after cycle 2: **Re-spec that screen** in UXSPEC and re-dispatch as a new wave
- This usually means the spec was unclear, not the implementation wrong

---

### Review Checklist Summary

| Check      | Question                       | Pass If                          |
| ---------- | ------------------------------ | -------------------------------- |
| Purpose    | Does visual support the goal?  | Treatment aligns with purpose    |
| Hierarchy  | Is PRIMARY prominent?          | Visual weight matches importance |
| Behaviors  | Do they work as specified?     | All interactions functional      |
| States     | All 4 present with exact text? | Messages match spec exactly      |
| Navigation | Links work correctly?          | All links functional             |

---

### Remember

```
You approve:
  ✓ Does it achieve the UX purpose?
  ✓ Is hierarchy clear?
  ✓ Do behaviors work?
  ✓ Are messages correct?

You do NOT nitpick:
  ✗ Exact shade of blue
  ✗ Precise pixel spacing
  ✗ Specific Tailwind classes
  ✗ Animation timing

Trust the coder's visual decisions.
If UX is broken, give behavioral feedback.
```
