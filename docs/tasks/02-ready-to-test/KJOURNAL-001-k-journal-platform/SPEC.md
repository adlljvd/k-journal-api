=== SPEC: K-Journal Platform MVP ===

## Context

K-Journal is a personal journaling platform for Korean drama and movie enthusiasts. Users can track what they watch, write short personal reviews, manage watch status, save favorites, and share their taste through a public profile. The core value proposition is: "Track what you watch. Express your taste."

This MVP proves the hypothesis: If K-drama/K-movie enthusiasts can track their viewing journey with watch status, ratings, and reviews on a curated Korean content platform, they will adopt K-Journal as their primary tracking tool and demonstrate taste-driven social discovery through public profiles.

## Scope

**In Scope:**
- User authentication (registration, login, logout, password reset, account settings)
- Content catalog (browse, search, content detail, homepage, content request)
- Journaling (journal entries CRUD, 4 watch statuses, ratings, reviews, favorites)
- User profiles (public profiles, profile editing, user search, profile favorites, stats)
- Admin functionality (dashboard, content request review, content CRUD)

**Explicit Boundaries:**
- 50-100 seeded K-drama and K-movie titles
- Single super-admin role
- Series-level tracking only (no episode-level)
- All profiles and journal entries are public
- No follow relationships
- Manual content seeding (no external API)

## Out of Scope

- Follow/unfollow users
- Activity feed
- Episode-level tracking
- On-Hold watch status
- Private journal entries
- External API integration (TMDB, MyDramaList)
- Annual recap (Wrapped-style)
- Watching challenges/goals
- Premium tier
- OAuth social login
- Two-factor authentication
- Email notifications (in-app only for MVP)
- Avatar image upload (URL-only)

---

## Functional Requirements

### Module 1: Authentication (AUTH)

#### FR-AUTH-001: User Registration
**Description**: Allow guests to create accounts with email, username, and password.
**Acceptance Criteria**:
- Registration form accepts email, username (3-30 chars, alphanumeric + underscore), and password (min 8 chars)
- Email must be valid format and unique
- Username must be unique (case-insensitive)
- Duplicate email shows error: "An account with this email already exists."
- Duplicate username shows error: "This username is already taken."
- Successful registration auto-logs user in and redirects to journal page
- User profile is auto-created with default values (empty bio, no avatar, no favorites)

#### FR-AUTH-002: User Login
**Description**: Allow registered users to authenticate with email and password.
**Acceptance Criteria**:
- Login form accepts email and password
- Invalid credentials show error: "Invalid email or password. Please try again."
- Successful login redirects to journal page (or intended protected page)
- "Remember me" option extends session to 30 days (default: 24 hours)

#### FR-AUTH-003: User Logout
**Description**: Allow authenticated users to terminate their session.
**Acceptance Criteria**:
- Logout button visible in navigation when authenticated
- Logout clears session and redirects to homepage
- After logout, user can still browse catalog and view public profiles as guest

#### FR-AUTH-004: Password Reset
**Description**: Allow users to reset forgotten password via email or admin assistance.
**Acceptance Criteria**:
- Login page has "Forgot password?" link
- Password reset form accepts email address
- If email exists, send password reset link (valid for 24 hours) — Phase 2
- MVP alternative: Admin can manually reset passwords
- Generic message shown: "If an account exists with this email, you'll receive a reset link."

#### FR-AUTH-005: Account Settings
**Description**: Allow users to manage their account settings.
**Acceptance Criteria**:
- Settings page accessible from navigation
- User can change password (requires current password verification)
- User can change email (requires password verification)
- User can delete account (requires password confirmation, shows warning about data loss)
- Account deletion removes user data but preserves anonymized journal entry counts for stats

---

### Module 2: Content Catalog (CAT)

#### FR-CAT-001: Browse Content Catalog
**Description**: Allow users to browse all available K-dramas and K-movies.
**Acceptance Criteria**:
- Catalog page displays all content in paginated grid view (20 items per page)
- Each item shows poster, title, type (Drama/Movie), year, average rating
- User can filter by type (Drama, Movie, All)
- User can filter by genre (multi-select from predefined list)
- User can sort by Title (A-Z, Z-A), Year (newest, oldest), Average Rating (highest)
- Clicking an item navigates to Content Detail page
- Empty state shows: "No content found. Try adjusting your filters."

