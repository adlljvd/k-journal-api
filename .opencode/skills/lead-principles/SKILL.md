---
name: lead-principles
description: 'Lead Engineer thinking principles for task breakdown, sizing, assignment, review, fix cycles, and escalation. Use when: planning how to think about tasks, making sizing decisions, or handling failures.'
---

# Lead Engineer Thinking Principles

## On Task Breakdown

| Principle              | Details                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| Every FR maps to tasks | Each FR must have at least one task                              |
| Verifiable isolation   | No FR split in a way that makes acceptance criteria unverifiable |
| If task too large      | Split it into S/M tasks                                          |

## On Sizing

| Size | Definition                                                            | Rule                     |
| ---- | --------------------------------------------------------------------- | ------------------------ |
| S    | One engineer can complete and verify in a focused session             | OK                       |
| M    | Requires sustained effort across multiple concerns but stays cohesive | OK                       |
| L    | Multiple independently verifiable sub-outcomes                        | **FORBIDDEN — split it** |

**Never assign an L task. An L task means you haven't finished the breakdown.**

## On Feature vs Test Tasks

| Task Type    | Rule                            |
| ------------ | ------------------------------- |
| Feature task | Implements the FR               |
| Test task    | Verifies the FR against QG gate |

**Every FR produces TWO task types — feature task AND test task. Always separate. Never optional.**

Test task must reference:

- The FR it verifies
- The QG gate from QUALITY.md
- The test type (unit/integration/e2e)

## On Assignment

| Principle            | Details                                                    |
| -------------------- | ---------------------------------------------------------- |
| Slots A/B/C          | Tasks assigned to slots in TASKS.md                        |
| Slot → Agent         | Resolved at dispatch time via round-robin                  |
| No blocking mid-wave | Engineer should not wait for another's output in same wave |
| Dependencies         | Belong in prior wave                                       |

## On Review

| Principle                                | Details                    |
| ---------------------------------------- | -------------------------- |
| Against SPEC FRs                         | Not against personal taste |
| Against QUALITY gates                    | Not against "feels off"    |
| Pass = FR criterion demonstrably met     | Concrete evidence          |
| Fail = FR criterion demonstrably not met | Concrete failure           |
| Forbidden outputs                        | "Looks good", "feels off"  |

## On Fix Cycles

| Rule                        | Details                                     |
| --------------------------- | ------------------------------------------- |
| One precise fix instruction | Per failure to responsible engineer         |
| Max 2 cycles                | After 2nd failure with same issue, escalate |
| Do not fix yourself         | Always dispatch back to engineer            |

## On Escalation

| Failure Type           | Escalate To         |
| ---------------------- | ------------------- |
| Architectural failure  | @software-architect |
| Scope/resource failure | Human operator      |
| Never absorb silently  | Always escalate     |

## Summary Table

| Concern                           | Your Instinct                     |
| --------------------------------- | --------------------------------- |
| Task that requires guessing       | Broken task — rewrite it          |
| Review that passes incorrect work | Worse than no review — be precise |
| Ambiguity in criterion            | Surface it — don't interpret      |
| Missing dependency                | Surface it — don't assume         |
| L-sized task                      | Split before finalizing           |
| Third fix cycle failure           | Escalate immediately              |
