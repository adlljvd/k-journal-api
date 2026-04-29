---
name: ux-reviewer-annotation-audit
description: 'Annotation audit. Check completeness and quality.'
---

## Annotation Completeness Audit

### Core Principle

**Incomplete annotations lead to incomplete implementations. Audit annotations before approving wireframes.**

### Audit Scope

| Audit Area              | What to Check                                     |
| ----------------------- | ------------------------------------------------- |
| **Annotation presence** | Are annotations present where needed?             |
| **Annotation quality**  | Are annotations specific, not generic?            |
| **Behavior coverage**   | Are all interactive behaviors documented?         |
| **State coverage**      | Are all states documented with specific messages? |
| **Error handling**      | Are all error paths documented with recovery?     |

---

## Part 1: Annotation Presence Audit

### Required Annotations

Every screen must have annotations for:

| Element Type     | Required Annotation     | Check     |
| ---------------- | ----------------------- | --------- |
| Primary actions  | Click behavior + result | ✓ Present |
| Form fields      | Validation + format     | ✓ Present |
| Dynamic elements | State change behavior   | ✓ Present |
| Navigation links | Destination + purpose   | ✓ Present |
| Error states     | Message + recovery      | ✓ Present |
| Empty states     | Message + CTA           | ✓ Present |

### Presence Checklist

```markdown
ANNOTATION PRESENCE: [Screen ID]

| Element         | Annotation Required | Present? | Missing      |
| --------------- | ------------------- | -------- | ------------ |
| Submit button   | ✓ Yes               | ✓ / ❌   | [if missing] |
| Form validation | ✓ Yes               | ✓ / ❌   | [if missing] |
| Empty state     | ✓ Yes               | ✓ / ❌   | [if missing] |
| Error handling  | ✓ Yes               | ✓ / ❌   | [if missing] |
```

---

## Part 2: Annotation Quality Audit

### Quality Criteria

| Criterion        | Good Example                                                                                                                               | Bad Example           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| **Specific**     | "Search returns results as you type, debounced at 300ms"                                                                                   | "Search works"        |
| **Actionable**   | "Error shows 'Email not found. Check spelling or register.' with 'Try Again' button"                                                       | "Error shows message" |
| **Complete**     | "Button disabled until all required fields complete. On click, validates, then submits. Success goes to S-03. Error shows inline message." | "Button submits form" |
| **Domain-aware** | "For Sales Rep role, shows 'Your Leads' queue. For Manager role, shows 'Team Leads' queue"                                                 | "Shows leads"         |

### Quality Issues to Flag

| Issue Type       | Example           | Flag Message                                       |
| ---------------- | ----------------- | -------------------------------------------------- |
| **Vague**        | "Displays data"   | "Annotation too vague - what data, how displayed?" |
| **Missing WHY**  | "Button is blue"  | "No rationale for design decision"                 |
| **Missing WHEN** | "Shows error"     | "When does this error appear? What triggers it?"   |
| **Missing HOW**  | "User can filter" | "How does user access and apply filters?"          |

### Quality Audit Template

```markdown
ANNOTATION QUALITY: [Screen ID]

| Annotation            | Specific? | Actionable? | Complete? | Issues   |
| --------------------- | --------- | ----------- | --------- | -------- |
| UX_NOTE (main)        | ✓ / ❌    | ✓ / ❌      | ✓ / ❌    | [issues] |
| Empty state message   | ✓ / ❌    | ✓ / ❌      | ✓ / ❌    | [issues] |
| Error message         | ✓ / ❌    | ✓ / ❌      | ✓ / ❌    | [issues] |
| Behavior descriptions | ✓ / ❌    | ✓ / ❌      | ✓ / ❌    | [issues] |
```

---

## Part 3: Behavior Coverage Audit

### Interactive Elements Checklist

For each interactive element, verify:

| Element        | Must Document                               | Check            |
| -------------- | ------------------------------------------- | ---------------- |
| **Button**     | Click action, disabled state, loading state | ✓ All documented |
| **Link**       | Destination, context                        | ✓ Documented     |
| **Form field** | Validation rules, error messages, format    | ✓ All documented |
| **Dropdown**   | Options, default, search/none               | ✓ Documented     |
| **Toggle**     | States, default, persistence                | ✓ Documented     |
| **Filter**     | Options, application, clear                 | ✓ Documented     |
| **Sort**       | Columns, directions, persistence            | ✓ Documented     |
| **Pagination** | Page size, navigation, current position     | ✓ Documented     |

### Behavior Coverage Template

```markdown
BEHAVIOR COVERAGE: [Screen ID]

| Element       | Type     | Behavior Documented          | Missing                  |
| ------------- | -------- | ---------------------------- | ------------------------ |
| Submit button | Button   | ✓ Click → validate → submit  | None                     |
| Email field   | Input    | ⚠️ Validation format missing | "Must be valid email"    |
| Status filter | Dropdown | ❌ No behavior documented    | Needs full documentation |
```

---

## Part 4: State Coverage Audit

### Four-State Requirement

Every screen should document 4 states:

