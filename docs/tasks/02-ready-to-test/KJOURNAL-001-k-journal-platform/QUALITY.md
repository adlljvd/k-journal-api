# QUALITY.md: K-Journal Platform MVP

## Coverage Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Statements | 80% | Overall code coverage |
| Branches | 70% | Conditional paths |
| Functions | 80% | All function definitions |
| Lines | 80% | All code lines |
| Services | 100% | All service functions/lines |
| Guards/Strategies | 100% | Auth guards and strategies |

## Test Pyramid

| Type | Ratio | Focus |
|------|-------|-------|
| Unit | 70% | Business logic, validation, transformations |
| Integration | 20% | API endpoints, database interactions |
| E2E | 10% | Critical user journeys |

---

## Non-Negotiable Scenarios (P0)

These scenarios MUST be covered — no exceptions:

| ID | Scenario | Layer |
|----|----------|-------|
| P0-AUTH-001 | Registration with valid data creates user and returns tokens | integration |
| P0-AUTH-002 | Login with valid credentials returns tokens | integration |
| P0-AUTH-003 | Password hashing uses argon2id | unit |
| P0-AUTH-004 | Duplicate email registration rejected with correct error | integration |
| P0-AUTH-005 | Duplicate username registration rejected with correct error | integration |
| P0-JRN-001 | Journal entry creation enforces one-per-user-per-content | integration |
| P0-JRN-002 | Journal entry belongs only to owner | integration |
| P0-JRN-003 | Rating must be 0.5-5.0 in 0.5 increments | unit |
| P0-ADM-001 | Non-admin cannot access admin endpoints | integration |
| P0-SEC-001 | JWT access token expires in 15 minutes | unit |
| P0-SEC-002 | Refresh token expires in 7 days (30 days with rememberMe) | unit |
| P0-SEC-003 | Rate limiting enforced (100 req/min/IP, 5 content req/user/day) | integration |

---

## Scenario Coverage Map

### Module 1: Authentication (AUTH)

#### FR-AUTH-001: User Registration

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 1 | Register with valid email, username, password | integration | controller | P0 | Returns 201, user object, tokens |
| 2 | Register with invalid email format | unit | service | P1 | Returns 400 VALIDATION_FAILED |
| 3 | Register with username < 3 chars | unit | service | P1 | Returns 400 VALIDATION_FAILED |
| 4 | Register with username > 30 chars | unit | service | P1 | Returns 400 VALIDATION_FAILED |
| 5 | Register with username containing invalid chars | unit | service | P1 | Returns 400 VALIDATION_FAILED |
| 6 | Register with password < 8 chars | unit | service | P1 | Returns 400 VALIDATION_FAILED |
| 7 | Register with duplicate email | integration | controller | P0 | Returns 409 EMAIL_ALREADY_EXISTS |
| 8 | Register with duplicate username (case-insensitive) | integration | controller | P0 | Returns 409 USERNAME_ALREADY_EXISTS |
| 9 | Profile auto-created on registration | integration | service | P1 | Profile exists with default values |
| 10 | Registration auto-logs user in | integration | controller | P1 | Response includes accessToken, refreshToken |
| 11 | Username uniqueness is case-insensitive | integration | service | P1 | "TestUser" and "testuser" conflict |

#### FR-AUTH-002: User Login

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 12 | Login with valid credentials | integration | controller | P0 | Returns 200, user object, tokens |
| 13 | Login with invalid email | integration | controller | P1 | Returns 401 AUTH_INVALID_CREDENTIALS |
| 14 | Login with invalid password | integration | controller | P1 | Returns 401 AUTH_INVALID_CREDENTIALS |
| 15 | Login with rememberMe=true extends session | integration | service | P1 | Refresh token expires in 30 days |
| 16 | Login with rememberMe=false (default) | integration | service | P1 | Refresh token expires in 7 days |
| 17 | Login redirects to intended page after auth | e2e | flow | P2 | Redirect to protected URL after login |