#### FR-CAT-002: Search Content
**Description**: Allow users to search for K-dramas and K-movies by title.
**Acceptance Criteria**:
- Search bar accessible from header on all pages
- Search queries title field (case-insensitive, partial match)
- Results display in real-time as user types (debounced, 300ms delay)
- Results show top 10 matches with poster, title, type, year
- "See all results" link navigates to full Search Results page
- No results state shows: "No results for '[query]'. Try a different search or request this title."
- "Request this title" link navigates to Content Request form (pre-filled with query)

#### FR-CAT-003: View Content Detail
**Description**: Allow users to view detailed information about a K-drama or K-movie.
**Acceptance Criteria**:
- Content detail page displays all metadata: title, type, year, synopsis, poster, genres, cast, episodes (drama) or duration (movie), country
- Page shows average rating across all users who rated this content
- Page shows total number of users who logged this content
- If logged in and content not in user's journal, shows "Add to Journal" button
- If logged in and content is in user's journal, shows current status, rating, review (editable)
- If guest, shows "Log in to add to your journal" prompt
- URL is shareable with slug: /content/{slug}

#### FR-CAT-004: Submit Content Request
**Description**: Allow logged-in users to request missing content.
**Acceptance Criteria**:
- Content request form accessible from search "no results" page and user settings
- Form requires: Title (text), Type (Drama/Movie dropdown)
- Form optionally accepts: Year, Additional notes
- Submit creates request with status PENDING
- User sees confirmation: "Request submitted! We'll review it shortly."
- User can view their requests in "My Requests" section
- Request list shows: Title, Type, Status (PENDING/APPROVED/REJECTED), Date submitted
- APPROVED requests show CTA: "View in catalog" linking to content page
- REJECTED requests show reason (if admin provided one)
- Content requests limited to 5 per user per day

#### FR-CAT-005: Homepage Discovery
**Description**: Provide content discovery entry point on homepage.
**Acceptance Criteria**:
- Homepage displays featured content section (admin-curated, editorial picks)
- Homepage shows "Recently Added" section (latest 6 content items)
- Homepage shows "Top Rated" section (highest average rating, min 5 ratings)
- Each item shows poster, title, type
- Clicking any item navigates to Content Detail page

---

### Module 3: Journaling (JRN)

#### FR-JRN-001: Add Content to Journal
**Description**: Allow logged-in users to add content to their personal journal.
**Acceptance Criteria**:
- "Add to Journal" button visible on Content Detail page
- User can select watch status: WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH (required)
- User can optionally set rating (0.5 to 5.0 stars, 0.5 increments)
- User can optionally write review (no character limit)
- User can optionally mark as favorite
- User can save with minimal data (status only)
- One journal entry per user per content (enforced)
- Success message: "Added to your journal!"
- Cancel returns to Content Detail with no changes

#### FR-JRN-002: View Personal Journal
**Description**: Allow logged-in users to see all their journal entries.
**Acceptance Criteria**:
- Journal page accessible from navigation
- Displays all user's journal entries sorted by most recently updated
- Each entry shows: poster, title, type, watch status, rating (if set), review snippet (truncated to 150 chars), favorite icon (if marked)
- User can filter entries by watch status
- User can sort entries by: date added, date updated, rating, title
- Clicking entry navigates to Content Detail page
- Edit and Delete buttons visible on each entry
- Empty state: "Your journal is empty. Start by browsing the catalog!"

#### FR-JRN-003: Edit Journal Entry
**Description**: Allow logged-in users to modify their journal entries.
**Acceptance Criteria**:
- Edit button opens journal entry form (pre-filled with current data)
- All fields editable: status, rating, review, favorite
- User can clear rating (set to unrated)
- User can clear review (delete text)
- User can toggle favorite on/off
- Save updates entry and shows success message
- Cancel discards changes and returns to previous view

#### FR-JRN-004: Delete Journal Entry
**Description**: Allow logged-in users to remove journal entries.
**Acceptance Criteria**:
- Delete button shows confirmation dialog: "Remove [title] from your journal?"
- Confirm deletes entry permanently
- Cancel dismisses dialog with no changes
- Deleted entry no longer appears in journal
- If entry was favorited, it's removed from favorites section

#### FR-JRN-005: Rate Content
**Description**: Allow logged-in users to rate content with 5-star system.
**Acceptance Criteria**:
- Rating input is 5-star system with half-star increments (0.5, 1.0, 1.5, ... 5.0)
- Rating is optional (user can leave unrated)
- Rating is saved as part of journal entry
- User can change rating at any time
- Rating contributes to content's average rating (visible on Content Detail)

