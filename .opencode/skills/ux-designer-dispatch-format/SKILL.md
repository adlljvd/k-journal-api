---
name: ux-designer-dispatch-format
description: 'Dispatch format to @ux-coder. Use when dispatching waves.'
---

## Dispatch Format

Dispatch one wave at a time. Use this exact format:

```markdown
DISPATCH → @ux-coder | Wave [n]/[total]

FILES: wireframes/[filename].html (CREATE | APPEND)

CROSS-FILE LINKS:

- [Source screen] [action] → [target file]#[anchor]
- Or: None this wave

SCREEN: S-01 — [Screen Name]
META: [module] | [role] | [device] | [states]
PURPOSE: [what this screen achieves for user]

HIERARCHY:
Primary: [field] - [domain reason]
Secondary: [fields] - [domain reason]
Tertiary: [fields] - [domain reason]

LAYOUT: [conceptual description]
COMPONENTS: [list with purposes]

STATES:
Populated: [sample data desc]
Loading: [skeleton/spinner intent]
Empty: 📭 "Title" - "Body" [CTA]
Error: ❌ "Title" - "Body" [CTA]

INTERACTIONS: [behaviors]
NAVIGATION: [triggers → destinations]

---

SCREEN: S-02 — [Next Screen]
[Repeat structure]

END WAVE [n]
```

---

## Key Principle: Conceptual, Not Technical

### Designer Provides vs Coder Determines

| Element   | Designer Gives                       | Coder Determines                         |
| --------- | ------------------------------------ | ---------------------------------------- |
| Purpose   | "Sales rep identifies leads quickly" | Visual treatment to support purpose      |
| Hierarchy | "Lead Score is PRIMARY"              | How to emphasize (size, color, position) |
| Layout    | "List with prominent items"          | Exact grid, columns, spacing             |
| Behavior  | "Click opens detail"                 | Hover states, transitions                |
| States    | "Empty: show this message"           | Visual design of empty state             |

### Examples: Conceptual vs Technical

| ❌ Too Technical        | ✓ Conceptual                         |
| ----------------------- | ------------------------------------ |
| "bg-blue-600 py-3 px-6" | "Primary action, should stand out"   |
| "grid-cols-3 gap-4"     | "Three-column layout for comparison" |
| "text-lg font-bold"     | "Customer name is decision-driving"  |
| "p-4 rounded-lg shadow" | "Card container for each item"       |
| "w-300px sidebar"       | "Filter panel on left side"          |

---

## Required Screen Elements

| Element     | Purpose                                    | Required      |
| ----------- | ------------------------------------------ | ------------- |
| META        | Screen ID, module, role, device, states    | ✓ Always      |
| PURPOSE     | Why this screen exists                     | ✓ Always      |
| HIERARCHY   | Field importance with domain justification | ✓ Always      |
| UX_NOTE     | UX decisions with behavior docs            | ✓ Always      |
| DEV_NOTE    | Technical details                          | If applicable |
| FLOW        | Source and destination                     | ✓ Always      |
| LAYOUT      | Plain language layout intent               | ✓ Always      |
| COMPONENTS  | Component purposes                         | ✓ Always      |
| STATES      | Populated, Loading, Empty, Error           | ✓ Always      |
| INTERACTIVE | Interactive behaviors                      | If applicable |
| NAVIGATION  | Navigation triggers and destinations       | If applicable |

---

## PURPOSE Section

Every screen MUST have a PURPOSE statement.

**Good Examples:**

```markdown
PURPOSE: "Sales rep quickly identifies which leads to prioritize and take action on."
PURPOSE: "Clinician reviews patient safety information before making treatment decision."
PURPOSE: "Manager approves or rejects pending requests in bulk."
```

**Bad Examples (DO NOT USE):**

```markdown
❌ PURPOSE: "Display lead list"
❌ PURPOSE: "Show patient info"
❌ PURPOSE: "Approval screen"
```

---

## HIERARCHY Section

MANDATORY for every screen.

```markdown
HIERARCHY:
Primary: [field name] - [domain-specific reason]
Secondary: [field names] - [domain-specific reason]
Tertiary: [field names] - [domain-specific reason]
```

**Good Examples:**

```markdown
HIERARCHY:
Primary: Customer Name - Sales needs quick ID to know who they're calling
Secondary: Account Status, Lead Score - Triage context for prioritization
Tertiary: Created Date, Assigned Rep - Reference info, not action-driving

HIERARCHY:
Primary: Patient Name - Clinical identification, safety-critical
Secondary: Allergies, Current Medications - Safety context for treatment
Tertiary: Insurance Status - Billing, not clinical decision
```

**Bad Examples (DO NOT USE):**

```markdown
❌ HIERARCHY:
Primary: Customer Name - Important field
Secondary: Account Status - User needs to see this
Tertiary: Created Date - Not as important
```

---

## LAYOUT Section

Describe layout intent, not exact measurements.

**Good Examples:**

```markdown
LAYOUT: "Table with rows for each lead. Primary fields prominent on left. Actions on right. Filter bar at top, pagination at bottom."
LAYOUT: "Card grid showing products. Image prominent, price badge visible. Quick add button on hover. Responsive to 2-3 columns on tablet."
LAYOUT: "Master-detail layout. List on left, detail panel on right. Selected item highlighted."
```

**Bad Examples (DO NOT USE):**

```markdown
❌ LAYOUT: "flex container with 300px sidebar and flex-1 main area"
❌ LAYOUT: "grid-cols-4 gap-4 p-6"
❌ LAYOUT: "max-w-7xl mx-auto px-4"
```

---

## STATES Requirements

All 4 states must be documented with EXACT text for messages.

| State     | What Coder Needs              |
| --------- | ----------------------------- |
| POPULATED | Description with sample data  |
| LOADING   | Intent (skeleton/spinner)     |
| EMPTY     | EXACT Title + Body + CTA text |
| ERROR     | EXACT Title + Body + CTA text |

**Empty state format:**

```markdown
EMPTY:
Icon: 📭
Title: "Your lead queue is empty"
Body: "New MQLs will appear here when marketing qualifies them"
CTA: View all leads
```

**Error state format:**

```markdown
ERROR:
Icon: ❌
Title: "Unable to load leads"
Body: "Please check your connection and try again"
CTA: Retry
```

---

## Critical Rules

| Rule                 | Requirement                                 |
| -------------------- | ------------------------------------------- |
| PURPOSE              | Must describe what screen achieves for user |
| HIERARCHY            | Must include domain-specific reasoning      |
| LAYOUT               | Plain language intent, not Tailwind classes |
| UX_NOTE              | Must include behavior documentation         |
| Empty/Error messages | Must be EXACT text, no placeholders         |
| All states           | All 4 states must be documented             |

---

## Pre-Dispatch Checklist

| Check                        | Question                               |
| ---------------------------- | -------------------------------------- |
| ✓ PURPOSE present?           | Every screen has purpose statement     |
| ✓ HIERARCHY domain-specific? | Not generic like "important field"     |
| ✓ LAYOUT conceptual?         | No Tailwind classes or pixel values    |
| ✓ All behaviors documented?  | Every interactive element has behavior |
| ✓ All states documented?     | All 4 states with specific text        |
| ✓ All messages specific?     | No "No data" or "Error occurred"       |

---

## Remember

**Designer provides:**

- WHAT the screen achieves
- WHY decisions were made
- WHICH fields are important
- HOW users interact

**Coder determines:**

- HOW to visually emphasize PRIMARY
- WHAT colors/sizes/spacing to use
- HOW to structure the layout
- WHAT visual patterns to apply
