=== UX DECISIONS LOG: K-Journal ===
Project: KJOURNAL-001-k-journal-platform
Status: Active
Last Updated: 2026-04-27

═══════════════════════════════════════════════════════════════
OVERVIEW
═══════════════════════════════════════════════════════════════

This document records UX decisions made during the design process.
Each decision includes the context, options considered, and rationale.

---

═══════════════════════════════════════════════════════════════
DECISIONS
═══════════════════════════════════════════════════════════════

## Decision 001: Journal Entry Form as Modal vs Dedicated Page

**Context:** When a user clicks "Add to Journal" from Content Detail, should the form appear as a modal overlay or navigate to a separate page?

**Options Considered:**
1. **Modal overlay** - Form appears over current page
2. **Dedicated page** - Navigate to new URL for entry form
3. **Inline expansion** - Form expands within Content Detail page

**Decision:** Modal overlay (preferred) or dedicated page as fallback

**Rationale:**
- Modal preserves context (user can still see content details)
- Faster interaction for a simple form
- Works well for both "Add" and "Edit" modes
- Fallback to page if modal feels cramped on mobile
- PRD already specifies "modal or dedicated page" - leaving implementation choice

**Impact:**
- Wireframe should show modal version
- Mobile may need page version for better UX

---

## Decision 002: Rating Input Interaction

**Context:** How should users interact with the star rating input (0.5-5.0 with half increments)?

**Options Considered:**
1. **10 clickable positions** - Each star has 2 positions (left half, right half)
2. **Slider** - Drag to select rating
3. **Dropdown** - Select from list of values
4. **Full stars only** - Click whole stars, then toggle half

**Decision:** 10 clickable positions (each star has 2 clickable areas)

**Rationale:**
- Most intuitive for mouse/touch interaction
- Immediate visual feedback
- Matches patterns users know (Letterboxd, Goodreads)
- Half-star increments are discoverable through interaction
- Clearer than slider for precision
- Dropdown adds friction

**Impact:**
- Visual: Show 5 stars, each divided into 2 clickable zones
- Hover state shows what rating will be set
- Clear/Unrate option visible when rating is set

---

## Decision 003: Watch Status Display Order

**Context:** In what order should the 4 watch statuses appear in the selection UI?

**Options Considered:**
1. **Alphabetical** - COMPLETED, DROPPED, PLAN_TO_WATCH, WATCHING
2. **Frequency-based** - COMPLETED first (most common), then WATCHING, etc.
3. **Workflow-based** - PLAN_TO_WATCH → WATCHING → COMPLETED → DROPPED
4. **Action-oriented** - WATCHING first (active), then others

**Decision:** Action-oriented order: WATCHING, COMPLETED, PLAN_TO_WATCH, DROPPED

**Rationale:**
- WATCHING is the active state - most likely update needed
- COMPLETED is the final state - second most common
- PLAN_TO_WATCH is the starting state
- DROPPED is the negative state - least common
- This order puts positive states first
- Matches how users think about their content journey

**Impact:**
- Radio buttons/selection UI should use this order
- Journal filter tabs can use same order

---

## Decision 004: Empty State Tone

**Context:** What tone should empty states use for a K-drama enthusiast audience?

**Options Considered:**
1. **Functional** - "No journal entries found."
2. **Encouraging** - "Your journal is empty. Start by browsing the catalog!"
3. **Enthusiastic** - "Ready to start your K-drama journey? Browse the catalog!"
4. **Playful** - "Nothing here yet! Time to binge some dramas! 🎬"

**Decision:** Encouraging but not overly enthusiastic

**Rationale:**
- K-drama enthusiasts are passionate but not childish
- Clear guidance is more helpful than excitement
- CTA should be actionable: "Browse the catalog" vs "Start your journey"
- Professional enough for public profiles
- PRD copy provided: "Your journal is empty. Start by browsing the catalog!"

**Impact:**
- Use provided PRD copy where available
- Tone should be helpful, clear, actionable
- Avoid excessive enthusiasm or emoji

---

## Decision 005: Profile Favorites Selection Flow

**Context:** How should users select their 4 profile favorites?

**Options Considered:**
1. **From journal directly** - Heart icon in journal toggles profile selection
2. **Separate selection step** - Mark as favorite first, then select for profile
3. **Single combined action** - Marking favorite automatically adds to profile

**Decision:** Separate selection step (matches PRD)

**Rationale:**
- PRD specifies: unlimited favorites, but max 4 for profile display
- This allows users to have many favorites but curate top 4 for display
- Clear separation between "favorite" and "profile showcase"
- Prevents accidental profile changes when marking favorites
- Gives user control over which favorites are most prominent

**Impact:**
- Journal: Toggle favorite (heart icon) - no limit
- Profile Edit: Select up to 4 from favorites for profile display
- Removing favorite from journal also removes from profile favorites

---

## Decision 006: Search Results Behavior

**Context:** Should search results show in a dropdown or navigate to a results page?

**Options Considered:**
1. **Dropdown only** - Show top 10 results in dropdown, no results page
2. **Results page only** - Always navigate to results page
3. **Hybrid** - Dropdown preview + "See all" link to full page

**Decision:** Hybrid approach

**Rationale:**
- Dropdown provides quick access for confident searches
- Full page needed for:
  - "No results" state with content request CTA
  - More than 10 results
  - Mobile where dropdown space is limited
- Matches common search patterns (Google, Amazon)
- PRD specifies both dropdown and results page

**Impact:**
- Header search: Dropdown with top 10 + "See all results" link
- Search page: Full results with filters
- Empty state on both with content request CTA

---

