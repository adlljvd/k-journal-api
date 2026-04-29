=== SYSTEM MENTAL MODEL v0.2 ===
Project: KJOURNAL-001-k-journal-platform
Date: 2026-04-27
Status: Validated

═══════════════════════════════════════════════════════════════
CORE OBJECTS IN THIS SYSTEM
═══════════════════════════════════════════════════════════════

## User
- What it is: A registered person who uses K-Journal to track their K-content journey
- Lifecycle: Registers → Sets up profile → Logs content → Engages with community → (Optional) Remains active or churns
- Owns: Journal entries, reviews, favorites, watch status selections, profile settings
- Roles: USER (standard), ADMIN (content moderation, user management)

## Content (K-Drama/K-Movie)
- What it is: A Korean drama or movie in the platform catalog
- Lifecycle: Seeded by admin → Available for browse/search → Users add to journal → (Optional) Updated with new metadata
- Owns: Metadata (title, type, year, synopsis, poster, genres, cast, episodes/duration)
- Constraint: Users cannot directly create content; must submit Content Request

## Journal Entry
- What it is: A user's personal record of their relationship with a piece of content
- Lifecycle: User adds content → Sets watch status → (Optional) Rates → (Optional) Writes review → (Optional) Marks as favorite
- Owns: Watch status, rating (0.5-5 stars), review text, favorite flag, created/updated timestamps
- Constraint: One journal entry per user per content item

## Content Request
- What it is: A user-submitted request to add missing content to the catalog
- Lifecycle: User submits → PENDING → Admin reviews → APPROVED or REJECTED
- If APPROVED: Admin creates Content record → User can then add to journal
- If REJECTED: User sees rejection status, no further action

## User Profile
- What it is: Public-facing identity and taste showcase
- Lifecycle: Auto-created on registration → User customizes → Visible to other users
- Contains: Username, avatar, bio, 4 favorite titles, journal entries (public), stats

## Watch Status
- What it is: A categorical state indicating user's progress with content
- Values: WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH
- Note: Research indicates "ON_HOLD" is standard for serialized content, but MVP scope defines 4 states

═══════════════════════════════════════════════════════════════
PRIMARY SCREENS (HYPOTHESIS)
═══════════════════════════════════════════════════════════════

| ID   | Screen                | Primary User | Purpose                          | Data Expected              | MVP? |
|------|----------------------|--------------|----------------------------------|----------------------------|------|
| S-01 | Home/Landing         | Guest/User   | Discover featured content        | Featured titles, search    | YES  |
| S-02 | Content Catalog      | User         | Browse all K-dramas/movies       | Paginated content list     | YES  |
| S-03 | Content Detail       | User         | View info, add to journal        | Full metadata, user action | YES  |
| S-04 | Search Results       | User         | Find specific content            | Search query results       | YES  |
| S-05 | Login/Register       | Guest        | Authenticate                     | Form inputs                | YES  |
| S-06 | Personal Journal     | User         | View own tracked content         | User's journal entries     | YES  |
| S-07 | Journal Entry Edit   | User         | Set status, rate, review         | Form inputs                | YES  |
| S-08 | User Profile (Own)   | User         | Manage public identity           | Profile data, favorites    | YES  |
| S-09 | User Profile (Other) | User         | Discover other users' taste      | Public profile data        | YES  |
| S-10 | Favorites            | User         | View favorite titles             | Favorited content list     | YES  |
| S-11 | Content Request      | User         | Submit missing titles            | Form inputs, status view   | YES  |
| S-12 | Admin Dashboard      | Admin        | Moderate content requests        | Request queue              | YES  |
| S-13 | Admin Content Manage | Admin        | Add/edit content catalog         | Content CRUD               | YES  |
| S-14 | Settings             | User         | Account preferences              | User settings              | YES  |

═══════════════════════════════════════════════════════════════
USER DAILY WORKFLOW
═══════════════════════════════════════════════════════════════

## User (Enthusiast - Primary Persona)
- Opens app → Sees Home with featured content OR goes directly to Journal
- Primary action: Log a K-drama/movie they just finished watching or started
- Secondary action: Browse catalog, check other users' profiles, submit content request

## Admin (Secondary Persona)
- Opens admin dashboard → Sees pending content requests
- Primary action: Review and approve/reject content requests
- Secondary action: Add new content to catalog, manage existing content

═══════════════════════════════════════════════════════════════
CRITICAL FAILURE MOMENTS IN CURRENT PROCESS
═══════════════════════════════════════════════════════════════

1. **Content not found**: User searches for a K-drama → not in catalog → frustration
   - Solution: Content Request flow with clear feedback on status

2. **Lost tracking context**: User watches multiple K-dramas simultaneously → forgets which episode
   - Solution: Clear watch status indicators, journal view organized by status