#### FR-JRN-006: Write Review
**Description**: Allow logged-in users to write reviews for content.
**Acceptance Criteria**:
- Review text field accepts unlimited characters
- Review is optional (user can save entry without review)
- Review is public on user's profile and content detail page
- Review displays with "Read more" expansion if longer than 300 characters
- User can edit review at any time
- User can delete review (clear text and save)

#### FR-JRN-007: Mark Favorite
**Description**: Allow logged-in users to mark content as favorites.
**Acceptance Criteria**:
- Favorite toggle (heart icon) on journal entry form
- No limit on number of favorites a user can have
- Favorites appear in dedicated "My Favorites" view
- User can select up to 4 favorites to display on public profile
- Toggling favorite off removes from favorites list
- Favorite status is visible on journal entries with heart icon

#### FR-JRN-008: Filter by Watch Status
**Description**: Allow logged-in users to filter their journal by watch status.
**Acceptance Criteria**:
- Filter dropdown shows all statuses: Watching, Completed, Dropped, Plan to Watch, All
- Selecting a status shows only entries with that status
- "All" shows all entries regardless of status
- Filter state persists during session
- Count badge shows number of entries per status

---

### Module 4: User Profiles (PROF)

#### FR-PROF-001: View Own Profile
**Description**: Allow logged-in users to view their public profile as others see it.
**Acceptance Criteria**:
- Profile page accessible from navigation menu
- Profile displays: username, avatar, bio, 4 favorites, journal entries, stats
- Edit button visible for modifying profile data
- Stats show: total content logged, mean rating, favorites count
- Journal entries section shows all entries (paginated, 20 per page)
- Each journal entry shows: poster, title, status, rating, review snippet
- "Edit Profile" button navigates to profile edit form

#### FR-PROF-002: Edit Profile
**Description**: Allow logged-in users to customize their public profile.
**Acceptance Criteria**:
- Edit form allows changing: avatar (URL input), bio (max 160 chars), profile favorites
- Profile favorites selected from user's favorited content (max 4)
- Cannot select content not marked as favorite in journal
- Profile favorites displayed prominently at top of profile
- Selection order determines display order on profile
- Save updates profile and shows success message
- Cancel discards changes

#### FR-PROF-003: View Other User's Profile
**Description**: Allow users to view other users' public profiles.
**Acceptance Criteria**:
- Profile accessible via user search or direct URL
- Profile displays: username, avatar, bio, 4 favorites, journal entries, stats
- All journal entries are visible (public by default)
- Cannot edit another user's profile
- Clicking favorite or journal entry navigates to Content Detail
- URL format: /user/{username}
- Profile URLs are case-insensitive

#### FR-PROF-004: Search Users
**Description**: Allow users to search for other users by username.
**Acceptance Criteria**:
- User search bar accessible from navigation or dedicated page
- Search queries username field (case-insensitive, partial match)
- Results show top 10 matches with: username, avatar, bio snippet (first 50 chars)
- Clicking result navigates to user's public profile
- No results state: "No users found for '[query]'."
- Search is available to guests (public profiles)

#### FR-PROF-005: View Profile Stats
**Description**: Display statistics on user profiles.
**Acceptance Criteria**:
- Stats section shows: Total content logged, Mean rating, Favorites count
- Total content logged = count of all journal entries
- Mean rating = average of all rated entries (excludes unrated)
- Favorites count = count of entries with is_favorite = true
- Stats are visible on own profile and other users' profiles

---

### Module 5: Admin (ADM)

#### FR-ADM-001: Access Admin Dashboard
**Description**: Provide admin users with a central management hub.
**Acceptance Criteria**:
- Admin dashboard accessible at /admin (requires ADMIN role)
- Dashboard shows summary: pending requests count, total content count, recent requests
- Quick actions: "Review Pending Requests", "Add New Content", "Manage Catalog"
- Non-admin users see 403 Forbidden when accessing /admin
- Navigation shows "Admin" link when logged in as admin

#### FR-ADM-002: Review Content Requests
**Description**: Allow admins to review and process user content requests.
**Acceptance Criteria**:
- Request queue shows all requests sorted by submission date (oldest first)
- Each request shows: title, type, year, notes, submitted by, date
- Filter by status: All, Pending, Approved, Rejected
- Approve action opens content creation form (pre-filled with request data)
- Reject action opens rejection form (requires reason)
- Approving request marks it APPROVED and links to created content
- Rejecting request marks it REJECTED with reason stored
- User is notified of decision (in-app notification)

