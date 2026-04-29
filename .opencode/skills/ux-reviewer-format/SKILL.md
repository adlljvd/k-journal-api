---
name: ux-reviewer-format
description: 'Review output format. Summary, findings, recommendations.'
---

## UX Reviewer Output Format

### Complete Review Structure

```markdown
=== UX REVIEW: [Feature Name] ===
Wireframes: docs/requirements/[FEATURE]-[NUMBER]-[title]/wireframes/
UXSPEC: docs/requirements/[FEATURE]-[NUMBER]-[title]/UXSPEC.md
Reviewer: @ux-reviewer
Date: [date]

═══════════════════════════════════════════════════════════════════════════
EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════════════════

Total screens reviewed: [n]
Screens with issues: [n]
Critical issues: [n]
Medium issues: [n]
Low issues: [n]

RECOMMENDATION: [APPROVED | FIX REQUIRED | ESCALATE TO PA]

═══════════════════════════════════════════════════════════════════════════
FOCUS AREA SUMMARY
═══════════════════════════════════════════════════════════════════════════

| Focus Area                | Status        | Critical Issues |
| ------------------------- | ------------- | --------------- |
| Hierarchy & Visual Weight | [PASS/ISSUES] | [n]             |
| Domain Context Validation | [PASS/ISSUES] | [n]             |
| Heuristic Evaluation      | [PASS/ISSUES] | [n]             |
| Annotation Completeness   | [PASS/ISSUES] | [n]             |
| Persona Context           | [PASS/ISSUES] | [n]             |
| Ease of Use               | [PASS/ISSUES] | [n]             |
| Consistency               | [PASS/ISSUES] | [n]             |
| Edge Cases                | [PASS/ISSUES] | [n]             |
| Workflow Validation       | [PASS/ISSUES] | [n]             |

═══════════════════════════════════════════════════════════════════════════
DOMAIN CONTEXT VALIDATION
═══════════════════════════════════════════════════════════════════════════

| Screen | Field Claimed Primary | Domain Reasoning     | VALID? | Issue                               |
| ------ | --------------------- | -------------------- | ------ | ----------------------------------- |
| S-01   | Customer Name         | Sales needs quick ID | ✓      | -                                   |
| S-02   | Created Date          | Audit timestamp      | ❌     | Not decision-driving for Sales role |

HIERARCHY ISSUES:
| Screen | Issue | Severity | Action |
|--------|-------|----------|--------|
| S-02 | Created Date is PRIMARY but not decision-driving | HIGH | ESCALATE |

═══════════════════════════════════════════════════════════════════════════
HEURISTIC EVALUATION SUMMARY
═══════════════════════════════════════════════════════════════════════════

| #   | Heuristic                           | Avg Score | Critical Issues |
| --- | ----------------------------------- | --------- | --------------- |
| 1   | Visibility of System Status         | [0-4]     | [n]             |
| 2   | Match Between System and Real World | [0-4]     | [n]             |
| 3   | User Control and Freedom            | [0-4]     | [n]             |
| 4   | Consistency and Standards           | [0-4]     | [n]             |
| 5   | Error Prevention                    | [0-4]     | [n]             |
| 6   | Recognition Rather Than Recall      | [0-4]     | [n]             |
| 7   | Flexibility and Efficiency of Use   | [0-4]     | [n]             |
| 8   | Aesthetic and Minimalist Design     | [0-4]     | [n]             |
| 9   | Help Users Recover from Errors      | [0-4]     | [n]             |
| 10  | Help and Documentation              | [0-4]     | [n]             |

TOTAL HEURISTIC SCORE: [sum]/40

═══════════════════════════════════════════════════════════════════════════
ANNOTATION AUDIT SUMMARY
═══════════════════════════════════════════════════════════════════════════

| Screen | Hierarchy Doc | Behaviors | States           | Errors     | Overall |
| ------ | ------------- | --------- | ---------------- | ---------- | ------- |
| S-01   | ✓ Complete    | ✓ All     | ✓ 4/4            | ✓ Specific | PASS    |
| S-02   | ⚠️ Generic    | ✓ All     | ⚠️ Generic empty | ❌ Missing | FLAG    |

ANNOTATION ISSUES:
| Screen | Issue | Severity |
|--------|-------|----------|
| S-02 | Empty state message is generic | MEDIUM |
| S-02 | Error recovery not documented | HIGH |

═══════════════════════════════════════════════════════════════════════════
WORKFLOW VALIDATION
═══════════════════════════════════════════════════════════════════════════

| Aspect            | Status              | Issues |
| ----------------- | ------------------- | ------ |
| Actor Journeys    | [COMPLETE/GAPS]     | [n]    |
| Handoffs          | [VALIDATED/ISSUES]  | [n]    |
| Dependencies      | [VALIDATED/ISSUES]  | [n]    |
| State Consistency | [CONSISTENT/ISSUES] | [n]    |
| Recovery Paths    | [COVERED/GAPS]      | [n]    |

WORKFLOW ISSUES:
| Issue | Severity | Action |
|-------|----------|--------|
| [issue] | HIGH/MEDIUM/LOW | FIX/ESCALATE |

═══════════════════════════════════════════════════════════════════════════
SCREEN-BY-SCREEN FINDINGS
═══════════════════════════════════════════════════════════════════════════

─── SCREEN: [S-XX] [Screen Name] ───

DOMAIN CONTEXT:
| Field | Claimed | Valid? | Issue |
|-------|---------|--------|-------|

VISUAL HIERARCHY: [PASS/ISSUE]
HEURISTIC SCORE: [n]/40
PERSONA CONTEXT: [PASS/ISSUE]
EASE OF USE: [PASS/ISSUE]
CONSISTENCY: [PASS/ISSUE]
EDGE CASES: [PASS/ISSUE]
ANNOTATION QUALITY: [PASS/ISSUE]

Issues found:
| # | Focus Area | Issue | Severity | Action |
|---|------------|-------|----------|--------|
| 1 | [area] | [description] | HIGH/MEDIUM/LOW | FIX/ESCALATE |

[Repeat for each screen]

═══════════════════════════════════════════════════════════════════════════
RECOMMENDATIONS
═══════════════════════════════════════════════════════════════════════════

FIX IN WIREFRAME:
| Screen | Issue | Specific Fix Required |
|--------|-------|------------------------|
| S-XX | [issue] | [exact fix description] |

FIX IN UXSPEC:
| Screen | Issue | Update Required |
|--------|-------|-----------------|
| S-XX | [issue] | [specification update] |

ESCALATE TO PRODUCT-ANALYST:
| Issue | Why Escalate | Question for PA |
|-------|--------------|-----------------|
| [issue] | [reason] | [question] |

═══════════════════════════════════════════════════════════════════════════
FINAL DECISION
═══════════════════════════════════════════════════════════════════════════

[APPROVED] — Wireframes meet UX standards. Ready for final approval.

[FIX REQUIRED] — [n] issues must be fixed before approval.
Return to @ux-designer with fix list.

[ESCALATE TO PA] — [n] structural issues require product decision.
Cannot proceed until @product-analyst resolves.

═══════════════════════════════════════════════════════════════════════════
```

