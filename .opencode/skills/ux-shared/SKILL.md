---
name: ux-shared
description: 'UX principles, annotations, hierarchy, and output structure. Use when making any UX decision or producing UX artifacts.'
---

## UX Principles

These are not a checklist. They are lenses you see through at every step.

### 1. Progressive Disclosure

Show only what the user needs right now. Information they might need later should be accessible but not competing for attention.

**Ask:** _What is the minimum information needed to make the next decision?_

### 2. Hierarchy and Visual Weight

Every screen has one primary action, one or two secondary actions, and everything else. If a screen has five equally-weighted buttons, it has no primary action.

**Ask:** _If a user spends 2 seconds on this screen, what should they notice?_

### 3. Recognition over Recall

Do not make users remember information from a previous screen to use on this screen. Show the context they need, inline, at the moment they need it.

**Ask:** _Is there anything the user has to hold in their head to complete this action?_

### 4. Error Prevention First, Error Messages Second

Design to prevent errors before they happen. Disable a submit button until required fields are filled. Show validation inline as the user types.

**Ask:** _What mistake is a user most likely to make here, and how does the design prevent it?_

### 5. Feedback and System Status

The user always knows what is happening. Loading states are not a nice-to-have — they are part of the design. An action that completed needs a confirmation.

**Ask:** _At every moment, does the user know what the system is doing?_

### 6. Consistency

Same action, same pattern, everywhere. If "Disqualify" opens a modal in the lead queue, it opens a modal in the lead detail too.

**Ask:** _Have I used the same pattern for the same type of action throughout?_

### 7. Efficiency for Frequent Tasks

The task a user does 20 times a day should be faster than a task they do once.

**Ask:** _What is the highest-frequency task, and how few actions does it take?_

### 8. Meaningful Empty States

An empty state is a product moment. "No leads" is not a message. "Your lead queue is empty. New MQLs will appear here when marketing qualifies them." is a message.

**Ask:** _What does the user do when there is nothing here?_

### 9. Clear Error Recovery

When something goes wrong, the error message tells the user what went wrong and what to do next. "An error occurred" is not an error message.

**Ask:** _Does every error state give the user a path forward?_

### 10. Momentum Through the Flow

Completing an action should give the user forward momentum — not leave them stranded. The flow should feel like water moving downhill.

**Ask:** _After completing this action, what does the user do next?_

---

## Design Annotations Standard

### Core Principle

**Annotations are the contract between design and implementation. Incomplete annotations = incomplete implementation.**

### Annotation Types

| Type                | Purpose                                | Color       | Symbol |
| ------------------- | -------------------------------------- | ----------- | ------ |
| **UX Decision**     | Design rationale, user-facing behavior | Yellow/Gold | 🟡     |
| **Dev Note**        | Technical implementation details       | Blue        | 🔵     |
| **Flow Connection** | Navigation context                     | Green       | 🟢     |

### UX Annotation Structure

Every UX annotation must answer:

| Element  | Question                      | Required?                  |
| -------- | ----------------------------- | -------------------------- |
| **WHAT** | What does this element do?    | ✓ Always                   |
| **WHY**  | Why is it designed this way?  | ✓ Always                   |
| **WHEN** | When does this appear/change? | ✓ For dynamic elements     |
| **HOW**  | How does user interact?       | ✓ For interactive elements |

### Annotation Categories

**1. Behavior Annotations**

```markdown
UX_NOTE:
"[Element] [behavior] when [condition].

Example:

- 'Submit button becomes enabled only when all required fields are completed.'
- 'Status badge color changes based on priority: Red for High, Yellow for Medium, Green for Low.'
```

**2. State Transition Annotations**

```markdown
UX_NOTE:
"From [current state], when [trigger], transitions to [new state] with [animation/effect].

Example:

- 'From loading state, when data arrives, fade out skeleton and fade in content over 300ms.'
```

**3. Error Handling Annotations**

```markdown
UX_NOTE:
"When [error condition], show [error message] with [recovery action].

Example:

- 'When API fails, show "Unable to load data" with "Try again" button. Button retries the same request.'
```

**4. Edge Case Annotations**

```markdown
UX_NOTE:
"When [edge condition], handle by [solution].

Example:

- 'When customer name exceeds 50 characters, truncate with ellipsis and show full name on hover.'
- 'When list has 0 items, show empty state with CTA to add first item.'
```

**5. Accessibility Annotations**

```markdown
UX_NOTE:
"[Accessibility requirement for this element].

Example:

- 'Modal traps focus until closed. Escape key closes modal. First focusable element receives focus on open.'
```

### Dev Note Structure

Dev notes are for technical implementation details that don't affect UX:

```markdown
DEV_NOTE:
"[Technical requirement not visible to user]

Example:

- 'Use virtualization for lists over 50 items.'
- 'Cache this data for 5 minutes, then refresh.'
- 'Debounce search input at 300ms.'
```

### Annotation Completeness Checklist

Before dispatching, verify:

| Check                     | Question                          | Pass Criteria |
| ------------------------- | --------------------------------- | ------------- |
| Every interactive element | Is click/tap behavior documented? | ✓ Yes or N/A  |
| Every dynamic element     | Is state change documented?       | ✓ Yes or N/A  |
| Every data field          | Is display format documented?     | ✓ Yes or N/A  |
| Every error path          | Is error + recovery documented?   | ✓ Yes or N/A  |
| Every empty state         | Is message + CTA documented?      | ✓ Yes or N/A  |
| Every validation          | Is error message specific?        | ✓ Yes or N/A  |

### Annotation Template Per Screen

