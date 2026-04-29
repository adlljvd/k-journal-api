=== FLOW DOCUMENT v0.1 ===
Project: KJOURNAL-001-k-journal-platform
Scale: L
Status: Validated
Last Updated: 2026-04-27

═══════════════════════════════════════════════════════════════
OVERVIEW
═══════════════════════════════════════════════════════════════

K-Journal is a personal journaling platform for Korean drama and movie enthusiasts. 
The core value proposition: "Track what you watch. Express your taste."

This document maps the primary user flows and system interactions.

═══════════════════════════════════════════════════════════════
USER FLOWS
═══════════════════════════════════════════════════════════════

## Flow 1: User Registration & Onboarding

```
[Guest lands on homepage]
        │
        ▼
[Clicks "Sign Up" / "Register"]
        │
        ▼
[Fills registration form: email, username, password]
        │
        ├── Validation Error ──→ [Show error, return to form]
        │
        ▼
[Account created successfully]
        │
        ▼
[Auto-login]
        │
        ▼
[Redirect to empty Personal Journal with welcome prompt]
        │
        ▼
[User can: Browse catalog, Search, View content detail, Add first entry]
```

**Entry Points:** Homepage CTA, Direct link to register page
**Exit Points:** Dashboard/Journal (success), Login page (if already has account)

---

## Flow 2: Content Discovery & Browse

```
[User on Homepage]
        │
        ├── Featured content click ──→ [Content Detail Page]
        │
        ├── Search input ──→ [Search Results Page]
        │       │
        │       ├── Result found ──→ [Content Detail Page]
        │       │
        │       └── No results ──→ [Empty state with Content Request CTA]
        │
        └── Browse all click ──→ [Content Catalog Page]
                │
                ├── Filter by type (Drama/Movie)
                │
                ├── Filter by genre
                │
                ├── Sort (Title, Year, Rating)
                │
                └── Paginate
                        │
                        ▼
                [Click content card] ──→ [Content Detail Page]
```

**Entry Points:** Homepage, Navigation menu, Direct URL
**Exit Points:** Content Detail, Content Request, User Profile navigation

---

## Flow 3: Content Detail & Journal Entry

```
[User on Content Detail Page]
        │
        ├── View metadata: title, type, year, synopsis, poster, genres, cast, episodes/duration
        │
        ├── If already in journal:
        │       │
        │       └── Show current status, rating, review (editable)
        │
        └── If NOT in journal:
                │
                ▼
        [Click "Add to Journal"]
                │
                ▼
        [Journal Entry Form Modal/Page]
                │
                ├── Select watch status (WATCHING/COMPLETED/DROPPED/PLAN_TO_WATCH)
                │
                ├── Optional: Set rating (0.5 - 5 stars, half-increments)
                │
                ├── Optional: Write review (no character limit)
                │
                ├── Optional: Mark as favorite
                │
                ├── Cancel ──→ [Return to Content Detail, no changes]
                │
                └── Save ──→ [Journal entry created]
                                │
                                ▼
                        [Success confirmation + redirect to Personal Journal]
```

**Entry Points:** Catalog, Search Results, User Profile favorites
**Exit Points:** Personal Journal, Content Detail (updated)

---

## Flow 4: Personal Journal Management

```
[User navigates to "My Journal"]
        │
        ▼
[Journal View: All user's journal entries]
        │
        ├── Filter by watch status
        │
        ├── Sort by date added, title, rating
        │
        ├── View entry details
        │
        ├── Edit entry ──→ [Journal Entry Edit Form]
        │       │
        │       ├── Modify: status, rating, review, favorite
        │       │
        │       └── Save ──→ [Entry updated]
        │
        └── Delete entry
                │
                ├── Confirm ──→ [Entry deleted]
                │
                └── Cancel ──→ [Return to journal]
```

**Entry Points:** Navigation menu, Content Detail (own entry), Profile
**Exit Points:** Content Detail (view content), Profile (view favorites)

---

## Flow 5: Public Profile Discovery

```
[User searches for another user]
        │
        ▼
[User Search Results]
        │
        └── Click user ──→ [Public Profile Page]
                │
                ├── View: username, avatar, bio
                │
                ├── View: 4 favorite titles (if set)
                │
                ├── View: Public journal entries (all reviews visible)
                │
                ├── View: Basic stats (titles logged, mean rating)
                │
                └── Click journal entry ──→ [Content Detail Page]
```

**Entry Points:** User search, Direct profile URL
**Exit Points:** Content Detail, Back to search

---

## Flow 6: Content Request (Missing Title)

```
[User cannot find content in search/catalog]
        │
        ▼
[Clicks "Request Content" or "Can't find what you're looking for?"]
        │
        ▼
[Content Request Form]
        │
        ├── Enter: Title (required)
        │
        ├── Enter: Year (optional)
        │
        ├── Enter: Type - Drama/Movie (required)
        │
        ├── Enter: Additional notes (optional)
        │
        ├── Cancel ──→ [Return to previous page]
        │
        └── Submit ──→ [Request created with status PENDING]
                                │
                                ▼
                        [User can view request status in "My Requests"]
                                │
                                ├── PENDING ──→ [Waiting for admin review]
                                │
                                ├── APPROVED ──→ [Content now in catalog, CTA to add to journal]
                                │
                                └── REJECTED ──→ [Rejection reason shown, no further action]
```

**Entry Points:** Empty search results, Footer/Help link, User settings
**Exit Points:** My Requests list, Catalog

---

## Flow 7: Admin Content Management

