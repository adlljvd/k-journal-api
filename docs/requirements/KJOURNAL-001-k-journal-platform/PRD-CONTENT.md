=== PRD: Content Catalog & Discovery ===
Version: 1.0
Scale: L
Project: kjournal-001-k-journal-platform
Flow Document ref: v0.1
MVP: IN
Status: Validated

═══════════════════════════════════════════════════════════════
1. PROBLEM STATEMENT
═══════════════════════════════════════════════════════════════

Users need to browse, search, and discover K-dramas and K-movies in a curated catalog. Unlike generic movie databases, K-Journal focuses exclusively on Korean content with enthusiast-grade metadata. The catalog is admin-controlled; users cannot directly add content but can request missing titles.

**Current state:** No catalog exists.
**Impact:** Users cannot discover or track Korean content.
**What changes:** Users can browse a seeded catalog of 50-100 K-dramas and K-movies, search by title, and view detailed content pages.

═══════════════════════════════════════════════════════════════
2. ROLES & PERMISSIONS
═══════════════════════════════════════════════════════════════

| Role | Browse | Search | View Detail | Request Content | Manage Content |
|------|--------|--------|-------------|-----------------|----------------|
| GUEST | ✓ | ✓ | ✓ | ✗ | ✗ |
| USER | ✓ | ✓ | ✓ | ✓ | ✗ |
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ |

═══════════════════════════════════════════════════════════════
3. USER STORIES
═══════════════════════════════════════════════════════════════

### Story CAT-01: Browse Content Catalog
As a user,
I want to browse all available K-dramas and K-movies,
so that I can discover content to add to my journal.

**Acceptance Criteria:**
- AC-CAT-01-001: Catalog page displays all content in paginated grid view (20 items per page)
- AC-CAT-01-002: Each item shows poster, title, type (Drama/Movie), year
- AC-CAT-01-003: User can filter by type (Drama, Movie, All)
- AC-CAT-01-004: User can filter by genre (multi-select)
- AC-CAT-01-005: User can sort by Title (A-Z, Z-A), Year (newest, oldest), Average Rating (highest)
- AC-CAT-01-006: Clicking an item navigates to Content Detail page
- AC-CAT-01-007: Empty state shows: "No content found. Try adjusting your filters."

---

### Story CAT-02: Search Content
As a user,
I want to search for K-dramas and K-movies by title,
so that I can quickly find specific content.

**Acceptance Criteria:**
- AC-CAT-02-001: Search bar is accessible from header on all pages
- AC-CAT-02-002: Search query searches title field (case-insensitive, partial match)
- AC-CAT-02-003: Results display in real-time as user types (debounced, 300ms delay)
- AC-CAT-02-004: Results show top 10 matches with poster, title, type, year
- AC-CAT-02-005: Clicking a result navigates to Content Detail page
- AC-CAT-02-006: "See all results" link navigates to full Search Results page
- AC-CAT-02-007: No results state shows: "No results for '[query]'. Try a different search or request this title."
- AC-CAT-02-008: "Request this title" link navigates to Content Request form (pre-filled with query)

---

### Story CAT-03: View Content Detail
As a user,
I want to view detailed information about a K-drama or K-movie,
so that I can decide whether to add it to my journal.

**Acceptance Criteria:**
- AC-CAT-03-001: Content detail page displays all metadata: title, type, year, synopsis, poster, genres, cast, episodes (drama) or duration (movie), country
- AC-CAT-03-002: Page shows average rating across all users who rated this content
- AC-CAT-03-003: Page shows total number of users who logged this content
- AC-CAT-03-004: If logged in and content not in user's journal, shows "Add to Journal" button
- AC-CAT-03-005: If logged in and content is in user's journal, shows current status, rating, review (editable)
- AC-CAT-03-006: If guest, shows "Log in to add to your journal" prompt
- AC-CAT-03-007: URL is shareable with slug: /content/{slug}

---

### Story CAT-04: Submit Content Request
As a logged-in user,
I want to request a K-drama or K-movie that's not in the catalog,
so that it can be added for everyone to track.

