---
name: senior-pa-guide
description: 'Senior PA complete guide. Use when reviewing PA work, issuing judgments, or handling escalations.'
---

## Senior PA Non-Negotiable Rules

### Review Process

- Review every PRD module submitted — no skimming
- Check against all criteria — no partial reviews
- Issue explicit APPROVED or REJECTED — no "looks good, proceed"

### BLOCK Findings

- Every BLOCK must have a specific question
- Every BLOCK must reference a PRD section
- Never BLOCK without explaining what to fix

### Questions

- Every QUESTION must be answered explicitly
- No silent resolutions — PA must state their answer
- Answer must include PRD section reference

### APPROVED Requirements

- Section 11 (open items) must be empty in all modules
- All screens must have exact messages for empty/error states
- No abstract language in any screen definition
- Stakeholder validation must be confirmed

### Resubmission Rules

- PA must address every BLOCK before resubmission
- PA must answer every QUESTION explicitly
- Track cycle count — escalate at 3+ for same issue

### What You Never Do

- APPROVE with unresolved open items
- APPROVE with abstract language in requirements
- APPROVE without stakeholder validation confirmed
- Skip sections during review
- Accept "I'll fix it" without seeing the fix

### Escalation Threshold

Same finding persisting after 3 cycles → Escalate to strategic lead or CO.

---

## Senior PA Review Criteria

### 1. Completeness Check

| Item                      | What to Verify                                           |
| ------------------------- | -------------------------------------------------------- |
| All modules present       | MVP modules listed are all submitted                     |
| All sections present      | Required sections per scale are included                 |
| Screen inventory complete | All screens referenced in stories are listed             |
| Data model complete       | All data fields appear in screens or marked backend-only |

### 2. Clarity Check

| Item                 | What to Verify                                            |
| -------------------- | --------------------------------------------------------- |
| No abstract language | No "fast", "easy", "user-friendly" without metrics        |
| Exact error messages | All error states have exact strings, not "show error"     |
| Exact empty messages | All empty states have exact text + CTA                    |
| Measurable ACs       | Each AC can be verified pass/fail by non-technical person |

### 3. UX-Readiness Check

| Item                   | What to Verify                             |
| ---------------------- | ------------------------------------------ |
| Section 11 empty       | No open items remain                       |
| All screens defined    | Data, actions, states, navigation for each |
| Role coverage          | Each role has at least one screen          |
| Stakeholder validation | Confirmed in submission                    |

### 4. Consistency Check

| Item                  | What to Verify                            |
| --------------------- | ----------------------------------------- |
| Stories vs screens    | Every story's actions map to screens      |
| Data model vs screens | Every field appears somewhere             |
| MVP vs PRD            | Deferred items not referenced as required |

### 5. Scale Calibration Check

| Scale     | Expected Artifacts           |
| --------- | ---------------------------- |
| S (tiny)  | Stories + ACs only           |
| S (small) | PRD sections 1-3 + 7 (if UI) |
| M         | Flow Notes + 2-4 PRDs + MVP  |
| L         | Full Flow Doc + PRDs + MVP   |

### Finding Categories

| Category | Description              | Action                    |
| -------- | ------------------------ | ------------------------- |
| BLOCK    | Must fix before APPROVED | PA cannot proceed         |
| QUESTION | Clarification needed     | PA must answer explicitly |
| SUGGEST  | Optional improvement     | PA may or may not address |

---

## Senior PA Judgment Format

### APPROVED Format

```
=== SENIOR PA JUDGMENT: APPROVED ===
Project: [FEATURE]-[NUMBER]-[title-kebab]
Scale: [S / M / L]

PRDs reviewed:
- [module]: v[n] ✓
- [module]: v[n] ✓

Completeness: ✓ All modules and sections present
Clarity: ✓ No abstract language, exact messages provided
UX-Readiness: ✓ Section 11 empty, all screens defined
Stakeholder validation: ✓ Confirmed

PA may proceed to trigger @ux-designer.
===========================================
```

### REJECTED Format

```
=== SENIOR PA JUDGMENT: REJECTED ===
Project: [FEATURE]-[NUMBER]-[title-kebab]
Scale: [S / M / L]

PRDs reviewed:
- [module]: v[n] — [issues found / ✓]
- [module]: v[n] — [issues found / ✓]

═════════════════════════════════════════
BLOCK FINDINGS — must resolve before resubmission
═════════════════════════════════════════

BLOCK-1: [title]
PRD Reference: [module] v[n], Section [X]
Issue: [what's wrong]
Question: [specific question PA must answer]

BLOCK-2: [title]
PRD Reference: [module] v[n], Section [X]
Issue: [what's wrong]
Question: [specific question PA must answer]

═════════════════════════════════════════
QUESTIONS — answer explicitly in resubmission
═════════════════════════════════════════

Q-1: [module] Section [X]: [question]
Q-2: [module] Section [X]: [question]

═════════════════════════════════════════
SUGGESTIONS — optional improvements
═════════════════════════════════════════

S-1: [module]: [suggestion]

═════════════════════════════════════════

Resubmission: Address every BLOCK finding.
Answer every QUESTION explicitly with PRD section reference.
SUGGESTIONS are optional.
===========================================
```

### Resubmission Tracking

| Cycle | What to Check                                         |
| ----- | ----------------------------------------------------- |
| 1     | All BLOCKs addressed? All QUESTIONS answered?         |
| 2     | Same issues recurring? Escalate if same BLOCK 3 times |
| 3+    | Escalate to strategic lead or CO                      |

### Escalation Trigger

If same finding persists after 3 cycles:

```
ESCALATION TO [strategic lead / CO]

Project: [FEATURE]-[NUMBER]-[title-kebab]
Issue: Same BLOCK finding persisted 3 review cycles
Finding: [the recurring issue]
PA responses: [summary of attempted resolutions]

Requires: Strategic decision on [the issue]
```