#### FR-AUTH-003: User Logout

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 18 | Logout invalidates refresh token | integration | controller | P1 | Token removed from DB |
| 19 | Logout without auth returns 401 | integration | controller | P1 | Returns 401 UNAUTHORIZED |
| 20 | After logout, user can browse as guest | e2e | flow | P2 | Catalog accessible without auth |

#### FR-AUTH-004: Password Reset

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 21 | Request reset for existing email | integration | controller | P1 | Returns generic success message |
| 22 | Request reset for non-existing email | integration | controller | P1 | Returns generic success message (same as existing) |
| 23 | Reset password with valid token | integration | controller | P1 | Password updated, can login with new |
| 24 | Reset password with expired token | integration | controller | P1 | Returns 400 TOKEN_EXPIRED |
| 25 | Reset password with invalid token | integration | controller | P1 | Returns 400 INVALID_TOKEN |
| 26 | Reset password token expires in 24 hours | unit | service | P1 | Token expiration validated |

#### FR-AUTH-005: Account Settings

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 27 | Change password with valid current password | integration | controller | P1 | Password updated, old password invalid |
| 28 | Change password with invalid current password | integration | controller | P1 | Returns 400 INVALID_CURRENT_PASSWORD |
| 29 | Change email with valid password | integration | controller | P1 | Email updated |
| 30 | Change email to duplicate email | integration | controller | P1 | Returns 409 EMAIL_ALREADY_EXISTS |
| 31 | Delete account with valid password | integration | controller | P1 | User removed, profile removed |
| 32 | Delete account with invalid password | integration | controller | P1 | Returns 400 INVALID_PASSWORD |
| 33 | Deleted user data preserves anonymized stats | integration | service | P2 | Journal entry counts preserved for content stats |
| 34 | Delete account requires auth | integration | controller | P1 | Returns 401 without auth |

---

### Module 2: Content Catalog (CAT)

#### FR-CAT-001: Browse Content Catalog

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 35 | Browse returns paginated content (20 items default) | integration | controller | P1 | Returns 20 items, meta with pagination |
| 36 | Browse with custom page size | integration | controller | P1 | Returns requested limit items |
| 37 | Browse with page size > 100 capped | integration | controller | P1 | Returns max 100 items |
| 38 | Filter by type=DRAMA | integration | controller | P1 | Only dramas returned |
| 39 | Filter by type=MOVIE | integration | controller | P1 | Only movies returned |
| 40 | Filter by multiple genres | integration | controller | P1 | Content matching any genre returned |
| 41 | Sort by title ascending | integration | controller | P1 | Results sorted A-Z by title |
| 42 | Sort by year descending | integration | controller | P1 | Results sorted newest first |
| 43 | Sort by rating descending | integration | controller | P1 | Results sorted by highest rating |
| 44 | Browse without auth (guest) | integration | controller | P1 | Returns content without auth |
| 45 | Empty result with no matching filters | integration | controller | P2 | Returns empty items array |

#### FR-CAT-002: Search Content

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 46 | Search with partial title match | integration | controller | P1 | Returns matching content |
| 47 | Search is case-insensitive | integration | service | P1 | "Crash" matches "Crash Landing on You" |
| 48 | Search returns max 10 results | integration | controller | P1 | Limited to 10 items |
| 49 | Search with no results | integration | controller | P2 | Returns empty items array |
| 50 | Search debounced at 300ms | e2e | flow | P2 | No API call before debounce |

#### FR-CAT-003: View Content Detail

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 51 | Get content by slug | integration | controller | P1 | Returns full content detail |
| 52 | Content detail includes average rating | integration | controller | P1 | avgRating calculated from journal entries |
| 53 | Content detail includes logged count | integration | controller | P1 | loggedCount shows total entries |
| 54 | Authenticated user sees their entry | integration | controller | P1 | userEntry populated if exists |
| 55 | Guest user sees null userEntry | integration | controller | P1 | userEntry is null |
| 56 | Content not found returns 404 | integration | controller | P1 | Returns 404 CONTENT_NOT_FOUND |
| 57 | Slug-based URL is shareable | e2e | flow | P2 | Direct URL loads content |

