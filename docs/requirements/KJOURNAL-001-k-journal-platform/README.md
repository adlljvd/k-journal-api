# K-Journal Platform Requirements

**Project:** KJOURNAL-001-k-journal-platform  
**Scale:** L (New System)  
**Status:** Validated  
**Last Updated:** 2026-04-27

---

## Overview

K-Journal is a K-drama and K-movie journaling and discovery platform. Users can track what they watch, write short personal reviews, manage watch status, save favorites, and share their taste through a public profile.

**Core Value Proposition:** "Track what you watch. Express your taste."

---

## Document Index

### Planning Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [MENTAL-MODEL.md](./MENTAL-MODEL.md) | System mental model, core objects, screens, assumptions | Validated |
| [FLOW-DOCUMENT.md](./FLOW-DOCUMENT.md) | User flows, system flows, decisions made | Validated |
| [MVP-SCOPE.md](./MVP-SCOPE.md) | MVP features, success criteria, Phase 2 roadmap | Validated |

### PRD Modules

| Document | Module | MVP Status |
|----------|--------|------------|
| [PRD-AUTH.md](./PRD-AUTH.md) | Authentication & User Management | ✓ IN |
| [PRD-CONTENT.md](./PRD-CONTENT.md) | Content Catalog & Discovery | ✓ IN |
| [PRD-JOURNAL.md](./PRD-JOURNAL.md) | Journaling & Tracking | ✓ IN |
| [PRD-PROFILE.md](./PRD-PROFILE.md) | User Profiles & Social Discovery | ✓ IN |
| [PRD-ADMIN.md](./PRD-ADMIN.md) | Admin & Content Management | ✓ IN |

### Research

| Document | Source | Description |
|----------|--------|-------------|
| [research/RESEARCH-PRODUCT.md](./research/RESEARCH-PRODUCT.md) | @researcher-product | Product patterns, Letterboxd/MAL analysis, UX patterns |
| [research/RESEARCH-DOMAIN.md](./research/RESEARCH-DOMAIN.md) | @researcher-domain | Benchmarks, engagement metrics, K-drama metadata, monetization |

---

## Quick Reference

### User Roles
| Role | Description |
|------|-------------|
| GUEST | Unauthenticated visitor - can browse catalog and view public profiles |
| USER | Authenticated user - can journal, rate, review, favorite, and manage profile |
| ADMIN | Super-admin - can manage content catalog and review content requests |

### Core Features (MVP)
- User registration and authentication
- Browse/search K-drama and K-movie catalog (50-100 seeded titles)
- Journal entries with watch status, ratings, reviews, favorites
- Public user profiles with favorites and stats
- Content request submission and admin review
- Admin dashboard for content management

### Watch Statuses
- WATCHING
- COMPLETED
- DROPPED
- PLAN_TO_WATCH

### Rating System
- 5-star scale with half-star increments (0.5, 1.0, 1.5, ... 5.0)
- Rating is optional

### Key Decisions
1. 4 watch statuses (no ON_HOLD for MVP)
2. Series-level tracking only (no episode-level)
3. All profiles and journal entries are public
4. No follow relationships in MVP
5. Single super-admin
6. Manual content seeding (no external API)
7. Free platform for MVP

---

## Ready for Handoff

All requirements have been validated and are ready for **@ux-designer** handoff.

- Follow/unfollow users
- Activity feed
- Episode-level tracking
- On-Hold status
- Private journal entries
- External API integration (TMDB, MyDramaList)
- Annual recap (Wrapped-style)
- Watching challenges/goals
- Premium tier (ad-free, advanced stats)

---

## Contact

Product Owner: [TBD]  
Engineering Lead: [TBD]
