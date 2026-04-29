=== UXSPEC INDEX: K-Journal ===
Project: KJOURNAL-001-k-journal-platform
Status: Complete
Last Updated: 2026-04-27

PRD refs: docs/requirements/KJOURNAL-001-k-journal-platform/PRD-*.md
Wireframes: docs/requirements/KJOURNAL-001-k-journal-platform/wireframes/

═══════════════════════════════════════════════════════════════
PROJECT OVERVIEW
═══════════════════════════════════════════════════════════════

**K-Journal** is a personal journaling platform for Korean drama and movie enthusiasts.

**Core Value Proposition:** "Track what you watch. Express your taste."

**Target Users:**
- **Enthusiast (Primary)** - K-drama/K-movie fans who want to track their viewing journey
- **Admin (Secondary)** - Platform manager who curates catalog and reviews requests

**MVP Scope:**
- 5 modules: Authentication, Content Catalog, Journaling, Profiles, Admin
- 50-100 seeded K-dramas and K-movies
- Public profiles only (no private entries)
- Single super-admin

---

═══════════════════════════════════════════════════════════════
QUICK NAVIGATION
═══════════════════════════════════════════════════════════════

| Section | File | Purpose |
|---------|------|---------|
| User Simulations | [simulations.md](simulations.md) | Per-role user journey narratives |
| Flow Maps | [flows.md](flows.md) | Primary flow documentation |
| Multi-Actor Workflow | [workflow.md](workflow.md) | User-Admin handoffs |
| Wave 1 Screens | [screens/wave-01-foundation.md](screens/wave-01-foundation.md) | Authentication screens |
| Wave 2 Screens | [screens/wave-02-content.md](screens/wave-02-content.md) | Content catalog screens |
| Wave 3 Screens | [screens/wave-03-journal.md](screens/wave-03-journal.md) | Journaling screens |
| Wave 4 Screens | [screens/wave-04-profile.md](screens/wave-04-profile.md) | Profile screens |
| Wave 5 Screens | [screens/wave-05-admin.md](screens/wave-05-admin.md) | Admin screens |
| Hierarchy Matrix | [hierarchy-matrix.md](hierarchy-matrix.md) | Data field importance |
| UX Decisions | [decisions.md](decisions.md) | Design decisions log |

---

═══════════════════════════════════════════════════════════════
SCREEN INVENTORY
═══════════════════════════════════════════════════════════════

| ID | Screen Name | Wave | File | Module | Role | Reached From | Goes To |
|----|-------------|------|------|--------|------|--------------|---------|
| S-AUTH-01 | Registration Page | 1 | wave-01-foundation.md | AUTH | Guest | Homepage, Login | S-JRN-01 |
| S-AUTH-02 | Login Page | 1 | wave-01-foundation.md | AUTH | Guest | Homepage, Protected routes | S-JRN-01 |
| S-AUTH-03 | Forgot Password | 1 | wave-01-foundation.md | AUTH | Guest | Login | S-AUTH-02 |
| S-AUTH-05 | Account Settings | 1 | wave-01-foundation.md | AUTH | User, Admin | Navigation | Same page |
| S-CAT-01 | Homepage | 2 | wave-02-content.md | CONTENT | All | Direct URL, Logo | S-CAT-02, S-CAT-03, S-CAT-04 |
| S-CAT-02 | Content Catalog | 2 | wave-02-content.md | CONTENT | All | Homepage, Navigation | S-CAT-03 |
| S-CAT-03 | Content Detail | 2 | wave-02-content.md | CONTENT | All | Catalog, Search, Profile | S-JRN-02 |
| S-CAT-04 | Search Results | 2 | wave-02-content.md | CONTENT | All | Search bar | S-CAT-03, S-CAT-05 |
| S-JRN-01 | Personal Journal | 3 | wave-03-journal.md | JOURNAL | User | Navigation, Content Detail | S-CAT-03, S-JRN-02 |
| S-JRN-02 | Journal Entry Form | 3 | wave-03-journal.md | JOURNAL | User | Content Detail, Journal | S-CAT-03, S-JRN-01 |
| S-JRN-03 | My Favorites | 3 | wave-03-journal.md | JOURNAL | User | Navigation, Profile | S-CAT-03, S-PROF-02 |
| S-CAT-05 | Content Request Form | 3 | wave-03-journal.md | JOURNAL | User | Search empty, Settings | S-CAT-06 |
| S-CAT-06 | My Requests | 3 | wave-03-journal.md | JOURNAL | User | Settings, Post-submit | S-CAT-03, S-CAT-05 |
| S-PROF-01 | Own Profile (View) | 4 | wave-04-profile.md | PROFILE | User | Navigation, Settings | S-PROF-02, S-CAT-03 |
| S-PROF-02 | Own Profile (Edit) | 4 | wave-04-profile.md | PROFILE | User | Own profile | S-PROF-01 |
| S-PROF-03 | Other User Profile | 4 | wave-04-profile.md | PROFILE | All | User search, URL | S-CAT-03 |
| S-PROF-04 | User Search | 4 | wave-04-profile.md | PROFILE | All | Navigation | S-PROF-03 |
| S-ADM-01 | Admin Dashboard | 5 | wave-05-admin.md | ADMIN | Admin | Navigation | S-ADM-02, S-ADM-04, S-ADM-06 |
| S-ADM-02 | Request Queue | 5 | wave-05-admin.md | ADMIN | Admin | Dashboard | S-ADM-03, S-ADM-04 |
| S-ADM-03 | Request Detail | 5 | wave-05-admin.md | ADMIN | Admin | Request queue | S-ADM-04, S-PROF-03 |
| S-ADM-04 | Content Creation | 5 | wave-05-admin.md | ADMIN | Admin | Dashboard, Request approval | S-ADM-06 |
| S-ADM-05 | Content Edit | 5 | wave-05-admin.md | ADMIN | Admin | Catalog management | S-ADM-06 |
| S-ADM-06 | Catalog Management | 5 | wave-05-admin.md | ADMIN | Admin | Dashboard | S-ADM-04, S-ADM-05 |