#### FR-CAT-004: Submit Content Request

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 58 | Submit request with required fields | integration | controller | P1 | Returns 201 with PENDING status |
| 59 | Submit request requires auth | integration | controller | P1 | Returns 401 without auth |
| 60 | Request limited to 5 per user per day | integration | controller | P0 | 6th request returns 429 RATE_LIMIT_EXCEEDED |
| 61 | View my requests list | integration | controller | P1 | Returns user's requests with status |
| 62 | Filter requests by status | integration | controller | P2 | Returns only matching status |
| 63 | Approved request shows catalog link | integration | controller | P2 | CTA present when APPROVED |
| 64 | Rejected request shows reason | integration | controller | P2 | rejectionReason displayed |

#### FR-CAT-005: Homepage Discovery

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 65 | Featured content returned | integration | controller | P1 | isFeatured=true content returned |
| 66 | Recently added returns 6 items | integration | controller | P1 | Latest 6 by createdAt |
| 67 | Top rated requires min 5 ratings | integration | service | P1 | Content with < 5 ratings excluded |
| 68 | Homepage accessible without auth | integration | controller | P1 | No auth required |

---

### Module 3: Journaling (JRN)

#### FR-JRN-001: Add Content to Journal

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 69 | Add entry with status only | integration | controller | P1 | Entry created with status, no rating/review |
| 70 | Add entry with all fields | integration | controller | P1 | Entry created with all data |
| 71 | Duplicate entry for same content rejected | integration | controller | P0 | Returns 409 ENTRY_ALREADY_EXISTS |
| 72 | Rating below 0.5 rejected | unit | service | P1 | Validation error |
| 73 | Rating above 5.0 rejected | unit | service | P1 | Validation error |
| 74 | Rating in 0.5 increments only | unit | service | P1 | 3.7 rejected, 3.5 accepted |
| 75 | Add entry requires auth | integration | controller | P1 | Returns 401 without auth |
| 76 | Add entry with invalid contentId | integration | controller | P1 | Returns 404 CONTENT_NOT_FOUND |
| 77 | Mark as favorite on add | integration | controller | P1 | isFavorite=true persists |

#### FR-JRN-002: View Personal Journal

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 78 | Get all journal entries | integration | controller | P1 | Returns paginated entries |
| 79 | Sort by updatedAt descending (default) | integration | controller | P1 | Most recent first |
| 80 | Sort by rating descending | integration | controller | P1 | Highest rated first |
| 81 | Sort by title ascending | integration | controller | P1 | A-Z by content title |
| 82 | Review snippet truncated to 150 chars | unit | service | P2 | Long reviews truncated |
| 83 | Empty journal shows empty state | integration | controller | P2 | Returns empty items array |
| 84 | Journal requires auth | integration | controller | P1 | Returns 401 without auth |

#### FR-JRN-003: Edit Journal Entry

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 85 | Update status | integration | controller | P1 | Status updated |
| 86 | Update rating | integration | controller | P1 | Rating updated |
| 87 | Clear rating (set to null) | integration | controller | P1 | Rating becomes null |
| 88 | Update review | integration | controller | P1 | Review text updated |
| 89 | Clear review | integration | controller | P1 | Review becomes null |
| 90 | Toggle favorite on | integration | controller | P1 | isFavorite becomes true |
| 91 | Toggle favorite off | integration | controller | P1 | isFavorite becomes false |
| 92 | Edit entry requires ownership | integration | controller | P0 | Returns 403 if not owner |
| 93 | Edit non-existent entry | integration | controller | P1 | Returns 404 ENTRY_NOT_FOUND |

