---
name: spec-gap-detection
description: 'SPEC validation and gap detection. Use when: validating SPEC before task breakdown, checking FR acceptance criteria, or identifying missing contracts.'
---

# SPEC Gap Detection

Run **before** breaking down tasks. If SPEC has gaps, flag them — do not proceed.

## Validation Checklist

| Check                  | Requirement                                     |
| ---------------------- | ----------------------------------------------- |
| FR acceptance criteria | Every FR has independently verifiable criteria  |
| Integration points     | Clear API contract or frontend contract defined |
| Data model             | All entities and relationships specified        |
| Dependencies           | External dependencies identified                |

## Gap Detection Process

### Step 1 — Read SPEC.md

Read entire SPEC.md from working path:

```
docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/SPEC.md
```

### Step 2 — Validate Each FR

For every FR, verify:

| Element              | Must Have                  | Gap if Missing            |
| -------------------- | -------------------------- | ------------------------- |
| FR ID                | Unique identifier          | Cannot reference in tasks |
| Description          | What it does               | Cannot scope task         |
| Acceptance criteria  | Pass/fail conditions       | Cannot verify completion  |
| Integration contract | API shape / Frontend shape | Cannot implement boundary |

### Step 3 — Flag Gaps Immediately

If gap found, output:

```
SPEC GAP DETECTED → @software-architect
FR affected: [FR number]
Gap: [what is missing or ambiguous]
Impact: [why this blocks task breakdown]
Required clarification: [specific question]
```

**Do NOT begin breakdown until all gaps resolved.**

## Common Gap Types

| Gap Type                    | Example                  | Why It Blocks            |
| --------------------------- | ------------------------ | ------------------------ |
| Missing acceptance criteria | "FR-003: User can login" | How do we know it works? |
| Ambiguous criterion         | "Should be fast"         | Not verifiable           |
| Missing API contract        | "Returns user data"      | What shape?              |
| Undefined error handling    | "If invalid input..."    | What's invalid?          |
| Missing entity definition   | "User profile"           | What fields?             |
| Unclear dependency          | "Uses auth service"      | What interface?          |

## Acceptance Criteria Quality

Good criteria are:

- **Specific**: "Returns 404 when user not found"
- **Measurable**: "Response time < 200ms at P95"
- **Binary**: Pass or fail, no partial credit

Bad criteria are:

- "Should work correctly"
- "User-friendly error message"
- "Follows best practices"

## Gap Resolution

| Scenario                 | Action                                 |
| ------------------------ | -------------------------------------- |
| SA clarifies in SPEC.md  | Re-read and continue validation        |
| SA provides external doc | Read doc, integrate into understanding |
| SA defers to architect   | Escalate to @software-architect        |

## Validation Complete

When SPEC passes all checks:

```
=== SPEC VALIDATION PASSED ===
FRs validated: [count]
Acceptance criteria: All verifiable
Integration contracts: All defined
Gaps: none

Ready to proceed to task breakdown.
```
