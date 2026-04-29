---
name: ux-designer-workflow
description: '@ux-designer complete workflow through all 4 phases. Use as reference for phase ordering and output formats.'
---

## UX Designer Workflow — 4 Phases

Work through phases sequentially. Never skip or combine.

---

## Phase 1 — User Simulation

Before any flows or screens, write narratives for each primary user role.

### Output Format

```
=== USER SIMULATION: [Role] ===

Daily rhythm: [What does their day look like?]
Goal when they open this: [Human goal, not feature name]
Emotional state on arrival: [Hurried? Skeptical? Overwhelmed?]
What success feels like: [If perfect, what do they think?]
What friction feels like: [Where do they get stuck?]
Key moments: [3-5 moments of decision or emotion]
```

### Rules

- Write for **every role** that uses this feature
- Focus on human experience, not system

---

## Phase 2 — Flow Mapping

Map journey from entry to completion for each primary flow.

### Output Format

```
=== FLOW MAP: [Flow name] ===
Actor: [role]
Entry state: [what triggers this flow]
Success end state: [what "done" looks like]
Failure/exit states: [where flow can end without success]

Journey narrative: [Story form, not list]
Decision points: [Every choice point, include edge cases]
Friction risks: [2-3 points from Phase 1 to avoid]
```

---

## Phase 3 — Structure Decisions

Before wireframing, document WHY behind each screen's structure.

### Output Format

```
=== STRUCTURE DECISION: [Screen ID + name] ===

Primary action: [ONE thing 80% of users do]
Secondary actions: [Other things users might need]
Information hierarchy: [First glance → scan → deep dive]
Principle applied: [Most important principle — and why]
Challenge to PRD skeleton: [Any improvements from UX perspective]
Flow connection: [Before/after context]
```

### PRD Challenge

Sometimes you will realize:

- Two screens should be one
- One screen should be split
- Information is in wrong place

Document these decisions and WHY.

---

## Phase 4 — Wireframe Delegation

Only after Phases 1-3 and UXSPEC complete, delegate to @ux-coder.

### Prerequisites

- ✅ Phase 1 — User simulation complete
- ✅ Phase 2 — Flow mapping complete
- ✅ Phase 3 — Structure decisions complete
- ✅ UXSPEC files written

### Who Builds Wireframes

**@ux-coder** builds wireframes under your conceptual direction.

| You Provide | Coder Determines        |
| ----------- | ----------------------- |
| PURPOSE     | Visual support          |
| HIERARCHY   | Colors, sizes, spacing  |
| BEHAVIORS   | Interaction patterns    |
| STATES      | Visual design of states |

### Your Role

1. Plan all waves before dispatching Wave 1
2. Dispatch conceptual guidance (not visual specs)
3. Review each wave for UX alignment
4. Give behavioral feedback (not technical instructions)
5. Never write HTML or CSS yourself

### What Goes in Dispatch

| Element   | You Provide       | Example                              |
| --------- | ----------------- | ------------------------------------ |
| PURPOSE   | Screen goal       | "Sales rep quickly identifies leads" |
| HIERARCHY | Field importance  | "Lead Score is PRIMARY because..."   |
| BEHAVIORS | User interactions | "Click row opens detail panel"       |
| STATES    | Exact messages    | "Empty: 'Your queue is empty...'"    |

### How to Give Feedback

| ❌ Wrong                       | ✓ Right                               |
| ------------------------------ | ------------------------------------- |
| "Change button to bg-blue-600" | "Primary action not prominent enough" |
| "Make text text-xl"            | "User might miss this field"          |
| "Add p-4 padding"              | "Feels cramped, needs breathing room" |

---

## Phase Order Summary

```
Phase 1: simulations.md
    ↓
Phase 2: flows.md, workflow.md
    ↓
Phase 3: wave-*.md, hierarchy-matrix.md
    ↓
Phase 4: Dispatch → @ux-coder → Review → Approve
```

---

## Key Principle

```
You define WHAT the screen achieves.
Coder determines HOW to make it visual.

You define WHY fields are important.
Coder determines HOW to emphasize them.

You define WHAT users can do.
Coder determines HOW interactions look.
```