#### FR-JRN-004: Delete Journal Entry

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 94 | Delete entry removes from journal | integration | controller | P1 | Entry removed, 204 returned |
| 95 | Delete removes from favorites | integration | service | P1 | No longer in favorites list |
| 96 | Delete requires ownership | integration | controller | P0 | Returns 403 if not owner |
| 97 | Delete updates content logged count | integration | service | P2 | loggedCount decremented |

#### FR-JRN-005: Rate Content

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 98 | Rating 0.5 is valid | unit | service | P1 | Accepted |
| 99 | Rating 5.0 is valid | unit | service | P1 | Accepted |
| 100 | Rating contributes to average | integration | service | P1 | Content avgRating updated |
| 101 | Change rating updates average | integration | service | P1 | avgRating recalculated |
| 102 | Unrated entry excluded from average | integration | service | P1 | null rating not counted |

#### FR-JRN-006: Write Review

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 103 | Review with unlimited characters | integration | controller | P1 | Long review accepted |
| 104 | Review visible on content detail | integration | controller | P1 | Review shown on content page |
| 105 | Review visible on public profile | integration | controller | P1 | Review shown on user profile |
| 106 | Review truncated with "Read more" | e2e | flow | P2 | Expansion works for > 300 chars |
| 107 | Edit review updates content | integration | controller | P1 | Updated review saved |
| 108 | Delete review clears text | integration | controller | P1 | Review becomes null |

#### FR-JRN-007: Mark Favorite

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 109 | Mark as favorite | integration | controller | P1 | isFavorite=true |
| 110 | Unmark favorite | integration | controller | P1 | isFavorite=false |
| 111 | Favorites appear in dedicated view | integration | controller | P1 | GET /favorites returns favorites |
| 112 | No limit on favorites count | integration | service | P2 | Can mark unlimited as favorite |
| 113 | Max 4 profile favorites | integration | controller | P1 | 5th rejected with error |
| 114 | Profile favorites must be marked as favorite first | integration | controller | P1 | Non-favorite rejected |

#### FR-JRN-008: Filter by Watch Status

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 115 | Filter by WATCHING | integration | controller | P1 | Only WATCHING entries |
| 116 | Filter by COMPLETED | integration | controller | P1 | Only COMPLETED entries |
| 117 | Filter by DROPPED | integration | controller | P1 | Only DROPPED entries |
| 118 | Filter by PLAN_TO_WATCH | integration | controller | P1 | Only PLAN_TO_WATCH entries |
| 119 | Filter by ALL shows all | integration | controller | P1 | All entries regardless of status |
| 120 | Count badge per status | integration | controller | P2 | Counts per status returned |
| 121 | Filter persists during session | e2e | flow | P2 | Filter state maintained |

---

### Module 4: User Profiles (PROF)

#### FR-PROF-001: View Own Profile

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 122 | Get own profile | integration | controller | P1 | Returns user + profile data |
| 123 | Profile includes stats | integration | controller | P1 | totalLogged, meanRating, favoritesCount |
| 124 | Profile includes favorites | integration | controller | P1 | Up to 4 profile favorites |
| 125 | Journal entries paginated (20 per page) | integration | controller | P1 | Pagination meta returned |
| 126 | Edit button visible for own profile | e2e | flow | P2 | Edit action available |

#### FR-PROF-002: Edit Profile

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 127 | Update avatar URL | integration | controller | P1 | avatarUrl updated |
| 128 | Update bio (max 160 chars) | integration | controller | P1 | bio updated |
| 129 | Bio > 160 chars rejected | unit | service | P1 | Validation error |
| 130 | Set profile favorites (max 4) | integration | controller | P1 | profileFavorites updated |
| 131 | Profile favorite must be marked as favorite | integration | controller | P1 | Non-favorite rejected |
| 132 | Profile favorite order determines display | integration | service | P1 | Order preserved |
| 133 | Invalid avatar URL rejected | unit | service | P2 | Must be valid URL format |

