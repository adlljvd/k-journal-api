=== MVP-SCOPE.md ===
Project: KJOURNAL-001-k-journal-platform
Scale: L
Status: Validated
Last Updated: 2026-04-27

═══════════════════════════════════════════════════════════════
WHAT MVP PROVES
═══════════════════════════════════════════════════════════════

**Hypothesis:** If K-drama/K-movie enthusiasts can track their viewing journey with watch status, ratings, and reviews on a curated Korean content platform, they will adopt K-Journal as their primary tracking tool and demonstrate taste-driven social discovery through public profiles.

**Success Metrics:**
- Users create at least 3 journal entries within their first week
- 15-20% DAU/MAU ratio within 3 months
- 20-30% 30-day retention rate
- Users visit at least 2 other profiles during their first month

═══════════════════════════════════════════════════════════════
MODULE MATRIX
═══════════════════════════════════════════════════════════════

| Module | PRD Reference | Status | In MVP | Out (Phase 2+) |
|--------|---------------|--------|--------|----------------|
| **Authentication** | PRD-AUTH.md | ✓ | Registration, Login, Logout, Password Reset, Account Settings | OAuth, 2FA, Email verification |
| **Content Catalog** | PRD-CONTENT.md | ✓ | Browse, Search, Content Detail, Homepage, Content Request | Advanced search, Recommendations, External API |
| **Journaling** | PRD-JOURNAL.md | ✓ | Journal entries (CRUD), 4 statuses, Ratings, Reviews, Favorites | Episode tracking, Rewatches, Private entries |
| **Profiles** | PRD-PROFILE.md | ✓ | Public profiles, Profile editing, User search, Profile favorites, Stats | Follow system, Activity feed, Private profiles |
| **Admin** | PRD-ADMIN.md | ✓ | Dashboard, Request review, Content CRUD | Multi-admin, Activity logs, User management |

═══════════════════════════════════════════════════════════════
MVP FEATURE CHECKLIST
═══════════════════════════════════════════════════════════════

## Authentication (PRD-AUTH)
- [ ] User registration (email, username, password)
- [ ] User login/logout
- [ ] Password reset (email-based or admin-assisted)
- [ ] Account settings (change email, change password, delete account)
- [ ] Session management

## Content Catalog (PRD-CONTENT)
- [ ] Browse catalog (paginated, filter by type/genre, sort)
- [ ] Search by title (real-time, debounced)
- [ ] Content detail page (all metadata, average rating, logged count)
- [ ] Homepage (featured, recently added, top rated)
- [ ] Content request submission (title, type, year, notes)
- [ ] Content request status tracking (My Requests)
- [ ] 50-100 seeded K-dramas and K-movies

## Journaling (PRD-JOURNAL)
- [ ] Add content to journal
- [ ] Set watch status (WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH)
- [ ] Rate content (0.5-5.0 stars, half-increments)
- [ ] Write review (unlimited characters)
- [ ] Mark as favorite
- [ ] Edit journal entry
- [ ] Delete journal entry
- [ ] View personal journal (filter, sort)
- [ ] View favorites list
- [ ] Select up to 4 profile favorites

## Profiles (PRD-PROFILE)
- [ ] View own profile
- [ ] Edit profile (avatar URL, bio, profile favorites)
- [ ] View other users' public profiles
- [ ] User search by username
- [ ] Profile stats (total logged, mean rating, favorites count)

## Admin (PRD-ADMIN)
- [ ] Admin dashboard
- [ ] Content request queue (view, filter, approve/reject)
- [ ] Content creation form
- [ ] Content edit form
- [ ] Content delete (with cascade)
- [ ] Catalog management (list, search)

═══════════════════════════════════════════════════════════════
EXPLICITLY NOT IN MVP
═══════════════════════════════════════════════════════════════

| Feature | Why Deferred | Trigger for Inclusion |
|---------|--------------|----------------------|
| Follow/unfollow users | Not critical for taste discovery; adds complexity | User demand, engagement plateau |
| Follower/following counts | Depends on follow feature | Follow feature implemented |
| Activity feed | Depends on follow feature | Follow feature implemented |
| Episode-level tracking | Increases complexity; series-level sufficient for MVP | User feedback, power user demand |
| On-Hold status | User specified 4 statuses; simpler model | User feedback requesting more granularity |
| Private journal entries | All entries public by default; adds permission logic | Privacy concerns raised |
| Rewatch logging | One entry per content; simpler data model | User demand |
| External API integration | Manual seeding sufficient for MVP catalog size | Admin workload exceeds capacity |
| OAuth social login | Email/password sufficient; reduces scope | User friction reported |
| Two-factor authentication | Security enhancement; not MVP-critical | Security concerns, paid tier |
| Avatar image upload | URL-only reduces infrastructure needs | User friction reported |
| Annual recap (Wrapped-style) | Requires year of data | First year of data collected |
| Watching challenges/goals | Engagement driver; not core journaling | Engagement needs boost |
| Premium/paid tiers | Free for MVP; monetization later | Monetization need |
| User management by admin | Single admin; no multi-user concerns | Multi-admin needed |
| Block/mute users | Social conflict resolution; no follow system | Social conflicts arise |
| Notifications (email/push) | In-app sufficient; reduces infrastructure | User demand for re-engagement |

═══════════════════════════════════════════════════════════════
SUCCESS CRITERIA
═══════════════════════════════════════════════════════════════