#### FR-ADM-003: Create Content
**Description**: Allow admins to add new K-dramas and K-movies to the catalog.
**Acceptance Criteria**:
- Content form accessible from admin dashboard
- Required fields: title, type (Drama/Movie), year
- Optional fields: synopsis, poster URL, genres (multi-select), cast, episodes (drama), duration (movie), country
- Slug auto-generated from title (editable)
- Validate poster URL is a valid image URL
- Save creates content record in database
- If creating from approved request, link request to content

#### FR-ADM-004: Edit Content
**Description**: Allow admins to edit existing content metadata.
**Acceptance Criteria**:
- Edit button on each content item in catalog management
- Edit form pre-filled with current data
- All fields editable except ID
- Save updates content record
- Changes are reflected immediately on public content pages

#### FR-ADM-005: Delete Content
**Description**: Allow admins to remove content from the catalog.
**Acceptance Criteria**:
- Delete button on each content item in catalog management
- Delete shows confirmation: "Delete [title]? This will also remove all journal entries for this content. This cannot be undone."
- Confirm deletes content and all associated journal entries (cascade)
- Cancel dismisses confirmation
- Deleted content no longer appears in catalog or search

#### FR-ADM-006: Manage Catalog
**Description**: Provide admins with a catalog management interface.
**Acceptance Criteria**:
- Catalog management shows all content in paginated table (50 items per page)
- Each row shows: poster thumbnail, title, type, year, genres, date added
- Search by title
- Filter by type (Drama/Movie)
- Sort by title, year, date added
- Actions column: Edit, Delete buttons
- "Add New Content" button at top

---

## API Contract

### Authentication Endpoints

#### POST /api/v1/auth/register
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "string (valid email)",
    "username": "string (3-30 chars, alphanumeric + underscore)",
    "password": "string (min 8 chars)"
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "data": {
      "user": { "id": "uuid", "email": "string", "username": "string", "role": "USER", "createdAt": "ISO8601" },
      "accessToken": "string",
      "refreshToken": "string"
    },
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
  ```
- **Errors**:
  - 409: `EMAIL_ALREADY_EXISTS`, `USERNAME_ALREADY_EXISTS`
  - 400: `VALIDATION_FAILED`

#### POST /api/v1/auth/login
- **Description**: Authenticate user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "rememberMe": "boolean (optional)"
  }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "user": { "id": "uuid", "email": "string", "username": "string", "role": "USER|ADMIN" },
      "accessToken": "string",
      "refreshToken": "string"
    },
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
  ```
- **Errors**:
  - 401: `AUTH_INVALID_CREDENTIALS`
  - 400: `VALIDATION_FAILED`

#### POST /api/v1/auth/logout
- **Description**: Logout user (invalidate refresh token)
- **Auth**: Required
- **Response (200)**: `{ "success": true, "statusCode": 200, "data": null, ... }`

#### POST /api/v1/auth/refresh
- **Description**: Refresh access token
- **Request Body**: `{ "refreshToken": "string" }`
- **Response (200)**: `{ "data": { "accessToken": "string", "refreshToken": "string" } }`
- **Errors**: 401: `AUTH_TOKEN_EXPIRED`, `AUTH_TOKEN_INVALID`

#### POST /api/v1/auth/forgot-password
- **Description**: Request password reset
- **Request Body**: `{ "email": "string" }`
- **Response (200)**: Generic success message (same for existing and non-existing emails)

#### POST /api/v1/auth/reset-password
- **Description**: Reset password with token
- **Request Body**: `{ "token": "string", "password": "string (min 8 chars)" }`
- **Response (200)**: Success message
- **Errors**: 400: `INVALID_TOKEN`, `TOKEN_EXPIRED`

### User Settings Endpoints

#### GET /api/v1/users/me
- **Description**: Get current user profile
- **Auth**: Required
- **Response (200)**: `{ "data": { "id", "email", "username", "role", "profile": { "avatarUrl", "bio", "profileFavorites" } } }`

#### PATCH /api/v1/users/me
- **Description**: Update current user profile
- **Auth**: Required
- **Request Body**: `{ "avatarUrl": "string (URL, optional)", "bio": "string (max 160, optional)", "profileFavorites": ["uuid"] (max 4, optional) }`
- **Response (200)**: Updated user profile

#### PATCH /api/v1/users/me/password
- **Description**: Change password
- **Auth**: Required
- **Request Body**: `{ "currentPassword": "string", "newPassword": "string (min 8 chars)" }`
- **Response (200)**: Success message
- **Errors**: 400: `INVALID_CURRENT_PASSWORD`