#### FR-PROF-003: View Other User's Profile

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 134 | Get public profile by username | integration | controller | P1 | Returns public data |
| 135 | Profile URL case-insensitive | integration | controller | P1 | /user/TestUser equals /user/testuser |
| 136 | Non-existent user returns 404 | integration | controller | P1 | Returns 404 USER_NOT_FOUND |
| 137 | Cannot edit another user's profile | integration | controller | P1 | Returns 403 FORBIDDEN |
| 138 | Public journal entries visible | integration | controller | P1 | Entries returned |
| 139 | Guest can view public profiles | integration | controller | P1 | No auth required |

#### FR-PROF-004: Search Users

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 140 | Search by username partial match | integration | controller | P1 | Matching users returned |
| 141 | Search is case-insensitive | integration | service | P1 | "john" matches "JohnDoe" |
| 142 | Search returns max 10 results | integration | controller | P1 | Limited to 10 |
| 143 | Bio snippet truncated to 50 chars | unit | service | P2 | First 50 chars shown |
| 144 | No results state | integration | controller | P2 | Empty items array |
| 145 | Search available to guests | integration | controller | P1 | No auth required |

#### FR-PROF-005: View Profile Stats

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 146 | Total logged count accurate | integration | service | P1 | Count matches journal entries |
| 147 | Mean rating excludes unrated | integration | service | P1 | null ratings excluded from mean |
| 148 | Mean rating calculation correct | unit | service | P1 | Average of all rated entries |
| 149 | Favorites count accurate | integration | service | P1 | Count of isFavorite=true entries |
| 150 | Stats visible on all profiles | integration | controller | P1 | Stats returned for any user |

---

### Module 5: Admin (ADM)

#### FR-ADM-001: Access Admin Dashboard

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 151 | Admin accesses /admin | integration | controller | P1 | Returns dashboard data |
| 152 | Non-admin receives 403 | integration | controller | P0 | Returns 403 FORBIDDEN |
| 153 | Unauthenticated receives 401 | integration | controller | P1 | Returns 401 UNAUTHORIZED |
| 154 | Dashboard shows pending requests count | integration | controller | P1 | Count accurate |
| 155 | Dashboard shows total content count | integration | controller | P1 | Count accurate |

#### FR-ADM-002: Review Content Requests

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 156 | List all requests sorted by date | integration | controller | P1 | Oldest first |
| 157 | Filter by PENDING status | integration | controller | P1 | Only pending returned |
| 158 | Approve request creates content | integration | controller | P1 | Content created, request APPROVED |
| 159 | Reject request requires reason | integration | controller | P1 | reason field required |
| 160 | Reject request marks REJECTED | integration | controller | P1 | Status updated, reason stored |
| 161 | User notified of decision | integration | service | P2 | In-app notification created |
| 162 | Approved request links to content | integration | controller | P1 | contentId populated |

#### FR-ADM-003: Create Content

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 163 | Create with required fields | integration | controller | P1 | Content created |
| 164 | Slug auto-generated from title | unit | service | P1 | Slug format valid |
| 165 | Slug can be customized | integration | controller | P1 | Custom slug used |
| 166 | Validate poster URL is image URL | unit | service | P1 | Invalid URL rejected |
| 167 | Create requires admin role | integration | controller | P0 | Non-admin gets 403 |

#### FR-ADM-004: Edit Content

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 168 | Update content fields | integration | controller | P1 | Fields updated |
| 169 | ID cannot be changed | integration | controller | P1 | ID remains same |
| 170 | Changes reflected immediately | integration | controller | P1 | Public page shows updates |
| 171 | Edit requires admin role | integration | controller | P0 | Non-admin gets 403 |

#### FR-ADM-005: Delete Content

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 172 | Delete content removes from catalog | integration | controller | P1 | Content not found after delete |
| 173 | Delete cascades to journal entries | integration | service | P1 | All entries removed |
| 174 | Delete requires admin role | integration | controller | P0 | Non-admin gets 403 |
| 175 | Deleted content not in search | integration | controller | P1 | Not found in search results |