**Acceptance Criteria:**
- AC-CAT-04-001: Content request form is accessible from search "no results" page and user settings
- AC-CAT-04-002: Form requires: Title (text), Type (Drama/Movie dropdown)
- AC-CAT-04-003: Form optionally accepts: Year, Additional notes
- AC-CAT-04-004: Submit creates request with status PENDING
- AC-CAT-04-005: User sees confirmation: "Request submitted! We'll review it shortly."
- AC-CAT-04-006: User can view their requests in "My Requests" section
- AC-CAT-04-007: Request list shows: Title, Type, Status (PENDING/APPROVED/REJECTED), Date submitted
- AC-CAT-04-008: APPROVED requests show CTA: "View in catalog" linking to content page
- AC-CAT-04-009: REJECTED requests show reason (if admin provided one)

---

### Story CAT-05: Homepage Discovery
As a user,
I want to see featured content on the homepage,
so that I can discover popular or interesting titles.

**Acceptance Criteria:**
- AC-CAT-05-001: Homepage displays featured content section (carousel or grid)
- AC-CAT-05-002: Featured content is selected by admin (editorial picks)
- AC-CAT-05-003: Each featured item shows poster, title, type
- AC-CAT-05-004: Clicking featured item navigates to Content Detail page
- AC-CAT-05-005: Homepage shows "Recently Added" section (latest 6 content items)
- AC-CAT-05-006: Homepage shows "Top Rated" section (highest average rating, min 5 ratings)

═══════════════════════════════════════════════════════════════
4. BUSINESS RULES
═══════════════════════════════════════════════════════════════

| Rule ID | Rule |
|---------|------|
| BR-CAT-01 | Content is only added by ADMIN (seeded or via approved request) |
| BR-CAT-02 | Content slugs are auto-generated from title and unique |
| BR-CAT-03 | Poster URLs must be valid image URLs (validated on admin entry) |
| BR-CAT-04 | Genres are pre-defined (admin-managed list, not free text) |
| BR-CAT-05 | Cast is free-text field (comma-separated names) for MVP |
| BR-CAT-06 | Country defaults to "South Korea" but can be overridden |
| BR-CAT-07 | Average rating is calculated from all journal entries with non-null ratings |
| BR-CAT-08 | Content requests are limited to 5 per user per day (spam prevention) |
| BR-CAT-09 | Duplicate content requests (same title + type) are merged; user is notified |
| BR-CAT-10 | Featured content is selected by admin (editorial picks), not algorithmic |
| BR-CAT-11 | Content requests require login (guests cannot submit requests for accountability) |
| BR-CAT-12 | Synopsis has no character limit but is displayed truncated in list views |

═══════════════════════════════════════════════════════════════
5. DATA MODEL
═══════════════════════════════════════════════════════════════

## Content Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| title | VARCHAR(255) | NOT NULL, indexed | English title |
| slug | VARCHAR(255) | UNIQUE, NOT NULL, indexed | URL-friendly identifier |
| type | ENUM | NOT NULL | 'DRAMA' or 'MOVIE' |
| year | INTEGER | NOT NULL | Release year |
| synopsis | TEXT | NULLABLE | Plot summary |
| poster_url | VARCHAR(500) | NULLABLE | Poster image URL |
| genres | JSON/ARRAY | NOT NULL, default [] | Array of genre strings |
| cast | TEXT | NULLABLE | Comma-separated actor names |
| episodes | INTEGER | NULLABLE | For dramas: total episodes |
| duration_minutes | INTEGER | NULLABLE | For movies: duration in minutes |
| country | VARCHAR(100) | NOT NULL, DEFAULT 'South Korea' | Country of origin |
| created_at | TIMESTAMP | NOT NULL, auto | Content added time |
| updated_at | TIMESTAMP | NOT NULL, auto-update | Last modification time |

## Genre Entity (Pre-seeded)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Genre name (e.g., "Romance", "Thriller") |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL-friendly name |

**Pre-seeded Genres:**
Romance, Drama, Comedy, Thriller, Mystery, Horror, Fantasy, Action, Historical, Medical, Legal, School, Slice of Life, Sci-Fi

