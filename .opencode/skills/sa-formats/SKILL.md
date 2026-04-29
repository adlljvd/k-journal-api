---
name: sa-formats
description: 'SA SPEC and ADR format templates. Use when writing SPEC.md or ADR.md.'
---

## SPEC.md Format

```
=== SPEC: [Feature Name] ===

## Context
[2-3 sentences explaining why this feature exists and what problem it solves]

## Scope
[What is in scope — explicit boundaries]

## Out of Scope
[What is explicitly not covered — prevent scope creep]

## Functional Requirements

### FR-001: [Requirement Title]
**Description**: [What the system must do]
**Acceptance Criteria**:
- [Verifiable criterion 1]
- [Verifiable criterion 2]

### FR-002: [Requirement Title]
[Continue for each FR]

## API Contract

### [Endpoint Name]
- **Method**: [GET/POST/PUT/DELETE]
- **Path**: `/api/v1/resource`
- **Request**: [Body schema]
- **Response**: [Response schema]
- **Errors**: [Error codes and messages]

## Data Model

### [Entity Name]
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|

## Non-Functional Requirements

### NFR-001: [Requirement Title]
**Metric**: [Measurable threshold]
**Rationale**: [Why this threshold]

## Quality Gates (Skeleton)

| Gate | Metric | Target |
|------|--------|--------|
| Coverage | Statements | 80% |
| Coverage | Branches | 80% |
| Performance | P95 Latency | [threshold]ms |

## Assumptions
- [Assumption 1]
- [Assumption 2]

## Risks
- [Risk 1]: [Impact] — [Mitigation]
- [Risk 2]: [Impact] — [Mitigation]
```

---

## ADR.md Format

```
=== ADR-[number]: [Title] ===

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[What is the issue we are seeing that motivates this decision?]

## Decision
[What is the change that we're proposing and/or doing?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Neutral
- [Side effect 1]

## Alternatives Considered
| Option | Why not chosen |
|--------|----------------|
| [Option A] | [Reason] |
| [Option B] | [Reason] |

## Non-Negotiables
[Constraints that must never be violated by downstream implementations]
- [Non-negotiable 1]
- [Non-negotiable 2]
```

---

## Format Guidelines

### SPEC Guidelines

| Section                     | Purpose                                |
| --------------------------- | -------------------------------------- |
| Context                     | Set mental model for downstream agents |
| Scope                       | Define explicit boundaries             |
| Out of Scope                | Prevent scope creep                    |
| Functional Requirements     | What the system must do                |
| API Contract                | Exact interface specification          |
| Data Model                  | Entity definitions                     |
| Non-Functional Requirements | Measurable quality thresholds          |
| Quality Gates               | Test coverage and performance targets  |
| Assumptions                 | Explicit context required              |
| Risks                       | Known issues and mitigations           |

### ADR Guidelines

| Section                 | Purpose                             |
| ----------------------- | ----------------------------------- |
| Status                  | Current state of the decision       |
| Context                 | Why this decision is needed         |
| Decision                | What is being decided               |
| Consequences            | Impact of the decision              |
| Alternatives Considered | Show due diligence                  |
| Non-Negotiables         | Hard constraints for implementation |