| Metric | Target | Timeline | Owner |
|--------|--------|----------|-------|
| Journal entries created (total) | 500+ | 1 month post-launch | Product |
| Active users (MAU) | 100+ | 1 month post-launch | Product |
| DAU/MAU ratio | 15-20% | 3 months post-launch | Product |
| 30-day retention | 20-30% | 3 months post-launch | Product |
| Content requests submitted | 20+ | 1 month post-launch | Product |
| Content requests approved | 80%+ approval rate | Ongoing | Admin |
| Average journal entries per user | 5+ | 1 month post-launch | Product |
| Profile views (cross-user) | 2+ per active user/week | 1 month post-launch | Product |

═══════════════════════════════════════════════════════════════
USER ACCEPTANCE CRITERIA
═══════════════════════════════════════════════════════════════

A real user must be able to accomplish the following to consider MVP successful:

1. **Account Setup**
   - Register with email and username
   - Log in and access personal journal
   - Update profile with bio and avatar

2. **Core Journaling Loop**
   - Search for a K-drama or K-movie in the catalog
   - Add it to their journal with a watch status
   - Rate it with stars
   - Write a short review
   - Mark it as a favorite

3. **Journal Management**
   - View all their tracked content in one place
   - Filter by watch status
   - Edit or delete an entry

4. **Social Discovery**
   - Search for another user by username
   - View their public profile with favorites and journal
   - See their stats and taste

5. **Content Request**
   - Submit a request for missing content
   - See the status of their request

═══════════════════════════════════════════════════════════════
SCOPE CHANGE PROTOCOL
═══════════════════════════════════════════════════════════════

When a new requirement surfaces during development:

1. **Flag to Product Owner**: "New requirement surfaced — impact on MVP scope?"
2. **Assess Impact**: 
   - Does it block core user stories?
   - Does it add significant development time?
   - Is it a "nice-to-have" that can wait?
3. **Decision Categories**:
   - **Blocker**: Must include, adjust timeline
   - **Next Cycle**: Defer to Phase 2
   - **Defer**: Log for future consideration
4. **Document Decision**: Update MVP-SCOPE.md with rationale
5. **Communicate**: Notify stakeholders of scope change

═══════════════════════════════════════════════════════════════
PHASE 2 ROADMAP (POST-MVP)
═══════════════════════════════════════════════════════════════

## Phase 2a: Social Enhancements
- Follow/unfollow users
- Follower/following counts
- Activity feed (followed users' actions)
- User notifications (in-app)

## Phase 2b: Enhanced Tracking
- Episode-level progress tracking
- On-Hold status
- Rewatch logging
- Watch date (diary) tracking

## Phase 2c: Platform Growth
- External API integration (TMDB, MyDramaList)
- Bulk content import
- Annual recap (Wrapped-style)
- Watching challenges/goals

## Phase 2d: Monetization
- Premium tier (ad-free, advanced stats)
- Avatar image upload
- Profile themes/customization
- Export data

## Phase 2e: Community
- Groups/communities
- Public lists (user-created collections)
- Review comments/likes
- Content recommendations

═══════════════════════════════════════════════════════════════
RISKS & MITIGATIONS
═══════════════════════════════════════════════════════════════

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Catalog too small (50-100 titles) | Medium | High | Seed high-quality, popular titles; prioritize content requests |
| Low user engagement | Medium | High | Focus on core loop; add email notifications in Phase 2 |
| Admin overwhelmed by requests | Low | Medium | Daily request limit per user; batch processing workflow |
| Users want private entries | Medium | Medium | Document as Phase 2 feature; gather feedback |
| Performance issues with journal queries | Low | Medium | Proper indexing; pagination; caching |
| Spam/abuse in reviews | Low | Medium | Admin can edit/delete content; report feature in Phase 2 |

═══════════════════════════════════════════════════════════════
TECHNICAL CONSTRAINTS (FOR ENGINEERING REFERENCE)
═══════════════════════════════════════════════════════════════

1. **API-First Architecture**: All features accessible via REST API
2. **Authentication**: JWT-based session management
3. **Database**: PostgreSQL recommended for relational data
4. **Content Storage**: Posters hosted externally (URL-only for MVP)
5. **Search**: Full-text search on title field
6. **Rate Limiting**: Content requests limited to 5/day/user
7. **Pagination**: Default 20 items/page for lists
8. **Architecture Flexibility**: Design data model to support future:
   - Follow relationships (User-to-User)
   - Episode tracking (Content-to-Episodes)
   - External API sync (Content.external_id field)

═══════════════════════════════════════════════════════════════
APPENDIX: SEEDED CONTENT SAMPLE
═══════════════════════════════════════════════════════════════

The following titles represent the type of content to be seeded for MVP testing:

**K-Dramas (Sample):**
- Crash Landing on You (2019, 16 episodes)
- Squid Game (2021, 9 episodes)
- Goblin (2016, 16 episodes)
- Itaewon Class (2020, 16 episodes)
- Hospital Playlist (2020, 12 episodes)
- Reply 1988 (2015, 20 episodes)
- Vincenzo (2021, 20 episodes)
- My Love from the Star (2013, 21 episodes)
- Descendants of the Sun (2016, 16 episodes)
- Hometown Cha-Cha-Cha (2021, 16 episodes)

**K-Movies (Sample):**
- Parasite (2019)
- Train to Busan (2016)
- Oldboy (2003)
- The Handmaiden (2016)
- Burning (2018)
- Memories of Murder (2003)
- Decision to Leave (2022)
- Okja (2017)
- Snowpiercer (2013)
- A Taxi Driver (2017)

**Note:** Full seed list (50-100 titles) to be provided separately by product owner.