#### PATCH /api/v1/users/me/email
- **Description**: Change email
- **Auth**: Required
- **Request Body**: `{ "password": "string", "newEmail": "string (valid email)" }`
- **Response (200)**: Success message
- **Errors**: 409: `EMAIL_ALREADY_EXISTS`, 400: `INVALID_PASSWORD`

#### DELETE /api/v1/users/me
- **Description**: Delete account
- **Auth**: Required
- **Request Body**: `{ "password": "string" }`
- **Response (204)**: No content

### Content Endpoints

#### GET /api/v1/content
- **Description**: Browse content catalog
- **Auth**: Optional
- **Query Parameters**: `page (default: 1)`, `limit (default: 20, max: 100)`, `type (DRAMA|MOVIE|ALL)`, `genres (comma-separated)`, `sort (title|year|rating)`, `order (asc|desc)`
- **Response (200)**:
  ```json
  {
    "data": {
      "items": [{ "id", "title", "slug", "type", "year", "posterUrl", "genres", "avgRating", "loggedCount" }],
      "meta": { "total", "page", "limit", "totalPages" }
    }
  }
  ```

#### GET /api/v1/content/:slug
- **Description**: Get content detail
- **Auth**: Optional
- **Response (200)**:
  ```json
  {
    "data": {
      "id", "title", "slug", "type", "year", "synopsis", "posterUrl", "genres", "cast",
      "episodes (drama only)", "durationMinutes (movie only)", "country",
      "avgRating", "loggedCount",
      "userEntry": { "id", "status", "rating", "review", "isFavorite" } | null
    }
  }
  ```

#### GET /api/v1/content/search
- **Description**: Search content by title
- **Auth**: Optional
- **Query Parameters**: `q (required, string)`, `limit (default: 10)`
- **Response (200)**: `{ "data": { "items": [{ "id", "title", "slug", "type", "year", "posterUrl" }] } }`

#### GET /api/v1/content/featured
- **Description**: Get featured content for homepage
- **Auth**: Optional
- **Response (200)**:
  ```json
  {
    "data": {
      "featured": [{ "id", "title", "slug", "type", "posterUrl" }],
      "recentlyAdded": [{ "id", "title", "slug", "type", "year", "posterUrl" }],
      "topRated": [{ "id", "title", "slug", "type", "year", "posterUrl", "avgRating" }]
    }
  }
  ```

### Content Request Endpoints

#### POST /api/v1/content-requests
- **Description**: Submit content request
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "title": "string (required, 1-255 chars)",
    "type": "DRAMA|MOVIE (required)",
    "year": "number (optional)",
    "notes": "string (optional)"
  }
  ```
- **Response (201)**: `{ "data": { "id", "title", "type", "status": "PENDING", "createdAt" } }`
- **Errors**: 429: `RATE_LIMIT_EXCEEDED` (5 requests/day), 409: `DUPLICATE_REQUEST`

#### GET /api/v1/content-requests/me
- **Description**: Get user's content requests
- **Auth**: Required
- **Query Parameters**: `page`, `limit`, `status (PENDING|APPROVED|REJECTED|ALL)`
- **Response (200)**:
  ```json
  {
    "data": {
      "items": [{ "id", "title", "type", "year", "status", "rejectionReason", "createdAt", "reviewedAt" }],
      "meta": { "total", "page", "limit", "totalPages" }
    }
  }
  ```

### Journal Endpoints

#### GET /api/v1/journal
- **Description**: Get user's journal entries
- **Auth**: Required
- **Query Parameters**: `page`, `limit`, `status (WATCHING|COMPLETED|DROPPED|PLAN_TO_WATCH|ALL)`, `sort (updatedAt|createdAt|rating|title)`, `order (asc|desc)`
- **Response (200)**:
  ```json
  {
    "data": {
      "items": [{
        "id", "status", "rating", "review", "isFavorite", "createdAt", "updatedAt",
        "content": { "id", "title", "slug", "type", "year", "posterUrl", "genres" }
      }],
      "meta": { "total", "page", "limit", "totalPages" }
    }
  }
  ```

#### POST /api/v1/journal
- **Description**: Create journal entry
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "contentId": "uuid (required)",
    "status": "WATCHING|COMPLETED|DROPPED|PLAN_TO_WATCH (required)",
    "rating": "number (0.5-5.0, 0.5 increments, optional)",
    "review": "string (optional)",
    "isFavorite": "boolean (default: false)"
  }
  ```
- **Response (201)**: `{ "data": { "id", "status", "rating", "review", "isFavorite", "content": {...} } }`
- **Errors**: 409: `ENTRY_ALREADY_EXISTS`

