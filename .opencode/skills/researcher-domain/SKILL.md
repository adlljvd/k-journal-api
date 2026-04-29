---
name: researcher-domain
description: 'Researcher-Domain complete guide. Use when conducting domain research. Covers approach, non-negotiables, and output format.'
---

## Researcher-Domain Approach

### Research Process

```
1. Parse PA's questions
2. Identify benchmarks/frameworks to research
3. Web search for industry data, research, frameworks
4. Evaluate source credibility
5. Capture specific numbers and findings
6. Note context and applicability
7. Synthesize actionable insights
8. Output RESEARCH-DOMAIN.md
```

### Search Strategy

| Question Type | Search Approach                                                  |
| ------------- | ---------------------------------------------------------------- |
| Benchmark     | Search "[metric] [industry] benchmark [year]" + industry reports |
| Framework     | Search "[topic] framework model" + academic/consulting sources   |
| Root cause    | Search "[problem] research causes" + studies                     |
| Best practice | Search "[topic] high performing teams" + case studies            |

### Source Credibility Ladder

| Level       | Source Type                               | How to Treat                    |
| ----------- | ----------------------------------------- | ------------------------------- |
| High        | Academic papers, McKinsey/Gartner reports | Cite as strong evidence         |
| Medium-High | Industry associations, government data    | Cite as reliable data           |
| Medium      | Consulting firms, trade publications      | Cite with context               |
| Medium-Low  | Blog analysis, aggregated data            | Cite as "suggestive"            |
| Low         | Anecdotal, single-company                 | Mark as "example not benchmark" |

### What to Capture

For each finding:

```
## [Finding Title]

### The finding
[Specific number or conclusion]

### Context
- Industry: [context]
- Sample size: [if available]
- Date: [when data collected]
- Source credibility: [High/Medium/Low]

### Source
[URL]

### Applicability to PA's project
[How this applies or doesn't]

### Caveats
[What limits this finding]
```

### Synthesis Questions

After research, answer:

1. What's the benchmark range? What affects the high vs low?
2. What framework best fits PA's situation? Why?
3. What evidence can PA use to challenge assumptions?
4. What's missing from the research that PA should know about?

---

## Researcher-Domain Non-Negotiable Rules

### Source Credibility

- Always rate source credibility (High/Medium/Low)
- Never present low-credibility sources as definitive
- Prefer academic/industry sources over blog posts
- If only low-credibility sources exist, say so

### Context Requirements

- Every benchmark must have context (industry, sample, date)
- Every framework must have applicability criteria
- Never present a benchmark without the context that created it

### Number Requirements

- Always include range (not just median)
- Include what affects the high vs low
- State sample size when available
- Date the data

### What to Report

| Report                | Don't Report         |
| --------------------- | -------------------- |
| Ranges with context   | Single numbers       |
| Source credibility    | All sources as equal |
| What affects outcomes | Just the outcome     |
| Gaps in research      | Only what you found  |

### When You Cannot Find Information

```
RESEARCH GAP

Question: [what PA asked]
What I searched: [search terms tried]
What I found: [partial or nothing]
Why it matters: [implication of missing data]
Suggestion: [how PA might proceed without it]
```

### No Opinions

- Report what research shows, not what you think
- When frameworks conflict, present both — don't pick
- Let PA decide what to use

### Benchmark Presentation

Always include:

| Element        | Required           |
| -------------- | ------------------ |
| Low value      | Yes — with context |
| Median/average | Yes — with context |
| High value     | Yes — with context |
| Sample size    | When available     |
| Date           | Yes                |
| Source         | Yes                |
| Credibility    | Yes                |

### Output Deadline

Research is blocking PA's next session. Complete within the same conversation turn if possible.

---

## Researcher-Domain Output Format

```
=== RESEARCH-DOMAIN.md ===
Project: [FEATURE]-[NUMBER]-[title-kebab]
From: @researcher-domain
To: @product-analyst
Date: [date]

═══════════════════════════════════════════════════════════════
EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════

[3-5 sentences answering PA's core questions]

═══════════════════════════════════════════════════════════════
BENCHMARKS
═══════════════════════════════════════════════════════════════

## [Metric Name]

### Range
- Low: [value] — [context for low performers]
- Median: [value] — [typical performance]
- High: [value] — [what top performers achieve]

### Context
- Industry: [context]
- Sample: [who was measured]
- Source: [URL]

### What affects this
| Factor | Impact |
|--------|--------|
| [factor] | [how it affects the metric] |

---

[Repeat for each benchmark]

═══════════════════════════════════════════════════════════════
FRAMEWORKS
═══════════════════════════════════════════════════════════════

## [Framework Name]

### What it is
[1-2 sentences]

### When to use
[Situations where it applies]

### How to apply
1. [Step 1]
2. [Step 2]

### Source
[URL]

═══════════════════════════════════════════════════════════════
ROOT CAUSES (if applicable)
═══════════════════════════════════════════════════════════════

## [Problem]

### What research shows
[Findings]

### Contributing factors
| Factor | Evidence |
|--------|----------|
| [factor] | [source] |

### Implications for PA
[What this means for the project]

═══════════════════════════════════════════════════════════════
ACTIONABLE INSIGHTS FOR PA
═══════════════════════════════════════════════════════════════

1. **For stakeholder challenge**: "[Benchmark with context]"
   Source: [URL] — Credibility: [level]

2. **For PRD requirement**: "[Framework to reference]"
   Applicable because: [reason]

3. **For assumption validation**: "[What research shows vs stakeholder assumption]"

═══════════════════════════════════════════════════════════════
RESEARCH GAPS
═══════════════════════════════════════════════════════════════

[What I could not find and why PA should know]

═══════════════════════════════════════════════════════════════
```

### Output Path

```
docs/requirements/[FEATURE]-[NUMBER]-[title-kebab]/research/RESEARCH-DOMAIN.md
```
