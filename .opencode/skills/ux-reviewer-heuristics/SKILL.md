---
name: ux-reviewer-heuristics
description: "Heuristic evaluation. Nielsen's 10 heuristics with severity ratings."
---

## Heuristic Evaluation Framework

### Core Principle

**Systematic review against established UX principles catches issues that ad-hoc review misses.**

### Nielsen's 10 Usability Heuristics

Each heuristic is evaluated with severity rating:

- **0** = Not a problem
- **1** = Cosmetic problem only
- **2** = Minor usability problem
- **3** = Major usability problem
- **4** = Usability catastrophe

---

## Heuristic 1: Visibility of System Status

**Definition**: The system should always keep users informed about what is going on.

### Checklist

| Check            | Question                                  | Pass Criteria                 |
| ---------------- | ----------------------------------------- | ----------------------------- |
| Loading states   | Does user know when data is loading?      | Skeleton or spinner visible   |
| Processing       | Does user know when action is processing? | Progress indicator or status  |
| Success/Failure  | Does user know when action completes?     | Confirmation or error message |
| Current location | Does user know where they are?            | Breadcrumb or page title      |

### Enterprise Considerations

- Long-running operations need progress indication
- Background processes need completion notification
- Multi-step workflows need step indicators

### Severity Examples

| Issue                                              | Severity  |
| -------------------------------------------------- | --------- |
| No loading indicator, user sees blank              | 3 - Major |
| Success message appears and disappears too quickly | 2 - Minor |
| Progress bar missing for 30-second operation       | 3 - Major |

---

## Heuristic 2: Match Between System and Real World

**Definition**: The system should speak the users' language, with words, phrases and concepts familiar to the user.

### Checklist

| Check       | Question                                        | Pass Criteria                 |
| ----------- | ----------------------------------------------- | ----------------------------- |
| Terminology | Does the system use domain language?            | Terms match user's vocabulary |
| Jargon      | Is technical jargon avoided or explained?       | User-friendly language        |
| Metaphors   | Do metaphors match user's mental model?         | Familiar concepts             |
| Order       | Does information flow match real-world process? | Natural sequence              |

### Enterprise Considerations

- Different roles may use different terminology
- Industry-specific language must be accurate
- Acronyms must be defined or universally understood

### Severity Examples

| Issue                                                      | Severity        |
| ---------------------------------------------------------- | --------------- |
| Medical app uses wrong terminology for diagnosis           | 4 - Catastrophe |
| Finance app uses developer terms instead of business terms | 3 - Major       |
| Inconsistent terminology across screens                    | 2 - Minor       |

---

## Heuristic 3: User Control and Freedom

**Definition**: Users should be able to easily escape from unintended situations.

### Checklist

| Check  | Question                             | Pass Criteria                          |
| ------ | ------------------------------------ | -------------------------------------- |
| Cancel | Can users cancel ongoing operations? | Cancel button available                |
| Undo   | Can users undo recent actions?       | Undo mechanism for destructive actions |
| Back   | Can users navigate back easily?      | Back button works as expected          |
| Exit   | Can users exit modals/dialogs?       | Close button or escape key             |

### Enterprise Considerations

- Destructive actions must have confirmation
- Long forms need save draft capability
- Workflow steps need navigation freedom

### Severity Examples

| Issue                           | Severity        |
| ------------------------------- | --------------- |
| Delete without confirmation     | 4 - Catastrophe |
| No way to exit modal            | 3 - Major       |
| No cancel during long operation | 3 - Major       |

---

## Heuristic 4: Consistency and Standards

**Definition**: Users should not have to wonder whether different words, situations, or actions mean the same thing.

### Checklist

| Check                   | Question                              | Pass Criteria        |
| ----------------------- | ------------------------------------- | -------------------- |
| Visual consistency      | Do similar elements look similar?     | Consistent styling   |
| Terminology consistency | Do same concepts use same words?      | One term per concept |
| Behavior consistency    | Do similar actions work the same way? | Predictable patterns |
| Platform standards      | Does it follow platform conventions?  | Standard UI patterns |

### Enterprise Considerations

- Design system compliance
- Cross-module consistency
- Organization-wide terminology standards

### Severity Examples

| Issue                                             | Severity  |
| ------------------------------------------------- | --------- |
| "Delete" and "Remove" used interchangeably        | 2 - Minor |
| Same action has different UI in different modules | 3 - Major |
| Primary button position varies across screens     | 2 - Minor |

---

## Heuristic 5: Error Prevention

**Definition**: Design should prevent errors from occurring in the first place.

### Checklist

| Check        | Question                                | Pass Criteria          |
| ------------ | --------------------------------------- | ---------------------- |
| Confirmation | Are destructive actions confirmed?      | Confirmation dialog    |
| Constraints  | Are invalid inputs prevented?           | Input validation       |
| Defaults     | Are sensible defaults provided?         | Pre-filled safe values |
| Warnings     | Are warnings shown before errors occur? | Proactive alerts       |

### Enterprise Considerations

- High-stakes actions need multiple confirmations
- Complex forms need real-time validation
- Batch operations need dry-run preview

### Severity Examples

| Issue                             | Severity        |
| --------------------------------- | --------------- |
| No confirmation for bulk delete   | 4 - Catastrophe |
| No validation for required fields | 3 - Major       |
| No warning before session timeout | 3 - Major       |

---

## Heuristic 6: Recognition Rather Than Recall

**Definition**: Minimize the user's memory load by making objects, actions, and options visible.

### Checklist

| Check             | Question                                   | Pass Criteria            |
| ----------------- | ------------------------------------------ | ------------------------ |
| Visible options   | Are choices visible rather than hidden?    | No need to remember      |
| Context preserved | Is context preserved across navigation?    | Previous state visible   |
| Recent items      | Are recent items accessible?               | Recent history available |
| Help available    | Is help available without leaving context? | Inline help or tooltips  |