## Decision 007: Admin Request Queue Default Filter

**Context:** What should the default filter be for the admin request queue?

**Options Considered:**
1. **All requests** - Show everything
2. **Pending only** - Show only PENDING requests
3. **Recent only** - Show last 7 days

**Decision:** Pending only as default

**Rationale:**
- Admin's primary job is to process pending requests
- Showing approved/rejected by default adds noise
- Clear visual when all pending requests are processed ("All caught up!")
- Admin can switch to "All" to see history
- FIFO ordering (oldest first) ensures fairness

**Impact:**
- Default view: PENDING filter active
- Badge shows pending count
- "All caught up!" state when no pending

---

## Decision 008: Content Card Click Target

**Context:** Should the entire content card be clickable, or just the title?

**Options Considered:**
1. **Title only** - Only title text is clickable
2. **Entire card** - Click anywhere on card to navigate
3. **Card + button** - Click card for detail, separate button for quick action

**Decision:** Entire card is clickable

**Rationale:**
- Larger click target is better for accessibility
- Mobile-friendly (easier to tap)
- Standard pattern for content cards
- No separate "View" button needed
- Keeps UI clean
- If quick action needed (like Netflix), can add hover button (Phase 2)

**Impact:**
- All content cards have full-card click
- Clear hover state (pointer cursor, slight elevation)
- No separate "View" button

---

## Decision 009: Journal Entry Status Display

**Context:** How prominently should watch status be displayed on journal entries?

**Options Considered:**
1. **Minimal** - Small badge, secondary position
2. **Prominent** - Large badge, primary position
3. **Integrated** - Color-coded background or border

**Decision:** Prominent badge with color coding

**Rationale:**
- Status is the PRIMARY identifier of user's relationship with content
- Users filter by status, so it should be visible at a glance
- Color coding helps quick scanning:
  - WATCHING: Active color (blue/green)
  - COMPLETED: Success color (green)
  - DROPPED: Warning/muted color (gray/red)
  - PLAN_TO_WATCH: Neutral color (gray/blue)
- Status affects rating/review likelihood (COMPLETED most likely to have both)

**Impact:**
- Status badge: prominent position on journal entry card
- Color coding: each status has distinct color
- Filter tabs: same color coding

---

## Decision 010: User Search Scope

**Context:** What fields should user search query?

**Options Considered:**
1. **Username only** - Exact and partial match on username
2. **Username + bio** - Search both fields
3. **All profile data** - Username, bio, favorites

**Decision:** Username only (per PRD)

**Rationale:**
- PRD specifies: "Search queries username field (case-insensitive, partial match)"
- Simpler implementation for MVP
- Username is the primary identifier
- Bio search adds complexity without clear value
- Profile discovery is secondary feature

**Impact:**
- User search: Username field only
- Case-insensitive, partial match
- Results show: Avatar, username, bio snippet (for context, not search)

---

═══════════════════════════════════════════════════════════════
OPEN QUESTIONS
═══════════════════════════════════════════════════════════════

## Question 001: Homepage Featured Content Display

**Question:** Should featured content be a carousel or static grid?

**Context:**
- PRD specifies "Featured content section (carousel or grid)"
- Carousel allows more featured items in less space
- Grid shows all featured items at once

**Options:**
1. **Carousel** - Swipeable, auto-rotate optional
2. **Static grid** - 4-6 items visible at once
3. **Hero + grid** - Large hero item + smaller grid

**Status:** OPEN - Waiting for implementation phase decision

**Recommendation:** Hero + grid for visual impact and discoverability

---

## Question 002: Journal Entry Form Mobile Behavior

**Question:** Should the journal entry form be a modal or bottom sheet on mobile?

**Context:**
- Modals can feel cramped on mobile
- Bottom sheets are mobile-native pattern
- Full page is always an option

**Options:**
1. **Modal** - Same as desktop, just smaller
2. **Bottom sheet** - Slide up from bottom
3. **Full page** - Navigate to new page

**Status:** OPEN - Waiting for mobile wireframe phase

**Recommendation:** Bottom sheet for mobile, modal for desktop

---

## Question 003: Rating Display for Unrated Entries

**Question:** How should unrated entries display in the journal?

**Options:**
1. **Empty stars** - 5 empty star outlines
2. **"Not rated" text** - Explicit label
3. **Hidden** - Don't show rating area if unrated
4. **Muted stars** - Faded outline with no fill

**Status:** OPEN - Waiting for visual design

**Recommendation:** Muted stars with no fill (consistent layout, clear state)

---

═══════════════════════════════════════════════════════════════
DECISION SUMMARY
═══════════════════════════════════════════════════════════════

| # | Decision | Status | Impact |
|---|----------|--------|--------|
| 001 | Journal Entry Form: Modal | DECIDED | Wireframe |
| 002 | Rating: 10 clickable positions | DECIDED | Interaction design |
| 003 | Status order: WATCHING first | DECIDED | UI ordering |
| 004 | Empty state: Encouraging | DECIDED | Copy tone |
| 005 | Favorites: Separate selection | DECIDED | Flow design |
| 006 | Search: Hybrid dropdown/page | DECIDED | Search behavior |
| 007 | Admin default: Pending only | DECIDED | Admin queue |
| 008 | Content card: Full clickable | DECIDED | Interaction |
| 009 | Status display: Prominent badge | DECIDED | Visual hierarchy |
| 010 | User search: Username only | DECIDED | Search scope |
| Q1 | Featured: Carousel vs grid | OPEN | Homepage layout |
| Q2 | Mobile form: Modal vs sheet | OPEN | Mobile design |
| Q3 | Unrated display | OPEN | Visual design |
