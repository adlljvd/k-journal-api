---
name: ux-reviewer-checklist
description: '@ux-reviewer consolidated review checklist covering hierarchy, persona context, ease of use, consistency, and edge cases. Use when performing detailed wireframe review.'
---

## UX Reviewer Checklist

### 5 Focus Areas

1. Hierarchy & Visual Weight
2. Persona Context
3. Ease of Use
4. Consistency
5. Edge Cases

---

## 1. Hierarchy & Visual Weight

### Core Question

**"If user spends 2 seconds here, what do they notice? Is it what they SHOULD notice?"**

### Visual Weight Checklist

| Check              | Question                             | Pass Criteria                |
| ------------------ | ------------------------------------ | ---------------------------- |
| Primary Action     | Is there ONE clear primary action?   | Visually dominant            |
| Secondary Actions  | Are secondary actions de-emphasized? | Smaller, muted, lower        |
| Information Order  | Ordered by importance?               | Most important at top/center |
| Equal Weighting    | 5 equally-weighted buttons?          | NO — failure                 |
| Visual Competition | Elements competing?                  | NO — clear hierarchy         |

### Domain Context Validation

**Step 1:** Extract hierarchy from UXSPEC Data Field Importance Matrix

**Step 2:** Validate each PRIMARY field:

- Is this decision-driving for [role]?
- Would missing this cause wrong decision?
- Is reasoning domain-specific?

**Step 3:** Cross-check with PRD

| Claimed PRIMARY | Validate Against     | Concern If               |
| --------------- | -------------------- | ------------------------ |
| Customer Name   | Sales needs quick ID | Valid PRIMARY            |
| Created Date    | Audit only           | Flag: Should be TERTIARY |
| Internal Notes  | Not decision-driving | Flag: Should be TERTIARY |

### Hierarchy Mismatch Types

| Mismatch                 | Example                              | Flag                                   |
| ------------------------ | ------------------------------------ | -------------------------------------- |
| Wrong PRIMARY            | "Created Date" is PRIMARY for Sales  | "Not decision-driving for role"        |
| Missing PRIMARY          | No PRIMARY on action-required screen | "No decision-driving field identified" |
| Too many PRIMARY         | 5 PRIMARY fields                     | "Visual noise - prioritize to 1-2"     |
| TERTIARY in top position | Audit field at top-left              | "Wastes visual real estate"            |

---

## 2. Persona Context

### Core Questions

| Question                    | Why It Matters                  |
| --------------------------- | ------------------------------- |
| Is this person in a hurry?  | High-frequency tasks need speed |
| Is this person stressed?    | Error prevention is critical    |
| Is this person skeptical?   | Trust-building elements needed  |
| Is this person overwhelmed? | Progressive disclosure needed   |

### Frequency vs. Complexity

| Task Frequency | Design Priority           |
| -------------- | ------------------------- |
| 20x/day        | Fewest possible clicks    |
| 1x/week        | More guidance acceptable  |
| 1x/month       | Full documentation needed |

### Persona Validation

For each screen, verify:

1. Primary role is clear from UXSPEC
2. Task frequency matches design
3. Emotional state addressed
4. Success path is obvious

---

## 3. Ease of Use

### Core Question

**"Can a new user complete this task without asking for help?"**

### Ease of Use Checklist

| Check            | Question                                 | Pass Criteria                      |
| ---------------- | ---------------------------------------- | ---------------------------------- |
| Goal Clarity     | Is it clear what this screen does?       | One sentence explanation visible   |
| Next Action      | Is it obvious what to do next?           | Primary action visually dominant   |
| Error Prevention | Are errors prevented before they happen? | Validation inline, disabled states |
| Feedback         | Does user know what happened?            | Loading, success, error states     |
| Recovery         | Can user undo mistakes?                  | Cancel, back, edit available       |
| Efficiency       | Can expert skip guidance?                | Keyboard shortcuts, defaults       |

### Friction Indicators

