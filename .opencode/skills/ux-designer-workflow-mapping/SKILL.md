---
name: ux-designer-workflow-mapping
description: @ux-designer workflow mapping for multi-actor enterprise flows. Use when designing screens that involve multiple roles, handoffs, dependencies, and timeline-based processes.
---

## Workflow Mapping for Enterprise

### Core Principle

**Enterprise workflows have multiple actors, dependencies, and handoffs. Design for the full journey, not just one screen.**

### Multi-Actor Workflow Analysis

When designing for enterprise, identify:

| Element            | Question                                       | Document                  |
| ------------------ | ---------------------------------------------- | ------------------------- |
| **Actors**         | Who is involved in this workflow?              | List all roles            |
| **Touchpoints**    | Where does each actor interact?                | Map screens to actors     |
| **Handoffs**       | When does work pass from one actor to another? | Document triggers         |
| **Dependencies**   | What must happen before each step?             | Sequence diagram          |
| **Parallel Paths** | What can happen simultaneously?                | Parallel flow lanes       |
| **Wait States**    | Where does workflow pause for external input?  | Bottleneck identification |

### Workflow Diagram Structure

```markdown
## [Workflow Name] Flow

### Actors Involved

| Role     | Responsibility | Screens    |
| -------- | -------------- | ---------- |
| [Role 1] | [What they do] | S-01, S-02 |
| [Role 2] | [What they do] | S-03, S-04 |

### Flow Sequence
```

[Role 1] [Role 2] [Role 3]
│ │ │
▼ │ │
┌───────┐ │ │
│ S-01 │ │ │
│ Start │ │ │
└───┬───┘ │ │
│ │ │
▼ │ │
┌───────┐ │ │
│ S-02 │────────────▶│ │
│ Submit│ HANDOFF │ │
└───────┘ ▼ │
┌───────┐ │
│ S-03 │ │
│ Review│────────────▶│
└───────┘ HANDOFF ▼
┌───────┐
│ S-04 │
│ Approve│
└───────┘

````

### Handoff Documentation

Every handoff must document:

| Element | Description |
|---------|-------------|
| **From Screen** | Where handoff originates |
| **From Actor** | Who initiates handoff |
| **Trigger** | What action causes handoff |
| **To Screen** | Where handoff lands |
| **To Actor** | Who receives handoff |
| **Data Passed** | What information is transferred |
| **Notification** | How is recipient notified? |

```markdown
### Handoff: [Name]

| Element | Value |
|---------|-------|
| From Screen | S-02 (Submit Request) |
| From Actor | Sales Rep |
| Trigger | Click "Submit for Approval" |
| To Screen | S-03 (Review Queue) |
| To Actor | Manager |
| Data Passed | Request ID, Amount, Customer, Justification |
| Notification | Email + in-app badge |
````

### Dependency Matrix

Document what must happen before each screen:

```markdown
### Screen Dependencies

| Screen | Depends On | Cannot Proceed Until                      |
| ------ | ---------- | ----------------------------------------- |
| S-03   | S-02       | Request submitted                         |
| S-04   | S-03       | Review completed                          |
| S-05   | S-04       | Approval granted OR rejection with reason |
```

### Wait State Analysis

Identify where workflows pause:

| Screen | Wait State        | Who Is Waiting | For What              | Timeout? |
| ------ | ----------------- | -------------- | --------------------- | -------- |
| S-03   | Pending Review    | Sales Rep      | Manager decision      | 48 hours |
| S-05   | Customer Response | Manager        | Customer confirmation | 7 days   |

**For each wait state, design:**

- Status visibility (where can user see pending items?)
- Reminder mechanism (how are they notified?)
- Escalation path (what if timeout?)

### Multi-Screen State Consistency

When same data appears across multiple screens in a workflow:

| Data   | S-01     | S-02      | S-03         | Consistency Rule                   |
| ------ | -------- | --------- | ------------ | ---------------------------------- |
| Status | "Draft"  | "Pending" | "In Review"  | Status progresses, never goes back |
| Amount | Editable | Locked    | Display only | Edit permission decreases          |

### Workflow Validation Checklist

| Check                | Question                                | Pass Criteria                        |
| -------------------- | --------------------------------------- | ------------------------------------ |
| Actor coverage       | Is every actor's journey documented?    | All roles have entry/exit screens    |
| Handoff completeness | Is every handoff documented?            | Trigger + notification + data passed |
| Dependency clarity   | Is every dependency explicit?           | No implicit assumptions              |
| Wait state handling  | Are wait states designed?               | Status + reminder + escalation       |
| Error recovery       | What happens if workflow fails mid-way? | Recovery or rollback path documented |

### Workflow Decision Points

Document decision points in the workflow:

```markdown
### Decision Point: [Name]

| At Screen | Condition        | Path A              | Path B               |
| --------- | ---------------- | ------------------- | -------------------- |
| S-03      | Amount < $5000   | Auto-approve → S-05 | -                    |
| S-03      | Amount ≥ $5000   | -                   | Manual review → S-04 |
| S-04      | Manager approves | → S-05 (Approved)   | -                    |
| S-04      | Manager rejects  | → S-06 (Rejected)   | -                    |
```

### Output Requirement

For every multi-actor workflow, UXSPEC.md must include:

1. **Actors Involved table** - All roles and their screens
2. **Flow Sequence diagram** - Visual flow with handoffs
3. **Handoff Documentation** - Each handoff fully specified
4. **Dependency Matrix** - What must happen before each screen
5. **Wait State Analysis** - Where workflow pauses, with handling
6. **Decision Points** - Branching logic in workflow

### Enterprise-Specific Considerations

| Consideration       | Question                      | Design Implication                       |
| ------------------- | ----------------------------- | ---------------------------------------- |
| **Audit trail**     | Who did what, when?           | Log all actions with timestamp and actor |
| **Compliance**      | What must be captured?        | Required fields, confirmation screens    |
| **Delegation**      | What if actor is unavailable? | Delegate permission, backup approver     |
| **Undo/Redo**       | Can actions be reversed?      | Reversibility matrix per action          |
| **Bulk operations** | Can this be done in batch?    | Bulk UI patterns for efficiency          |