### Focus Areas Explained

| Focus Area                    | What It Covers                                |
| ----------------------------- | --------------------------------------------- |
| **Hierarchy & Visual Weight** | Visual prominence, weight distribution        |
| **Domain Context Validation** | Field importance justification against domain |
| **Heuristic Evaluation**      | Nielsen's 10 heuristics assessment            |
| **Annotation Completeness**   | Documentation quality and completeness        |
| **Persona Context**           | Role-appropriate design                       |
| **Ease of Use**               | User friction and efficiency                  |
| **Consistency**               | Cross-screen pattern consistency              |
| **Edge Cases**                | Empty, error, loading, boundary states        |
| **Workflow Validation**       | Multi-actor flow integrity                    |

### Severity Levels

| Severity | Description                      | Action                     |
| -------- | -------------------------------- | -------------------------- |
| HIGH     | Blocks user from completing task | Must fix before approval   |
| MEDIUM   | Causes friction or confusion     | Should fix before approval |
| LOW      | Minor polish issue               | Can fix in iteration       |

### Action Types

| Action           | When to Use                                            |
| ---------------- | ------------------------------------------------------ |
| FIX in Wireframe | Implementation issue, @ux-coder can fix                |
| FIX in UXSPEC    | Specification incomplete, @ux-designer needs to update |
| ESCALATE         | Structural issue, needs @product-analyst decision      |

### Domain Context Validation Output

This section validates that hierarchy decisions are justified:

```markdown
DOMAIN CONTEXT VALIDATION:

For Screen S-01:
| Field | Claimed | Reasoning Provided | VALID? | Issue |
|-------|---------|-------------------|--------|-------|
| Customer Name | PRIMARY | Sales needs quick ID | ✓ | - |
| Account Status | SECONDARY | Triage context | ✓ | - |
| Created Date | TERTIARY | Audit only | ✓ | - |

For Screen S-02:
| Field | Claimed | Reasoning Provided | VALID? | Issue |
|-------|---------|-------------------|--------|-------|
| Created Date | PRIMARY | "Important info" | ❌ | Generic reasoning, not domain-specific |
| Customer Name | SECONDARY | "User needs to see" | ❌ | Should be PRIMARY for Sales role |
```

### Heuristic Evaluation Summary

Include aggregate scores across all screens:

```markdown
HEURISTIC EVALUATION SUMMARY:

Average Scores Across All Screens:
| # | Heuristic | Avg Score | Worst Screen | Issue |
|---|-----------|-----------|--------------|-------|
| 1 | Visibility of System Status | 0.5 | - | None |
| 2 | Match Real World | 0.0 | - | None |
| 3 | User Control | 2.0 | S-03 | No cancel on long form |
| 4 | Consistency | 1.0 | S-02 | Button placement varies |
...
```

### Annotation Audit Summary

Aggregate annotation quality across all screens:

```markdown
ANNOTATION AUDIT SUMMARY:

Coverage:

- Hierarchy reasoning present: [n]/[total] screens
- Hierarchy reasoning specific: [n]/[total] screens
- All behaviors documented: [n]/[total] screens
- All 4 states documented: [n]/[total] screens
- Specific error messages: [n]/[total] screens
- Specific empty messages: [n]/[total] screens

Common Issues:
| Issue Type | Count | Example |
|------------|-------|---------|
| Generic hierarchy reasoning | 2 | "Important field" |
| Generic empty state | 1 | "No data" |
| Missing error recovery | 1 | S-03 |
```

### Workflow Validation Summary

For multi-actor workflows:

```markdown
WORKFLOW VALIDATION SUMMARY:

Actors: Sales Rep, Manager, Customer

Actor Journey Status:
| Actor | Entry | Exit | Complete? |
|-------|-------|------|-----------|
| Sales Rep | S-01 | S-05 | ✓ |
| Manager | S-03 | S-04 | ✓ |
| Customer | S-06 | S-07 | ❌ Missing exit |

Handoff Status:
| Handoff | Validated | Issue |
|---------|-----------|-------|
| Sales → Manager | ✓ | - |
| Manager → Customer | ❌ | No notification defined |

Recovery Paths:
| Scenario | Covered | Impact |
|----------|---------|--------|
| Mid-form exit | ✓ | Auto-save |
| Session timeout | ❌ | Work lost |
```
