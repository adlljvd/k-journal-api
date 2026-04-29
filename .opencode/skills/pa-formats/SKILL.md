---
name: pa-formats
description: 'PA document formats. Use when: writing PRDs, MVP scope, or screen skeletons.'
---

## PRD Module Format

Scale determines which sections are required:

| Section                  | Scale S (tiny) | Scale S (small) | Scale M | Scale L |
| ------------------------ | -------------- | --------------- | ------- | ------- |
| 1. Problem statement     | ✓              | ✓               | ✓       | ✓       |
| 2. Roles & permissions   | —              | ✓               | ✓       | ✓       |
| 3. User stories          | ✓              | ✓               | ✓       | ✓       |
| 4. Business rules        | —              | ✓               | ✓       | ✓       |
| 5. Data model            | —              | if UI           | ✓       | ✓       |
| 6. Workflow map          | —              | if complex      | ✓       | ✓       |
| 7. Screen skeleton       | —              | ✓ if UI         | ✓       | ✓       |
| 8. Entry points per role | —              | —               | ✓       | ✓       |
| 9. Notifications         | —              | —               | ✓       | ✓       |
| 10. Scope                | —              | ✓               | ✓       | ✓       |
| 11. Open items           | ✓              | ✓               | ✓       | ✓       |

### PRD Header

```
=== PRD: [Module or Feature Name] ===
Version: [X]
Scale: [S / M / L]
Project: [project-slug]
Flow Document ref: [version — or "N/A for Scale S"]
MVP: [IN / PARTIAL / DEFER / N/A for Scale S]
Status: Draft | Reviewed | Stakeholder-validated | UX-ready
```

### Section 1 — Problem Statement

```
## 1. Problem statement
[Specific measurable gap this addresses.
Current state + measurable impact + what changes with this.]
```

### Section 3 — User Stories

```
## 3. User stories

### Story [n]: [title]
As a [specific role],
I want to [specific action],
so that [specific measurable outcome — not a feature description].

Acceptance criteria:
- AC-[n]-001: [verifiable — pass/fail — no abstract language]
```

### Section 7 — Screen Skeleton (Critical)

```
## 7. Screen skeleton

Screen inventory:
| ID | Name | Accessible to | Reached from | MVP |

Per screen:
**[S-XX] [Name]**
Purpose: [one sentence]
Accessible to: [roles]
Reached from: [navigation source]
Data displayed: [field | source | format | editable by]
Actions: [action | label | visible when | result]
States: loading / empty (exact message) / populated / error (exact message)
Validation: [field | rule | exact error string]
Navigation: success → / cancel → / back →
```

### Section 11 — Open Items (Must Be Empty Before UX-Ready)

```
## 11. Open items ⚠ (must be EMPTY before UX-ready)
| # | Question | Hypothesis | Must confirm with | Blocking UX? |
```

---

## MVP Scope Document (Scale M/L Only)

```
=== MVP-SCOPE.md ===
Project: [project-slug]
Scale: [M / L]
Status: Draft | Strategic-lead-aligned | Final

## What MVP proves
[One testable hypothesis. Not "build the system" but:
"If [specific user] can do [specific action], then [measurable outcome] within [timeframe]."]

## Module matrix
| Module | Status | In | Out (defer) |

## Explicitly NOT in MVP
| Feature | Why | Trigger for inclusion |

## Success criteria
| Metric | Current | Target | Timeline | Owner |

## User acceptance criteria
[What a real user must be able to accomplish — outcomes, not features]

## Scope change protocol
New requirement surfaces:
- Flag to strategic lead (or self in direct mode): "New requirement — impact on MVP?"
- Decide: blocker / next cycle / defer
- Log decision in Flow Document "Decisions made"
```

### MVP Hypothesis Examples

| Good                                                                                 | Bad                              |
| ------------------------------------------------------------------------------------ | -------------------------------- |
| "If Sales Reps can disqualify leads in <30 seconds, we'll recover 2 hours/week"      | "Build a lead management system" |
| "If Finance can close month-end in 3 days instead of 7, cash flow decisions improve" | "Create financial dashboards"    |

### Scope Change Triggers

When new requirement surfaces during development:

1. Flag to strategic lead: "New requirement — impact on MVP?"
2. Decide: blocker / next cycle / defer
3. Log decision with rationale
4. Update MVP-SCOPE.md if scope changes

---

## Screen Skeleton Validation

Dedicated walkthrough with each primary stakeholder — before UX Readiness Check.

**Scale S:** Can happen in the same session.
**Scale M/L:** Dedicated session.

### Walkthrough Format

```
SCREEN SKELETON WALKTHROUGH → [stakeholder]

I want to walk through [screen name] with you.
For each screen, tell me:
1. Is anything missing you would need to do your job?
2. Is anything listed you would never use?
3. When [most common exception happens] — is that covered?

[S-XX] [Screen name]
You arrive here from: [navigation source]
You see: [data list]
You can: [action list]
When there's no data: "[exact message]"
When there's an error: "[exact message]"

→ What's wrong with this picture?
```

### Validation Checklist Per Screen

| Check               | Question                                      |
| ------------------- | --------------------------------------------- |
| Data completeness   | Is all needed data listed?                    |
| Action completeness | Are all actions captured?                     |
| Empty state         | Is the message helpful with CTA?              |
| Error state         | Is the message clear with recovery path?      |
| Exception cases     | Are common failure scenarios covered?         |
| Edge cases          | Long text, many items, missing optional data? |

### After Validation

Every correction → update PRD immediately, not as a note.

If correction reveals new requirement:

1. Check MVP scope impact
2. Flag if affected
3. Update relevant PRD section

### Exact Messages Required

| State      | Requirement                     |
| ---------- | ------------------------------- |
| Empty      | Exact message + CTA button text |
| Error      | Exact message + recovery action |
| Validation | Exact error string per field    |

Never: "show error message" or "display notification"
Always: "Display: 'Unable to save changes. Your session has expired. Please log in again.'"