#### GET /api/v1/journal/:id
- **Description**: Get single journal entry
- **Auth**: Required (must own entry)
- **Response (200)**: `{ "data": { "id", "status", "rating", "review", "isFavorite", "content": {...} } }`

#### PATCH /api/v1/journal/:id
- **Description**: Update journal entry
- **Auth**: Required (must own entry)
- **Request Body**: `{ "status", "rating", "review", "isFavorite" }` (all optional)
- **Response (200)**: Updated entry

#### DELETE /api/v1/journal/:id
- **Description**: Delete journal entry
- **Auth**: Required (must own entry)
- **Response (204)**: No content

#### GET /api/v1/journal/favorites
- **Description**: Get user's favorite entries
- **Auth**: Required
- **Response (200)**: `{ "data": { "items": [{ "id", "content": {...}, "rating" }], "profileFavorites": ["uuid"] } }`

#### PATCH /api/v1/journal/favorites/profile
- **Description**: Set profile favorites (max 4)
- **Auth**: Required
- **Request Body**: `{ "entryIds": ["uuid"] }` (max 4, must be marked as favorite)
- **Response (200)**: `{ "data": { "profileFavorites": ["uuid"] } }`

### User Profile Endpoints

#### GET /api/v1/users/:username
- **Description**: Get public user profile
- **Auth**: Optional
- **Response (200)**:
  ```json
  {
    "data": {
      "id", "username", "profile": { "avatarUrl", "bio" },
      "profileFavorites": [{ "id", "title", "slug", "type", "posterUrl" }],
      "stats": { "totalLogged", "meanRating", "favoritesCount" }
    }
  }
  ```
- **Errors**: 404: `USER_NOT_FOUND`

#### GET /api/v1/users/:username/journal
- **Description**: Get user's public journal entries
- **Auth**: Optional
- **Query Parameters**: `page`, `limit`, `status`, `sort`, `order`
- **Response (200)**: Same as GET /api/v1/journal

#### GET /api/v1/users/search
- **Description**: Search users by username
- **Auth**: Optional
- **Query Parameters**: `q (required)`, `limit (default: 10)`
- **Response (200)**:
  ```json
  {
    "data": {
      "items": [{ "id", "username", "profile": { "avatarUrl", "bio" } }]
    }
  }
  ```

### Admin Endpoints

#### GET /api/v1/admin/dashboard
- **Description**: Get admin dashboard summary
- **Auth**: Required (ADMIN role)
- **Response (200)**:
  ```json
  {
    "data": {
      "pendingRequestsCount": "number",
      "totalContentCount": "number",
      "recentRequests": [{ "id", "title", "type", "status", "createdAt" }]
    }
  }
  ```

#### GET /api/v1/admin/content-requests
- **Description**: Get all content requests (admin view)
- **Auth**: Required (ADMIN role)
- **Query Parameters**: `page`, `limit`, `status`
- **Response (200)**:
  ```json
  {
    "data": {
      "items": [{
        "id", "title", "type", "year", "notes", "status", "rejectionReason",
        "submittedBy": { "id", "username", "email" },
        "createdAt", "reviewedAt", "reviewedBy"
      }],
      "meta": {...}
    }
  }
  ```

#### POST /api/v1/admin/content-requests/:id/approve
- **Description**: Approve content request
- **Auth**: Required (ADMIN role)
- **Request Body**: `{ "contentData": { "title", "slug", "type", "year", "synopsis", "posterUrl", "genres", "cast", "episodes", "durationMinutes", "country" } }`
- **Response (200)**: `{ "data": { "request": {...}, "content": {...} } }`

#### POST /api/v1/admin/content-requests/:id/reject
- **Description**: Reject content request
- **Auth**: Required (ADMIN role)
- **Request Body**: `{ "reason": "string (required)" }`
- **Response (200)**: Updated request

#### POST /api/v1/admin/content
- **Description**: Create content directly
- **Auth**: Required (ADMIN role)
- **Request Body**:
  ```json
  {
    "title": "string (required)",
    "slug": "string (optional, auto-generated)",
    "type": "DRAMA|MOVIE (required)",
    "year": "number (required)",
    "synopsis": "string (optional)",
    "posterUrl": "string (URL, optional)",
    "genres": ["string"] (from predefined list),
    "cast": "string (comma-separated, optional)",
    "episodes": "number (drama, optional)",
    "durationMinutes": "number (movie, optional)",
    "country": "string (default: South Korea)",
    "isFeatured": "boolean (default: false)"
  }
  ```
- **Response (201)**: `{ "data": { "id", "title", "slug", ... } }`