### Enterprise Considerations

- Complex workflows need persistent context
- Frequently used items need quick access
- Status information needs visibility

### Severity Examples

| Issue                                          | Severity     |
| ---------------------------------------------- | ------------ |
| User must remember values from previous screen | 3 - Major    |
| No way to see recently accessed records        | 2 - Minor    |
| Dropdown options hidden until clicked          | 1 - Cosmetic |

---

## Heuristic 7: Flexibility and Efficiency of Use

**Definition**: Accelerators may speed up the interaction for the expert user.

### Checklist

| Check         | Question                                | Pass Criteria              |
| ------------- | --------------------------------------- | -------------------------- |
| Shortcuts     | Are keyboard shortcuts available?       | Power user shortcuts       |
| Customization | Can users customize their view?         | Preferences available      |
| Macros        | Can users automate repetitive tasks?    | Saved actions or templates |
| Quick actions | Are frequent actions easily accessible? | Quick action buttons       |

### Enterprise Considerations

- Power users need efficiency features
- Repetitive tasks need automation
- Frequently accessed items need shortcuts

### Severity Examples

| Issue                                    | Severity  |
| ---------------------------------------- | --------- |
| No way to save frequent filters          | 2 - Minor |
| No keyboard shortcuts for common actions | 2 - Minor |
| Cannot customize dashboard layout        | 2 - Minor |

---

## Heuristic 8: Aesthetic and Minimalist Design

**Definition**: Dialogues should not contain information which is irrelevant or rarely needed.

### Checklist

| Check          | Question                             | Pass Criteria          |
| -------------- | ------------------------------------ | ---------------------- |
| Relevance      | Is all information relevant to task? | No unnecessary data    |
| Visual noise   | Is the design clean and focused?     | Not cluttered          |
| Primary action | Is primary action clear?             | One obvious action     |
| Scannability   | Can users scan quickly?              | Clear visual hierarchy |

### Enterprise Considerations

- Dense data displays need strategic hierarchy
- TERTIARY information should not compete with PRIMARY
- Action-focused screens should minimize data

### Severity Examples

| Issue                                 | Severity  |
| ------------------------------------- | --------- |
| Too many competing elements, no focus | 3 - Major |
| Irrelevant data on action screen      | 2 - Minor |
| Visual clutter prevents scanning      | 3 - Major |

---

## Heuristic 9: Help Users Recognize, Diagnose, and Recover from Errors

**Definition**: Error messages should be expressed in plain language, indicate the problem, and suggest a solution.

### Checklist

| Check              | Question                        | Pass Criteria       |
| ------------------ | ------------------------------- | ------------------- |
| Plain language     | Are errors in user language?    | No technical jargon |
| Problem identified | Does error say what went wrong? | Specific problem    |
| Solution offered   | Does error say how to fix?      | Actionable guidance |
| No blame           | Does error not blame the user?  | Constructive tone   |

### Enterprise Considerations

- System errors need user-friendly translation
- Validation errors need specific guidance
- Recovery path must be clear

### Severity Examples

| Issue                             | Severity        |
| --------------------------------- | --------------- |
| "Error 500" with no guidance      | 4 - Catastrophe |
| "Invalid input" without specifics | 3 - Major       |
| "User error" blaming language     | 2 - Minor       |

---

## Heuristic 10: Help and Documentation

**Definition**: Help and documentation should be easy to search, focused on the user's task, and list concrete steps.

### Checklist

| Check        | Question                       | Pass Criteria         |
| ------------ | ------------------------------ | --------------------- |
| Findable     | Is help easily accessible?     | Help icon or menu     |
| Searchable   | Can users search help?         | Search function       |
| Task-focused | Is help organized by task?     | Task-based structure  |
| Concrete     | Does help show specific steps? | Step-by-step guidance |

### Enterprise Considerations

- Complex features need inline help
- Onboarding needs guided tours
- Documentation needs to be context-aware

### Severity Examples

| Issue                                 | Severity  |
| ------------------------------------- | --------- |
| No help available for complex feature | 3 - Major |
| Help not searchable                   | 2 - Minor |
| Help organized by feature, not task   | 2 - Minor |

---

## Heuristic Evaluation Output

```markdown
=== HEURISTIC EVALUATION: [Screen ID] ===

| #   | Heuristic                           | Score | Issue Found       |
| --- | ----------------------------------- | ----- | ----------------- |
| 1   | Visibility of System Status         | [0-4] | [issue or "None"] |
| 2   | Match Between System and Real World | [0-4] | [issue or "None"] |
| 3   | User Control and Freedom            | [0-4] | [issue or "None"] |
| 4   | Consistency and Standards           | [0-4] | [issue or "None"] |
| 5   | Error Prevention                    | [0-4] | [issue or "None"] |
| 6   | Recognition Rather Than Recall      | [0-4] | [issue or "None"] |
| 7   | Flexibility and Efficiency of Use   | [0-4] | [issue or "None"] |
| 8   | Aesthetic and Minimalist Design     | [0-4] | [issue or "None"] |
| 9   | Help Users Recover from Errors      | [0-4] | [issue or "None"] |
| 10  | Help and Documentation              | [0-4] | [issue or "None"] |

TOTAL SCORE: [sum of all scores]
MAXIMUM: 40
SEVERITY DISTRIBUTION:

- Catastrophe (4): [count]
- Major (3): [count]
- Minor (2): [count]
- Cosmetic (1): [count]

CRITICAL ISSUES (Score 3-4):
| Heuristic | Issue | Recommendation |
|-----------|-------|----------------|
```