```markdown
UX_NOTE:
"[Primary UX decision for this screen - the WHY]

INTERACTIONS:

- [Element]: [behavior on interaction]
- [Element]: [behavior on interaction]

STATES:

- Loading: [what user sees]
- Empty: [message + CTA]
- Error: [message + recovery]
- Populated: [default behavior]

EDGE CASES:

- [Edge condition]: [how handled]

ACCESSIBILITY:

- [A11y requirement]
```

---

## Information Hierarchy Determination

### Core Principle

**Every data field has a weight based on domain context, not visual preference.**

### Classification System

| Level         | Definition                                                                 | Visual Treatment                                            |
| ------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **PRIMARY**   | Decision-driving information. User needs this to take action.              | Largest text, bold, prominent position (top-left or center) |
| **SECONDARY** | Contextual information. Supports the decision but doesn't drive it.        | Normal weight, badge or right-aligned, smaller size         |
| **TERTIARY**  | Reference information. Nice to have but not critical for immediate action. | Muted color, smaller text, lower position                   |

### Domain Context Questions

For each field, ask:

| Question                                                 | If YES →  |
| -------------------------------------------------------- | --------- |
| "Does the user need this to make their NEXT decision?"   | PRIMARY   |
| "Would missing this cause a wrong decision?"             | PRIMARY   |
| "Does this help explain WHY they're seeing this screen?" | SECONDARY |
| "Is this for verification after the decision is made?"   | SECONDARY |
| "Is this only needed occasionally or by power users?"    | TERTIARY  |
| "Is this for compliance/audit purposes?"                 | TERTIARY  |

### Domain-Specific Priority Patterns

**Sales/CRM Domain:**
| Priority | Field Types |
|----------|-------------|
| PRIMARY | Customer name, Deal value, Next action, Status |
| SECONDARY | Last contact, Source, Assigned rep |
| TERTIARY | Created date, Internal notes, Tags |

**Healthcare Domain:**
| Priority | Field Types |
|----------|-------------|
| PRIMARY | Patient name, Allergies, Current condition, Vitals |
| SECONDARY | Medications, History, Insurance |
| TERTIARY | Appointment time, Provider notes, Administrative codes |

**Finance Domain:**
| Priority | Field Types |
|----------|-------------|
| PRIMARY | Account balance, Transaction amount, Status, Due date |
| SECONDARY | Account type, Category, Reference number |
| TERTIARY | Timestamp, User ID, System notes |

**Operations/Logistics Domain:**
| Priority | Field Types |
|----------|-------------|
| PRIMARY | Order ID, Status, Priority, Location |
| SECONDARY | Quantity, Carrier, ETA |
| TERTIARY | Weight, Dimensions, Special instructions |

### Data Field Importance Matrix Template

```markdown
## Data Field Importance Matrix

### [Screen ID] - [Screen Name]

| Field        | Importance | Domain Reasoning                               | Visual Treatment       |
| ------------ | ---------- | ---------------------------------------------- | ---------------------- |
| [field name] | PRIMARY    | [WHY this is decision-driving for THIS domain] | [size/weight/position] |
| [field name] | SECONDARY  | [WHY this is supporting context]               | [badge/alignment]      |
| [field name] | TERTIARY   | [WHY this is reference only]                   | [muted/position]       |
```

---

## Output Structure

```
docs/requirements/[FEATURE]-[NUMBER]-[title]/
├── PRD-*.md                    ← Inputs — read ALL before starting
├── MVP-SCOPE.md                ← Read to understand scope
├── uxspec/                     ← @ux-designer produces — modular UXSPEC
│   ├── index.md                ← Overview + navigation + screen inventory
│   ├── simulations.md          ← Phase 1: User simulations per role
│   ├── flows.md                ← Phase 2: Flow maps per primary flow
│   ├── workflow.md             ← Multi-actor workflow docs
│   ├── screens/                ← Screen definitions by wave
│   │   ├── wave-01-foundation.md
│   │   ├── wave-02-module1.md
│   │   └── ...
│   ├── hierarchy-matrix.md     ← Data Field Importance for all screens
│   └── decisions.md            ← UX decisions log + open questions
└── wireframes/                 ← @ux-coder produces under designer's direction
    ├── index.html              ← Navigation hub + screen map
    ├── _shared.css             ← Tailwind config + semantic classes
    └── *.html                  ← Module screens
```

## UXSPEC Modular Files

| File                         | Purpose                                | When to Write            |
| ---------------------------- | -------------------------------------- | ------------------------ |
| `uxspec/index.md`            | Overview, navigation, screen inventory | Last (after all others)  |
| `uxspec/simulations.md`      | User simulations per role              | Phase 1                  |
| `uxspec/flows.md`            | Flow maps per primary flow             | Phase 2                  |
| `uxspec/workflow.md`         | Multi-actor handoffs & dependencies    | Phase 2 (if multi-actor) |
| `uxspec/screens/wave-*.md`   | Screen definitions per wave            | Phase 3                  |
| `uxspec/hierarchy-matrix.md` | Data Field Importance all screens      | Phase 3                  |
| `uxspec/decisions.md`        | UX decisions + open questions          | Throughout               |

## Wave File to Wireframe Mapping

| Wave File                       | Wireframe File              | Screens            |
| ------------------------------- | --------------------------- | ------------------ |
| `screens/wave-01-foundation.md` | `index.html`, `_shared.css` | Navigation, legend |
| `screens/wave-02-module1.md`    | `01-module1.html`           | S-01, S-02, S-03   |

## Key Rules

| Rule                           | Description                                  |
| ------------------------------ | -------------------------------------------- |
| **One wave file per module**   | Screens grouped by wave/module               |
| **Dispatch from wave file**    | Read wave file, write dispatch               |
| **Dispatch is self-contained** | Dispatch contains full specs, not references |
| **Wireframe per module**       | @ux-coder creates one HTML per module        |
| **Flows cross modules**        | index.md shows full journey                  |