| State         | Required Content                          | Check        |
| ------------- | ----------------------------------------- | ------------ |
| **Populated** | Default content with sample data          | ✓ Documented |
| **Loading**   | Skeleton or spinner description           | ✓ Documented |
| **Empty**     | Icon + Title + Body + CTA (specific text) | ✓ Documented |
| **Error**     | Icon + Title + Body + Recovery action     | ✓ Documented |

### Empty State Quality Check

| Check     | Good Example                                              | Bad Example              |
| --------- | --------------------------------------------------------- | ------------------------ |
| **Icon**  | 📭                                                        | ❌ None                  |
| **Title** | "Your lead queue is empty"                                | ❌ "No data"             |
| **Body**  | "New MQLs will appear here when marketing qualifies them" | ❌ "No items to display" |
| **CTA**   | "View all leads" button                                   | ❌ None or just "OK"     |

### Error State Quality Check

| Check        | Good Example                                     | Bad Example               |
| ------------ | ------------------------------------------------ | ------------------------- |
| **Icon**     | ❌                                               | ❌ None                   |
| **Title**    | "Unable to save changes"                         | ❌ "Error"                |
| **Body**     | "Your session has expired. Please log in again." | ❌ "An error occurred"    |
| **Recovery** | "Log in" button                                  | ❌ None or "Dismiss" only |

### State Coverage Template

```markdown
STATE COVERAGE: [Screen ID]

| State     | Present? | Quality  | Specific Text | Issues   |
| --------- | -------- | -------- | ------------- | -------- |
| Populated | ✓ / ❌   | GOOD/BAD | [check]       | [issues] |
| Loading   | ✓ / ❌   | GOOD/BAD | [check]       | [issues] |
| Empty     | ✓ / ❌   | GOOD/BAD | [check]       | [issues] |
| Error     | ✓ / ❌   | GOOD/BAD | [check]       | [issues] |
```

---

## Part 5: Error Handling Audit

### Error Types to Check

| Error Type         | Example                   | Must Document              |
| ------------------ | ------------------------- | -------------------------- |
| **Validation**     | Invalid email format      | Specific message per field |
| **Network**        | API timeout               | Message + retry action     |
| **Permission**     | Access denied             | Message + alternative      |
| **Not found**      | Record doesn't exist      | Message + navigation       |
| **Business logic** | Cannot delete in-use item | Message + explanation      |

### Error Message Quality

| Quality        | Good                                     | Bad                           |
| -------------- | ---------------------------------------- | ----------------------------- |
| **Specific**   | "Email must include @ symbol"            | "Invalid input"               |
| **Helpful**    | "Password must be at least 8 characters" | "Password too short"          |
| **Actionable** | "Try again or contact support"           | "Error occurred"              |
| **No blame**   | "Please enter a valid date"              | "You entered an invalid date" |

### Error Audit Template

```markdown
ERROR HANDLING: [Screen ID]

| Error Scenario       | Documented? | Message Quality  | Recovery Documented? |
| -------------------- | ----------- | ---------------- | -------------------- |
| Required field empty | ✓ / ❌      | SPECIFIC/GENERIC | ✓ / ❌               |
| Invalid format       | ✓ / ❌      | SPECIFIC/GENERIC | ✓ / ❌               |
| API failure          | ✓ / ❌      | SPECIFIC/GENERIC | ✓ / ❌               |
| Permission denied    | ✓ / ❌      | SPECIFIC/GENERIC | ✓ / ❌               |
```

---

## Complete Annotation Audit Output

```markdown
=== ANNOTATION AUDIT: [Screen ID] ===

Part 1 - Presence:
| Element | Required | Present | Gap |
|---------|----------|---------|-----|
[Presence checklist]

Part 2 - Quality:
| Annotation | Score | Issues |
|------------|-------|--------|
[Quality checklist]

Part 3 - Behavior Coverage:
| Interactive Elements | Documented | Missing |
|---------------------|------------|---------|
[Behavior checklist]

Part 4 - State Coverage:
| State | Present | Quality | Issues |
|-------|---------|---------|--------|
[State checklist]

Part 5 - Error Handling:
| Scenario | Documented | Message Quality |
|----------|------------|-----------------|
[Error checklist]

AUDIT SUMMARY:

- Annotations missing: [count]
- Quality issues: [count]
- Behavior gaps: [count]
- State gaps: [count]
- Error handling gaps: [count]

TOTAL ISSUES: [count]

RECOMMENDATION:
[APPROVED / FIX REQUIRED]
```

---

## Severity for Annotation Issues

| Issue Type                  | Severity | Reason                            |
| --------------------------- | -------- | --------------------------------- |
| Missing empty state message | HIGH     | User sees blank or generic text   |
| Missing error recovery      | HIGH     | User stuck on error               |
| Missing validation message  | HIGH     | User doesn't know how to fix      |
| Vague annotation            | MEDIUM   | Implementation may be wrong       |
| Missing behavior doc        | MEDIUM   | May lead to incorrect interaction |
| Generic state text          | LOW      | Poor UX but functional            |