#### PATCH /api/v1/admin/content/:id
- **Description**: Update content
- **Auth**: Required (ADMIN role)
- **Request Body**: All fields optional except ID
- **Response (200)**: Updated content

#### DELETE /api/v1/admin/content/:id
- **Description**: Delete content (cascade to journal entries)
- **Auth**: Required (ADMIN role)
- **Response (204)**: No content

#### GET /api/v1/admin/content
- **Description**: List all content for admin management
- **Auth**: Required (ADMIN role)
- **Query Parameters**: `page`, `limit (default: 50)`, `search`, `type`, `sort`, `order`
- **Response (200)**: `{ "data": { "items": [{ "id", "title", "type", "year", "genres", "createdAt" }], "meta": {...} } }`

---

## Data Model

### User
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Auto | PK | Unique identifier |
| email | VARCHAR(255) | Yes | UNIQUE, indexed, case-insensitive | User email |
| username | VARCHAR(30) | Yes | UNIQUE, indexed, case-insensitive | Display name |
| passwordHash | VARCHAR(255) | Yes | — | Hashed password (argon2) |
| role | ENUM | Yes | DEFAULT 'USER' | USER or ADMIN |
| createdAt | TIMESTAMP | Auto | NOT NULL | Account creation time |
| updatedAt | TIMESTAMP | Auto | NOT NULL | Last modification time |

### UserProfile
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| userId | UUID | Yes | PK, FK → User.id | One-to-one with User |
| avatarUrl | VARCHAR(500) | No | — | Avatar image URL |
| bio | VARCHAR(160) | No | — | Short bio text |
| profileFavorites | JSON (array of UUID) | No | Max 4 items | Ordered array of content IDs |
| createdAt | TIMESTAMP | Auto | NOT NULL | Profile creation time |
| updatedAt | TIMESTAMP | Auto | NOT NULL | Last modification time |

### Content
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Auto | PK | Unique identifier |
| title | VARCHAR(255) | Yes | indexed | English title |
| slug | VARCHAR(255) | Yes | UNIQUE, indexed | URL-friendly identifier |
| type | ENUM | Yes | — | DRAMA or MOVIE |
| year | INTEGER | Yes | — | Release year |
| synopsis | TEXT | No | — | Plot summary |
| posterUrl | VARCHAR(500) | No | — | Poster image URL |
| genres | JSON (array of strings) | Yes | DEFAULT [] | Array of genre strings |
| cast | TEXT | No | — | Comma-separated actor names |
| episodes | INTEGER | No | — | For dramas: total episodes |
| durationMinutes | INTEGER | No | — | For movies: duration in minutes |
| country | VARCHAR(100) | Yes | DEFAULT 'South Korea' | Country of origin |
| isFeatured | BOOLEAN | Yes | DEFAULT false | Featured on homepage |
| createdAt | TIMESTAMP | Auto | NOT NULL | Content added time |
| updatedAt | TIMESTAMP | Auto | NOT NULL | Last modification time |

### Genre (Pre-seeded)
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Auto | PK | Unique identifier |
| name | VARCHAR(50) | Yes | UNIQUE | Genre name |
| slug | VARCHAR(50) | Yes | UNIQUE | URL-friendly name |

**Pre-seeded Genres:** Romance, Drama, Comedy, Thriller, Mystery, Horror, Fantasy, Action, Historical, Medical, Legal, School, Slice of Life, Sci-Fi

### JournalEntry
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Auto | PK | Unique identifier |
| userId | UUID | Yes | FK → User.id, indexed | Entry owner |
| contentId | UUID | Yes | FK → Content.id, indexed | Content being tracked |
| status | ENUM | Yes | — | WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH |
| rating | DECIMAL(2,1) | No | CHECK (0.5 <= rating <= 5.0) | User rating (0.5-5.0) |
| review | TEXT | No | — | User review text |
| isFavorite | BOOLEAN | Yes | DEFAULT false | Favorite flag |
| createdAt | TIMESTAMP | Auto | NOT NULL | Entry creation time |
| updatedAt | TIMESTAMP | Auto | NOT NULL | Last modification time |

**Unique Constraint:** (userId, contentId)

### ContentRequest
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Auto | PK | Unique identifier |
| userId | UUID | Yes | FK → User.id | Requester |
| title | VARCHAR(255) | Yes | — | Requested title |
| type | ENUM | Yes | — | DRAMA or MOVIE |
| year | INTEGER | No | — | Release year (if known) |
| notes | TEXT | No | — | Additional notes from user |
| status | ENUM | Yes | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED |
| rejectionReason | TEXT | No | — | Admin's rejection reason |
| contentId | UUID | No | FK → Content.id | Created content (if approved) |
| createdAt | TIMESTAMP | Auto | NOT NULL | Request submission time |
| reviewedAt | TIMESTAMP | No | — | Admin review time |
| reviewedBy | UUID | No | FK → User.id | Admin who reviewed |