#### FR-ADM-006: Manage Catalog

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 176 | List content paginated (50 per page) | integration | controller | P1 | Pagination works |
| 177 | Search by title | integration | controller | P1 | Matching content returned |
| 178 | Filter by type | integration | controller | P1 | Filter works |
| 179 | Sort by various fields | integration | controller | P1 | Sorting works |

---

## Security Scenarios

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 180 | Password hashed with argon2id | unit | service | P0 | Argon2id algorithm used |
| 181 | Access token expires in 15 minutes | unit | service | P0 | Token expiry validated |
| 182 | Refresh token expires in 7 days | unit | service | P0 | Token expiry validated |
| 183 | Refresh token extends to 30 days with rememberMe | unit | service | P0 | Extended expiry validated |
| 184 | Invalid JWT returns 401 | integration | guard | P1 | Malformed token rejected |
| 185 | Expired JWT returns 401 | integration | guard | P1 | Expired token rejected |
| 186 | SQL injection prevented | integration | controller | P1 | No SQL execution |
| 187 | XSS in review text sanitized | unit | service | P1 | HTML escaped or removed |
| 188 | Rate limit enforced (100 req/min/IP) | integration | guard | P0 | 101st request rejected |
| 189 | Rate limit enforced (5 content req/user/day) | integration | guard | P0 | 6th request rejected |

---

## Performance Scenarios

Based on NFR-001 and NFR-002:

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| 190 | GET /content P95 < 200ms | integration | controller | P1 | Latency within threshold |
| 191 | GET /content/:slug P95 < 200ms | integration | controller | P1 | Latency within threshold |
| 192 | GET /journal P95 < 200ms | integration | controller | P1 | Latency within threshold |
| 193 | POST /journal P95 < 500ms | integration | controller | P1 | Latency within threshold |
| 194 | POST /auth/login P95 < 500ms | integration | controller | P1 | Latency within threshold |
| 195 | Pagination queries use indexes | integration | service | P1 | No full table scans |
| 196 | Search query uses index | integration | service | P1 | Index hit on title field |
| 197 | 100 concurrent users | integration | load | P2 | No degradation |

---

## Mocking Strategy

| Dependency | Mock Strategy | Unit Tests | Integration Tests |
|------------|---------------|------------|-------------------|
| Database | In-memory SQLite / test container | Optional | Required |
| Email Service | Mock (never send real emails) | Required | Required |
| External APIs | N/A (no external APIs in MVP) | - | - |
| JWT Library | Use real implementation | Required | Use real |
| Password Hash | Use real argon2id | Required | Use real |
| Rate Limiter | Mock or use real with test config | Required | Use real |

---

## Test Fixture Requirements

| Fixture | Description |
|---------|-------------|
| Test User | Standard USER role account |
| Test Admin | ADMIN role account |
| Test Content | Multiple content items (Drama, Movie) |
| Test Journal Entries | Entries with various statuses, ratings |
| Test Content Requests | Requests in PENDING, APPROVED, REJECTED states |
| Test Genres | All 14 pre-seeded genres |

---

## Build Quality Gates

| Check | Requirement |
|-------|-------------|
| TypeScript | Strict mode enabled, no `any` types |
| ESLint | Zero errors, no `eslint-disable` comments |
| Prettier | All files formatted |
| Type Check | `tsc --noEmit` passes |

---

## Summary

- **Total Scenarios**: 197
- **P0 (Non-negotiable)**: 13
- **P1 (High Priority)**: 155
- **P2 (Medium Priority)**: 29
- **Unit Tests**: ~70 (validation, transformations, calculations)
- **Integration Tests**: ~110 (API endpoints, database interactions)
- **E2E Tests**: ~10 (critical user flows)
- **Load Tests**: 1 (concurrent users)

---

## Notes

1. All P0 scenarios must pass before any PR can be merged
2. Coverage targets are minimum thresholds; higher is encouraged
3. Performance tests require dedicated test environment
4. Security scenarios include both prevention and detection tests
5. Load testing for NFR-003 (100 concurrent users) is P2 for MVP
