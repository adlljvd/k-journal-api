---
name: qa-phase1
description: 'QA Phase 1 workflow. SPEC review then QUALITY.md production.'
---

## Phase 1 — SPEC Review and QUALITY.md

Activated when you receive a SPEC handoff from `@software-architect`.

Two-step process:

1. SPEC review (testability, completeness)
2. Produce QUALITY.md

---

## Step 1 — SPEC Review

Before producing QUALITY.md, validate SPEC for testability and completeness.

### Testability Checks

- Each FR maps to at least one verifiable assertion
- No vague language: "fast", "secure", "scalable" must have measurable thresholds
- All external dependencies identified (mocking strategy feasible)

### Coverage Completeness

- Happy path defined for every FR
- Failure and error paths explicitly defined
- Boundary conditions stated: null, empty, max, min values
- Auth and permission scenarios included where relevant
- Idempotency and retry scenarios covered where applicable

### Coherence Checks

- No contradicting requirements between sections
- No duplicate scenarios across test layers
- Component dependencies explicitly stated

### SPEC Review Output Format

If SPEC has gaps, output structured review before producing QUALITY.md:

```markdown
SPEC REVIEW → @software-architect

✓ Approved: [sections ready for test planning]

⚠ Clarification needed:

- [Section]: [issue] → [question needed]

✗ Blocking: [critical issues]

Await resolution before QUALITY.md.
```

### Rules

- Do not produce QUALITY.md until all blocking gaps are resolved
- Do not interpret ambiguous requirements — flag them every time
- Trust architect's review, focus on testability and coverage completeness

---

## Step 2 — Produce QUALITY.md

Once SPEC is validated, produce QUALITY.md:

```markdown
QUALITY.md: [Feature Name]

Coverage: 80% all metrics
Pyramid: 70% unit, 20% integration, 10% e2e

Scenarios:
| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 1 | [name] | unit | service | P0 | [behavior] |

P0 (non-negotiable): [list]
Mocking: [strategy]
Performance (if NFR): [criteria]
```

### Field Guidelines

| Section                   | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| Coverage targets          | Minimum thresholds for all metrics          |
| Test pyramid              | Distribution ratio between test types       |
| Scenario coverage map     | Complete inventory of test scenarios        |
| Non-negotiable scenarios  | P0 scenarios that must never be skipped     |
| Mocking strategy          | How external dependencies should be handled |
| Performance test criteria | NFR-based performance benchmarks            |

### Coverage Target Adjustment

Default: 80% for all metrics.
Adjust only if justified — state reason explicitly.

### Performance Test Section

Only include if NFR defined in SPEC.
Do not invent performance criteria not present in SPEC.

---

## Phase 1 Process Flow

```
Receive SPEC handoff → SPEC review → [Gaps?]
                                      ↓ YES        ↓ NO
                              Output review   Produce QUALITY.md
                              with requests          ↓
                                      ↓        Return to @software-architect
                              Wait for resolution
                                      ↓
                              Re-review SPEC
```

### Blocking Rule

Do not produce QUALITY.md until all blocking gaps are resolved.
Do not interpret ambiguous requirements — flag them every time.

---

## Phase 1 End

After producing QUALITY.md, return to `@software-architect`.
`@software-architect` passes to `@lead-engineer` for task integration.

Phase 1 role ends here.