3. **Taste not visible**: User wants to share their K-drama taste → no easy way to showcase
   - Solution: Public profile with favorites, ratings distribution, stats

4. **Review friction**: User wants to write quick thoughts → long-form review feels overwhelming
   - Solution: No character limit, display truncation, optional review field

═══════════════════════════════════════════════════════════════
RESEARCH KNOWLEDGE BASE
═══════════════════════════════════════════════════════════════

## Benchmarks to Use
| Metric | Value | Source |
|--------|-------|--------|
| DAU/MAU healthy ratio | 15-25% | Industry benchmark |
| 30-day retention target | 20-30% | Entertainment app median |
| Review-to-watched ratio | ~14% | Letterboxd 2024 data |
| Enthusiast tracking rate | 5-10 titles/month | Domain research |

## Product Patterns to Reference
| Pattern | Example | Trade-off |
|---------|---------|-----------|
| 5-star half-increment ratings | Letterboxd, Goodreads | Familiar but limited nuance vs. 1-10 scale |
| 4-state watch status | User-defined MVP | Simpler than MAL's 6-state, may lack "On-Hold" |
| Public profile with favorites | Letterboxd 4 favorites | Immediate taste signal, but limited slots |
| No review character limit | Letterboxd, MAL, Goodreads | Depth allowed, display truncation needed |
| Content request queue | TMDB model | Community-driven, requires moderation overhead |

## Assumption Challenges from Research
1. **Watch status complexity**: Research suggests 6 states for serialized content; MVP defines 4
   - Challenge: "Should 'On-Hold' be added for K-drama viewers who pause mid-series?"

2. **Episode-level tracking**: Research indicates episode tracking is essential for K-dramas
   - Challenge: "Should users track progress at episode level or series level only?"

3. **Catalog size**: Research suggests 1,000+ titles for viability; user specifies 50-100
   - Challenge: "Is 50-100 sufficient for MVP testing, or will users churn due to limited catalog?"

═══════════════════════════════════════════════════════════════
ASSUMPTIONS VALIDATED
═══════════════════════════════════════════════════════════════

All assumptions have been validated through stakeholder review:

1. ✓ Users will primarily interact with content they've already watched (journaling) rather than discover new content
2. ✓ 4 watch statuses are sufficient; "On-Hold" is Phase 2
3. ✓ Series-level tracking (not episode-level) is adequate for MVP
4. ✓ 50-100 seeded titles is sufficient for MVP user testing
5. ✓ Users will accept public profiles as default (no private profile option needed for MVP)
6. ✓ Single super-admin is sufficient for content moderation
7. ✓ Manual content seeding is acceptable; external API integration is Phase 2
8. ✓ English-only UI is acceptable for global audience
9. ✓ No follow relationships needed for taste discovery (public profiles sufficient)
10. ✓ No rewatch logging in MVP (one entry per content)
11. ✓ Featured content is admin-curated (editorial), not algorithmic

═══════════════════════════════════════════════════════════════
QUESTIONS RESOLVED
═══════════════════════════════════════════════════════════════

All questions have been resolved and documented in business rules:

| # | Question | Resolution | Reference |
|---|----------|------------|-----------|
| 1 | Should users be able to set a journal entry as private? | No private entries in MVP | BR-PROF-01 |
| 2 | Should there be a way to log multiple views/rewatches? | No, one entry per content for MVP | BR-JRN-10 |
| 3 | How should content be featured on the home page? | Admin editorial picks | BR-CAT-10 |
| 4 | What happens when a user deletes their account? | Data removed, stats recomputed | BR-AUTH-05 |
| 5 | Should the rating system allow decimal values? | Yes, 0.5 increments (0.5-5.0) | BR-JRN-02 |
| 6 | Should there be a character minimum for reviews? | No minimum, optional field | BR-JRN-04 |
| 7 | Should users be able to edit content metadata? | No, submit content request | BR-CAT-01 |
| 8 | What is the expected admin workload? | Manual review; request queue management | MVP-SCOPE |

═══════════════════════════════════════════════════════════════
DECISIONS FINALIZED
═══════════════════════════════════════════════════════════════

| # | Decision | Reference |
|---|----------|-----------|
| 1 | Episode-level vs series-level tracking → Series-level only | FLOW-DOCUMENT Decision 2 |
| 2 | Should "On-Hold" status be added → No, 4 statuses for MVP | FLOW-DOCUMENT Decision 1 |
| 3 | Private journal entries allowed → No, all public | FLOW-DOCUMENT Decision 4 |
| 4 | Home page content strategy → Admin editorial picks | FLOW-DOCUMENT Decision 11 |
| 5 | Rating granularity → 0.5 increments (5-star) | FLOW-DOCUMENT Decision 7 |

═══════════════════════════════════════════════════════════════
STATUS: VALIDATED
═══════════════════════════════════════════════════════════════

All requirements have been validated and are ready for @ux-designer handoff.
