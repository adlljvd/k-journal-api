---
name: ux-designer-uxspec
description: '@ux-designer UXSPEC modular format. Use when writing UXSPEC files. Covers index format, wave format, and when to write each file.'
---

## UXSPEC Modular Structure

```
uxspec/
├── index.md                ← Overview + navigation hub (write last)
├── simulations.md          ← Phase 1: User simulations
├── flows.md                ← Phase 2: Flow maps
├── workflow.md             ← Phase 2: Multi-actor workflow (if applicable)
├── screens/
│   ├── wave-01-foundation.md
│   ├── wave-02-module1.md
│   └── ...
├── hierarchy-matrix.md     ← Phase 3: All screens field importance
└── decisions.md            ← Throughout: UX decisions + questions
```

## When to Write Each File

| Phase      | Files                                      |
| ---------- | ------------------------------------------ |
| Phase 1    | `simulations.md`                           |
| Phase 2    | `flows.md`, `workflow.md` (if multi-actor) |
| Phase 3    | `screens/wave-*.md`, `hierarchy-matrix.md` |
| Throughout | `decisions.md`                             |
| Last       | `index.md`                                 |

---

## index.md Format

Navigation hub written last after all other files.

```markdown
=== UXSPEC INDEX: [Feature Name] ===
PRD refs: docs/requirements/[FEATURE]-[NUMBER]-[title]/PRD-\*.md
Wireframes: docs/requirements/[FEATURE]-[NUMBER]-[title]/wireframes/

---

## Quick Navigation

| Section          | File                          | Purpose          |
| ---------------- | ----------------------------- | ---------------- |
| User Simulations | simulations.md                | Per-role journey |
| Flow Maps        | flows.md                      | Flow diagrams    |
| Wave 1 Screens   | screens/wave-01-foundation.md | Foundation       |
| ...              | ...                           | ...              |

---

## Screen Inventory

| ID   | Screen Name | Wave | File                  | Module | Role | Reached From | Goes To |
| ---- | ----------- | ---- | --------------------- | ------ | ---- | ------------ | ------- |
| S-01 | Login       | 1    | wave-01-foundation.md | -      | All  | -            | S-02    |
| ...  | ...         | ...  | ...                   | ...    | ...  | ...          | ...     |

---

## Wave Summary

| Wave | Module     | Screens | Wireframe File           |
| ---- | ---------- | ------- | ------------------------ |
| 1    | Foundation | S-01    | index.html, \_shared.css |
| ...  | ...        | ...     | ...                      |

---

## Summary

- **Total screens**: [n]
- **Total waves**: [n]
- **Modules**: [list]
```

---

## screens/wave-XX-\*.md Format

Detailed specs for screens in one module/wave. Source for dispatch content.

```markdown
=== WAVE [n] SCREENS: [Module Name] ===
Wireframe: wireframes/[nn]-[module].html

---

## S-XX [Screen Name]

### Data Field Importance Matrix

| Field   | Importance | Domain Reasoning                   | Visual Treatment       |
| ------- | ---------- | ---------------------------------- | ---------------------- |
| [field] | PRIMARY    | WHY decision-driving for THIS role | [size/weight/position] |
| [field] | SECONDARY  | WHY supporting context             | [badge/alignment]      |
| [field] | TERTIARY   | WHY reference only                 | [muted/position]       |

### Screen Definition

**UX structure decision:**
Primary action: [what]
Information hierarchy: [first glance → scan → deep dive]
Principle applied: [name + why]
PRD challenge: [what changed from skeleton, or "none"]
Flow connection: ← from [source] / → to [destination]

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Or "None - all navigation within this file" |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |

**Actions:**
| Action | Type | Placement | Result |

**States:**
_Loading_: [description]
_Empty_: [exact message + CTA]
_Populated_: [default state]
_Error_: [exact message + recovery path]

**Navigation:**
Success → [where + why]
Cancel → [where]

---

## Wave Notes

[Cross-screen considerations]

## Cross-File Links Summary

| From Screen                           | Action | To Screen | Wireframe File |
| ------------------------------------- | ------ | --------- | -------------- |
| [Only links to OTHER wireframe files] |
```

---

## Data Field Importance Matrix Rules

| Importance | Meaning            | Example Reasoning                                  |
| ---------- | ------------------ | -------------------------------------------------- |
| PRIMARY    | Decision-driving   | "Sales needs quick ID to know who they're calling" |
| SECONDARY  | Supporting context | "Helps confirm the lead is correct"                |
| TERTIARY   | Reference only     | "Timestamp for audit trail"                        |

**Bad reasoning (DO NOT USE):**

- "Important information"
- "User needs to see this"

---

## State Requirements (All 4 Required)

| State     | Required Content                       |
| --------- | -------------------------------------- |
| Loading   | Skeleton or spinner description        |
| Empty     | Icon + Title + Body + CTA (exact text) |
| Populated | Default state description              |
| Error     | Icon + Title + Body + CTA (exact text) |

**Never use generic messages:**

- ❌ "No data"
- ❌ "Error occurred"
- ✓ "Your lead queue is empty. New MQLs will appear here when marketing qualifies them."

---

## Size Targets

| File       | Target Lines  |
| ---------- | ------------- |
| index.md   | ~100 lines    |
| wave-\*.md | 200-300 lines |

---

## Output Validation Checklist

- ✓ All phases complete (simulations.md, flows.md)
- ✓ All wave files written
- ✓ Every screen has hierarchy matrix
- ✓ Every workflow documented
- ✓ Index created last
- ✓ All files cross-referenced