## Content Request Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK -> User.id, NOT NULL | Requester |
| title | VARCHAR(255) | NOT NULL | Requested title |
| type | ENUM | NOT NULL | 'DRAMA' or 'MOVIE' |
| year | INTEGER | NULLABLE | Release year (if known) |
| notes | TEXT | NULLABLE | Additional notes from user |
| status | ENUM | NOT NULL, DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED |
| rejection_reason | TEXT | NULLABLE | Admin's rejection reason |
| created_at | TIMESTAMP | NOT NULL, auto | Request submission time |
| reviewed_at | TIMESTAMP | NULLABLE | Admin review time |
| reviewed_by | UUID | FK -> User.id, NULLABLE | Admin who reviewed |

═══════════════════════════════════════════════════════════════
6. WORKFLOW MAP
═══════════════════════════════════════════════════════════════

```
Content Discovery Workflow:
[User] -> [Search/Browse] -> [View Results]
    -> [Found] -> [Click Item] -> [Content Detail] -> [Add to Journal (if logged in)]
    -> [Not Found] -> [Content Request] -> [Submit] -> [PENDING] -> [Admin Review]

Content Request Workflow:
[User submits] -> [PENDING]
    -> [Admin approves] -> [Admin creates Content] -> [APPROVED] -> [User notified]
    -> [Admin rejects] -> [REJECTED] -> [User notified with reason]
```

═══════════════════════════════════════════════════════════════
7. SCREEN SKELETON
═══════════════════════════════════════════════════════════════

**Screen Inventory:**

| ID | Name | Accessible to | Reached from | MVP |
|----|------|---------------|--------------|-----|
| S-CAT-01 | Homepage | All | Direct URL, Logo click | YES |
| S-CAT-02 | Content Catalog | All | Homepage, Navigation | YES |
| S-CAT-03 | Content Detail | All | Catalog, Search, Profile | YES |
| S-CAT-04 | Search Results | All | Search bar | YES |
| S-CAT-05 | Content Request Form | User | Search empty state, Settings | YES |
| S-CAT-06 | My Requests | User | Settings, Profile | YES |

---

**[S-CAT-01] Homepage**

Purpose: Entry point for content discovery
Accessible to: All (Guest, User, Admin)
Reached from: Direct URL, Logo click, Navigation

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Featured content | Content table (featured=true) | Carousel/Grid | NO |
| Recently Added | Content table (latest 6) | Grid | NO |
| Top Rated | Content table (highest avg rating, min 5 ratings) | Grid | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| View featured | Click item | Always | Navigate to Content Detail |
| Browse all | "Browse All K-Dramas & Movies" | Always | Navigate to Catalog |
| Search | Search bar input | Always | Navigate to Search Results |

States:
- Empty featured: "No featured content yet. Check back soon!"
- Loading: Skeleton loaders for content cards

Navigation:
- Item click → /content/{slug}
- Browse all → /catalog
- Search → /search?q={query}

---

**[S-CAT-02] Content Catalog**

Purpose: Browse all available content
Accessible to: All
Reached from: Homepage, Navigation

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Content grid | Content table (paginated) | 20 items per page | NO |
| Filters | User selection | Type, Genre dropdowns | YES |
| Sort | User selection | Dropdown | YES |
| Pagination | Calculated | Page numbers | YES |

Each content card shows:
- Poster image
- Title
- Type badge (Drama/Movie)
- Year
- Average rating (if any)

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Filter by type | Type dropdown | Always | Filter results |
| Filter by genre | Genre dropdown (multi-select) | Always | Filter results |
| Sort | Sort dropdown | Always | Reorder results |
| View item | Click card | Always | Navigate to Content Detail |
| Page navigation | Page numbers | Multiple pages | Navigate pages |

States:
- Loading: Skeleton loaders
- Empty: "No content found. Try adjusting your filters."
- Error: "Unable to load content. Please try again."

Navigation:
- Item click → /content/{slug}
- Clear filters → Reset to default view

---

**[S-CAT-03] Content Detail**

Purpose: View full content information and add to journal
Accessible to: All
Reached from: Catalog, Search, Profile, Journal

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Title | Content.title | H1 | NO |
| Type | Content.type | Badge | NO |
| Year | Content.year | Text | NO |
| Poster | Content.poster_url | Image | NO |
| Synopsis | Content.synopsis | Paragraph | NO |
| Genres | Content.genres | Tags | NO |
| Cast | Content.cast | Comma-separated list | NO |
| Episodes/Duration | Content.episodes/duration_minutes | "X episodes" or "X min" | NO |
| Country | Content.country | Text | NO |
| Average rating | Calculated from journal entries | Stars display | NO |
| Total logged | Count of journal entries | "X users logged this" | NO |
| User's journal entry | Journal entry (if exists) | Status, rating, review | YES (edit) |