| Indicator                               | Issue                              |
| --------------------------------------- | ---------------------------------- |
| Required field not marked               | User surprised by validation error |
| No inline help for complex fields       | User confused                      |
| Primary action buried                   | User hunts for what to do          |
| No confirmation for destructive actions | User fears mistakes                |
| Long form without sections              | User overwhelmed                   |

---

## 4. Consistency

### Core Question

**"If user learned pattern X in one place, does it work the same everywhere?"**

### Consistency Checklist

| Check                      | Question                                | Pass Criteria                      |
| -------------------------- | --------------------------------------- | ---------------------------------- |
| Same Action = Same Pattern | Does "Edit" work the same everywhere?   | Modal or inline, consistent choice |
| Button Placement           | Primary action always in same position? | Right, bottom-right, or center     |
| Form Layout                | Labels, inputs, errors consistent?      | Same spacing, alignment            |
| Error Display              | Error format consistent?                | Same icon, color, position         |
| Empty States               | Empty state pattern consistent?         | Icon + Title + Body + CTA          |

### Cross-Screen Consistency

| Pattern        | Screen A           | Screen B     | Issue?                     |
| -------------- | ------------------ | ------------ | -------------------------- |
| Primary button | Bottom-right       | Top-left     | ❌ Inconsistent            |
| Edit action    | Modal              | Inline       | ❌ Inconsistent            |
| Empty state    | Icon + message     | Just message | ❌ Inconsistent            |
| Delete         | Confirmation modal | Immediate    | ❌ Dangerous inconsistency |

---

## 5. Edge Cases

### Core Question

**"What happens when things aren't normal?"**

### Edge Case Categories

| Category        | Questions to Ask                                 |
| --------------- | ------------------------------------------------ |
| Data extremes   | What if 0 items? 1000 items? Very long text?     |
| Timing          | What if slow network? Timeout? Concurrent edits? |
| State conflicts | What if data changed elsewhere?                  |
| Permission      | What if user lacks permission?                   |
| System          | What if API fails? Database down?                |

### Edge Case Checklist

| Edge Case       | Has Handling?                  | Evidence        |
| --------------- | ------------------------------ | --------------- |
| Empty list      | ✓ Empty state with CTA         | [exact message] |
| Long list       | ✓ Pagination or virtual scroll | [behavior]      |
| Long text       | ✓ Truncation with tooltip      | [behavior]      |
| No permission   | ✓ Hidden or disabled           | [behavior]      |
| API failure     | ✓ Error state with retry       | [exact message] |
| Slow load       | ✓ Loading skeleton             | [behavior]      |
| Concurrent edit | ✓ Optimistic lock or merge     | [behavior]      |

### Edge Case Severity

| Edge Case       | Frequency | Severity | Priority     |
| --------------- | --------- | -------- | ------------ |
| Empty list      | Common    | LOW      | Required     |
| API failure     | Uncommon  | HIGH     | Required     |
| Long text       | Common    | LOW      | Required     |
| Concurrent edit | Rare      | HIGH     | Nice-to-have |

---

## Review Output Format

```markdown
=== WIREFRAME REVIEW: [Screen ID] ===

## 1. Hierarchy & Visual Weight

- Primary action: [clear/unclear]
- Domain validation: [match/mismatch]
- Issues: [list or "none"]

## 2. Persona Context

- Role: [role]
- Frequency match: [yes/no]
- Emotional state addressed: [yes/no]

## 3. Ease of Use

- Goal clarity: [clear/unclear]
- Error prevention: [adequate/missing]
- Friction points: [list or "none"]

## 4. Consistency

- Cross-screen patterns: [consistent/inconsistent]
- Inconsistencies found: [list or "none"]

## 5. Edge Cases

- Edge cases handled: [list]
- Missing edge cases: [list or "none"]

## Decision

[APPROVED / FIX IN WIREFRAME / FIX IN UXSPEC / ESCALATE TO PA]

## Issues Summary

| #   | Area | Issue | Severity | Action |
| --- | ---- | ----- | -------- | ------ |
| 1   | ...  | ...   | ...      | ...    |
```
