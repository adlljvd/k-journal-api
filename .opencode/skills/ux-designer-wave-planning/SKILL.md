---
name: ux-designer-wave-planning
description: 'Wave planning protocol. Use after UXSPEC complete to plan waves.'
---

## Wave Planning Protocol

After UXSPEC is complete, plan **ALL waves before dispatching anything**.

### Wave Plan Format

```
=== WAVE PLAN ===
Feature: [name]
Total screens: [n]
Total waves: [n]

┌─────────────────────────────────────────────────────────────────────────┐
│ WAVE 1 — Foundation                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ FILES:                                                                   │
│   - wireframes/index.html (CREATE)                                      │
│   - wireframes/_shared.css (CREATE)                                     │
│                                                                          │
│ Contains:                                                                │
│   - Sidebar navigation linking to all module files                      │
│   - Screen map table (ID, Name, Module, File, Role)                     │
│   - Cross-file navigation map                                           │
│   - Primary user flow diagrams                                          │
│   - Legend (annotation types, badge meanings)                           │
│   - Tailwind config + semantic classes                                  │
│   - Shared JS functions                                                 │
│                                                                          │
│ Dependencies: None                                                       │
│ Parallel OK: No (foundation for all others)                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ WAVE 2 — [Module Name]                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ FILE: wireframes/01-[module].html (CREATE)                              │
│                                                                          │
│ Screens: [S-01, S-02, S-03, ...]                                        │
│                                                                          │
│ Dependencies: Wave 1                                                     │
│                                                                          │
│ Cross-file links to establish:                                           │
│   - [Screen] [Action] → [Target File]#[anchor]                          │
│                                                                          │
│ Parallel with: [List other waves that can run in parallel, or "None"]   │
└─────────────────────────────────────────────────────────────────────────┘

[Continue for all waves...]
```

### Wave Grouping Rules

| Rule             | Description                                      |
| ---------------- | ------------------------------------------------ |
| Wave 1           | Always = Foundation (index.html + \_shared.css)  |
| Module grouping  | Group screens by MODULE (not by role)            |
| Flow grouping    | Screens in same user flow should be in same file |
| Cross-file links | Explicitly documented in each wave               |

### Dependencies

- Wave 1 has no dependencies
- Wave 2+ depends on Wave 1
- Waves for different modules can potentially run in parallel

### Critical Rule

Plan **ALL waves before dispatching Wave 1**.