```
[Admin logs in]
        │
        ▼
[Admin Dashboard]
        │
        ├── View pending content requests
        │       │
        │       ├── Click request ──→ [Request Detail]
        │       │       │
        │       │       ├── APPROVE ──→ [Admin creates Content record] ──→ [Request marked APPROVED]
        │       │       │
        │       │       └── REJECT ──→ [Admin enters rejection reason] ──→ [Request marked REJECTED]
        │       │
        │       └── Bulk actions (approve/reject multiple)
        │
        ├── Manage Content Catalog
        │       │
        │       ├── Add new content manually
        │       │       │
        │       │       └── Fill form: title, slug, type, year, synopsis, posterUrl, genres, cast, episodes/duration
        │       │
        │       ├── Edit existing content
        │       │
        │       └── Delete content (with cascade check for journal entries)
        │
        └── View platform stats (optional)
```

**Entry Points:** Admin login, Direct admin URL
**Exit Points:** Admin logout

---

## Flow 8: User Profile Management

```
[User navigates to "My Profile"]
        │
        ▼
[Profile View: Public preview + Edit options]
        │
        ├── Edit avatar
        │
        ├── Edit bio (max 160 characters)
        │
        ├── Select 4 favorites from journal
        │       │
        │       └── [Favorite Selection Modal]
        │               │
        │               └── Select from favorited content (already marked as favorite in journal)
        │
        ├── View public profile preview
        │
        └── Save changes
```

**Entry Points:** Navigation menu, Settings
**Exit Points:** Public profile view

═══════════════════════════════════════════════════════════════
SYSTEM FLOWS
═══════════════════════════════════════════════════════════════

## System Flow 1: Content Request Approval Pipeline

```
[User submits request] ──→ [Request stored: status=PENDING]
                                    │
                                    ▼
                    [Admin reviews request in queue]
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            [APPROVED]                      [REJECTED]
                    │                               │
                    ▼                               ▼
        [Admin creates Content]        [Rejection reason saved]
                    │                               │
                    ▼                               ▼
        [Request status updated]      [User notified: request rejected]
                    │
                    ▼
        [User notified: request approved, CTA to add to journal]
```

---

## System Flow 2: Journal Entry Data Relationships

```
[User] ──┐
         │
         ▼
[Journal Entry] ──┬── [Content] (many-to-one)
                 │
                 ├── Watch Status (enum: WATCHING/COMPLETED/DROPPED/PLAN_TO_WATCH)
                 │
                 ├── Rating (decimal: 0.5-5.0, null if unrated)
                 │
                 ├── Review (text, null if none)
                 │
                 └── Is Favorite (boolean)

Constraints:
- One journal entry per user per content
- Rating null allowed (user may just want to track)
- Review null allowed (user may just want to rate)
```

═══════════════════════════════════════════════════════════════
DECISIONS MADE
═══════════════════════════════════════════════════════════════

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| 1 | 4 watch statuses (no ON_HOLD) | Per user specification for MVP simplicity | 2026-04-27 |
| 2 | Series-level tracking only | Per user specification; episode-level is Phase 2 | 2026-04-27 |
| 3 | 50-100 seeded titles for MVP | Per user specification; sufficient for initial testing | 2026-04-27 |
| 4 | Public profiles default | Per user specification; no private option in MVP | 2026-04-27 |
| 5 | Single super-admin | Per user specification | 2026-04-27 |
| 6 | No follow relationships in MVP | Per user specification; Phase 2 | 2026-04-27 |
| 7 | 5-star ratings with half-increments | Industry standard (Letterboxd pattern) | 2026-04-27 |
| 8 | No character limit on reviews | Industry standard; use display truncation | 2026-04-27 |
| 9 | 4 favorites on profile | Letterboxd pattern; clear taste signal | 2026-04-27 |
| 10 | No rewatch logging in MVP | One entry per content for simplicity | 2026-04-27 |
| 11 | Featured content selected by admin | Editorial picks; algorithmic is Phase 2 | 2026-04-27 |

═══════════════════════════════════════════════════════════════
OPEN QUESTIONS (RESOLVED)
═══════════════════════════════════════════════════════════════

All previously open questions have been resolved and documented in the Decisions Made section and relevant PRD business rules.

| # | Question | Resolution |
|---|----------|------------|
| 1 | Should users be able to log rewatches? | RESOLVED: No rewatch logging in MVP. One entry per content. (Decision 10) |
| 2 | Home page content strategy? | RESOLVED: Featured content selected by admin (editorial picks). (Decision 11) |
| 3 | What happens to journal entries when content is deleted? | RESOLVED: Cascade delete. BR-ADM-03. |
| 4 | Can users edit content metadata? | RESOLVED: No, only admin can edit content. Users submit requests. |
| 5 | Notification system needed? | RESOLVED: In-app notifications only for MVP. Email is Phase 2. |

═══════════════════════════════════════════════════════════════
PHASE 2 FEATURES (OUT OF MVP SCOPE)
═══════════════════════════════════════════════════════════════

| Feature | Description | Trigger for Inclusion |
|---------|-------------|----------------------|
| Follow relationships | Follow/unfollow users, follower/following counts | User demand, engagement plateau |
| Activity feed | See followed users' activity | Follow feature implemented |
| Episode-level tracking | Track progress at episode granularity | User feedback, power user demand |
| External API integration | TMDB/MyDramaList auto-import | Admin workload exceeds capacity |
| On-Hold status | Additional watch status for paused series | User feedback |
| Private journal entries | Option to hide entries from public profile | Privacy concerns raised |
| Notifications | Push/email notifications for requests, follows | User demand |
| Annual recap | Wrapped-style year-in-review | First year of data collected |
| Challenges | Watching goals (e.g., 20 K-dramas this year) | Engagement driver |
| Premium tiers | Paid features (ad-free, stats, custom themes) | Monetization need |