---

═══════════════════════════════════════════════════════════════
WAVE SUMMARY
═══════════════════════════════════════════════════════════════

| Wave | Module | Screens | Wireframe File |
|------|--------|---------|----------------|
| 1 | Foundation & Authentication | S-AUTH-01, S-AUTH-02, S-AUTH-03, S-AUTH-05 | 01-auth.html, _shared.css |
| 2 | Content Catalog & Discovery | S-CAT-01, S-CAT-02, S-CAT-03, S-CAT-04 | 02-content.html |
| 3 | Journaling & Favorites | S-JRN-01, S-JRN-02, S-JRN-03, S-CAT-05, S-CAT-06 | 03-journal.html |
| 4 | User Profiles & Social | S-PROF-01, S-PROF-02, S-PROF-03, S-PROF-04 | 04-profile.html |
| 5 | Admin & Content Management | S-ADM-01, S-ADM-02, S-ADM-03, S-ADM-04, S-ADM-05, S-ADM-06 | 05-admin.html |

---

═══════════════════════════════════════════════════════════════
MODULE OVERVIEW
═══════════════════════════════════════════════════════════════

## Authentication (PRD-AUTH.md)
- User registration, login, logout
- Password reset (admin-assisted for MVP)
- Account settings (email, password, delete)

## Content Catalog (PRD-CONTENT.md)
- Browse all K-dramas and K-movies
- Search by title
- Content detail pages
- Homepage with featured, recent, top-rated

## Journaling (PRD-JOURNAL.md)
- Add/edit/delete journal entries
- 4 watch statuses: WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH
- 5-star rating (0.5 increments)
- Unlimited review text
- Favorites (unlimited, max 4 for profile)

## Profiles (PRD-PROFILE.md)
- Public user profiles
- Profile editing (avatar URL, bio, profile favorites)
- User search by username
- Stats: total logged, mean rating, favorites count

## Admin (PRD-ADMIN.md)
- Admin dashboard
- Content request review (approve/reject)
- Content creation and management
- Single super-admin

---

═══════════════════════════════════════════════════════════════
KEY DESIGN DECISIONS
═══════════════════════════════════════════════════════════════

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Journal Entry Form | Modal overlay | Preserves context, faster interaction |
| Rating Input | 10 clickable positions | Intuitive for half-star increments |
| Status Order | WATCHING → COMPLETED → PLAN_TO_WATCH → DROPPED | Action-oriented, positive first |
| Empty States | Encouraging but not enthusiastic | Clear guidance, professional tone |
| Profile Favorites | Separate selection from journal | Unlimited favorites, curated top 4 |
| Search | Hybrid dropdown + page | Quick access + full results |
| Admin Default | Pending only | Focus on action items |
| Content Cards | Full-card clickable | Larger target, cleaner UI |
| Status Display | Prominent color-coded badge | Quick scanning, filtering support |
| User Search | Username only | Simpler, matches PRD |

See [decisions.md](decisions.md) for full decision log.

---

═══════════════════════════════════════════════════════════════
DATA FIELD HIERARCHY SUMMARY
═══════════════════════════════════════════════════════════════

### Primary Fields (Decision-Driving)
- Content title
- Watch status
- Rating
- User's journal entry status
- Profile favorites (top 4)
- Search query
- Pending request count (admin)

### Secondary Fields (Supporting Context)
- Content type, year, genres
- Average rating, total logged
- Review text
- Bio, avatar
- Stats (total logged, mean rating)
- Date added/updated

### Tertiary Fields (Reference)
- Cast, episodes/duration, country
- Character counter
- Pagination

See [hierarchy-matrix.md](hierarchy-matrix.md) for complete field analysis.

---

═══════════════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════════════

- **Total screens:** 23
- **Total waves:** 5
- **Modules:** 5 (AUTH, CONTENT, JOURNAL, PROFILE, ADMIN)
- **User roles:** 3 (Guest, User, Admin)

---

═══════════════════════════════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════════════════════════════

1. **Stakeholder Review** - PA to review UXSPEC
2. **Wave Planning** - Confirm wave order and dependencies
3. **Dispatch to @ux-coder** - Begin Wave 1 wireframe implementation
4. **Review Waves** - Each wave reviewed and approved before next
5. **Handoff to @ux-reviewer** - Deep UX review of completed wireframes
6. **Final Approval** - Present to @product-analyst

---

**Status:** UXSPEC COMPLETE - Ready for stakeholder review and wave dispatch.