Actions (for logged-in users):
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Add to journal | "Add to Journal" | Not in user's journal | Open journal entry form |
| Edit entry | "Edit Entry" | In user's journal | Open journal entry form (pre-filled) |
| Request content | N/A | Always on this page | N/A (content exists) |

Actions (for guests):
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Log in prompt | "Log in to add to your journal" | Always | Navigate to login |

States:
- Loading: Skeleton loader for metadata
- Error: "Unable to load content. Please try again."
- No poster: Show placeholder image

Navigation:
- Back → Previous page or /catalog
- User's entry click → Edit journal entry

---

**[S-CAT-05] Content Request Form**

Purpose: Submit missing content for admin review
Accessible to: User only
Reached from: Search empty state, User settings

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Title input | User input | Text field (required) | YES |
| Type dropdown | User input | Drama/Movie (required) | YES |
| Year input | User input | Number field (optional) | YES |
| Notes textarea | User input | Text area (optional) | YES |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Submit | "Submit Request" | Form valid | Create request, show confirmation |
| Cancel | "Cancel" | Always | Return to previous page |

States:
- Loading: Button spinner during submission
- Success: "Request submitted! We'll review it shortly."
- Error: "Unable to submit request. Please try again."
- Rate limited: "You've reached your daily request limit (5). Try again tomorrow."

Validation:
| Field | Rule | Error Message |
|-------|------|---------------|
| Title | Required, 1-255 characters | "Please enter a title." |
| Type | Required | "Please select a type." |

Navigation:
- Success → /my-requests
- Cancel → Previous page

---

**[S-CAT-06] My Requests**

Purpose: View status of user's content requests
Accessible to: User only
Reached from: User settings, Post-submission redirect

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Request list | Content Request table (user's) | Table | NO |
| Title | ContentRequest.title | Text | NO |
| Type | ContentRequest.type | Badge | NO |
| Status | ContentRequest.status | Badge (PENDING/APPROVED/REJECTED) | NO |
| Submitted | ContentRequest.created_at | Date | NO |
| Rejection reason | ContentRequest.rejection_reason | Text (if rejected) | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| View content | "View in Catalog" | Status = APPROVED | Navigate to Content Detail |
| Submit new | "Request Another Title" | Always | Navigate to Content Request Form |

States:
- Empty: "You haven't submitted any content requests."
- Loading: Skeleton table

Navigation:
- View content → /content/{slug}
- Request another → /request-content

═══════════════════════════════════════════════════════════════
8. ENTRY POINTS PER ROLE
═══════════════════════════════════════════════════════════════

| Role | Entry Points |
|------|--------------|
| Guest | Homepage, Catalog, Content Detail, Search (read-only) |
| User | All Guest entry points + Content Request, My Requests |
| Admin | All User entry points + Admin Content Management |

═══════════════════════════════════════════════════════════════
9. NOTIFICATIONS
═══════════════════════════════════════════════════════════════

| Trigger | Type | Recipient | Message |
|---------|------|-----------|---------|
| Content request approved | In-app (email optional) | User | "Your content request '[title]' has been approved! [View in Catalog]" |
| Content request rejected | In-app (email optional) | User | "Your content request '[title]' was not approved. Reason: [reason]" |

**Note:** In-app notifications are MVP. Email notifications are Phase 2.

═══════════════════════════════════════════════════════════════
10. SCOPE
═══════════════════════════════════════════════════════════════

**In MVP:**
- Browse catalog with filters and sorting
- Search by title
- Content detail page with full metadata
- Content request submission and status tracking
- Homepage with featured, recent, top-rated sections
- 50-100 seeded content items

**Not in MVP (Phase 2+):**
- Advanced search (by cast, year range, etc.)
- Content recommendations/personalization
- External API integration (TMDB, MyDramaList)
- Episode-level content structure
- Related content suggestions
- User-contributed content edits

═══════════════════════════════════════════════════════════════
11. OPEN ITEMS
═══════════════════════════════════════════════════════════════

No open items. All decisions confirmed.