### RefreshToken
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Auto | PK | Unique identifier |
| userId | UUID | Yes | FK → User.id | Token owner |
| tokenHash | VARCHAR(255) | Yes | UNIQUE | Hashed refresh token |
| expiresAt | TIMESTAMP | Yes | — | Token expiration |
| createdAt | TIMESTAMP | Auto | NOT NULL | Token creation time |

---

## Non-Functional Requirements

### NFR-001: API Response Time
**Metric**: P95 latency under 200ms for all read endpoints, under 500ms for write endpoints
**Rationale**: User experience requires snappy interactions for browsing and journaling actions

### NFR-002: Database Query Performance
**Metric**: All queries must use proper indexes; no full table scans on paginated queries
**Rationale**: Performance degradation with growing data volume must be prevented

### NFR-003: Concurrent Users
**Metric**: System must handle 100 concurrent users without degradation
**Rationale**: MVP target of 100+ MAU with healthy DAU/MAU ratio

### NFR-004: Password Security
**Metric**: All passwords hashed with argon2id, minimum 8 characters, no maximum
**Rationale**: Industry-standard password security

### NFR-005: Session Security
**Metric**: JWT access tokens expire in 15 minutes; refresh tokens expire in 7 days (30 days with "remember me")
**Rationale**: Balance between security and user convenience

### NFR-006: Rate Limiting
**Metric**: 100 requests per minute per IP globally; 5 content requests per user per day
**Rationale**: Prevent abuse while allowing normal usage patterns

### NFR-007: Pagination Limits
**Metric**: Default 20 items per page, maximum 100 items per page
**Rationale**: Prevent excessive data transfer and query load

### NFR-008: Search Debounce
**Metric**: Search input debounced to 300ms before triggering API call
**Rationale**: Reduce unnecessary API calls during typing

---

## Quality Gates

| Gate | Metric | Target |
|------|--------|--------|
| Coverage | Statements | 80% |
| Coverage | Branches | 70% |
| Coverage | Functions | 80% |
| Coverage | Lines | 80% |
| Coverage | Services | 100% functions/lines |
| Coverage | Guards/Strategies | 100% functions/lines |
| Performance | P95 Latency (read) | < 200ms |
| Performance | P95 Latency (write) | < 500ms |
| Build | TypeScript | Strict mode, no `any` |
| Build | ESLint | No errors, no `eslint-disable` |

---

## Assumptions

1. Users will primarily interact with content they've already watched (journaling) rather than discover new content
2. 4 watch statuses are sufficient; "On-Hold" is Phase 2
3. Series-level tracking (not episode-level) is adequate for MVP
4. 50-100 seeded titles is sufficient for MVP user testing
5. Users will accept public profiles as default (no private profile option needed for MVP)
6. Single super-admin is sufficient for content moderation
7. Manual content seeding is acceptable; external API integration is Phase 2
8. English-only UI is acceptable for global audience
9. No follow relationships needed for taste discovery (public profiles sufficient)
10. No rewatch logging in MVP (one entry per content)
11. Featured content is admin-curated (editorial), not algorithmic
12. Admin account is pre-seeded; no public registration for admin role

---

## Risks

- **Risk: Catalog too small (50-100 titles)** — Impact: User frustration, low engagement — Mitigation: Seed high-quality, popular titles; prioritize content requests; fast admin response
- **Risk: Low user engagement** — Impact: Failed MVP hypothesis — Mitigation: Focus on core journaling loop; simple, friction-free experience
- **Risk: Admin overwhelmed by content requests** — Impact: Slow response, user frustration — Mitigation: Daily request limit per user (5); batch processing workflow
- **Risk: Users want private entries** — Impact: Feature gap vs. competitors — Mitigation: Document as Phase 2 feature; gather feedback
- **Risk: Performance issues with journal queries** — Impact: Slow page loads — Mitigation: Proper indexing on userId, contentId, status; pagination; caching strategy
- **Risk: Spam/abuse in reviews** — Impact: Content quality issues — Mitigation: Admin can delete content (cascade); report feature in Phase 2
- **Risk: Password reset via email not ready** — Impact: User lockout — Mitigation: Admin-assisted manual reset as fallback
