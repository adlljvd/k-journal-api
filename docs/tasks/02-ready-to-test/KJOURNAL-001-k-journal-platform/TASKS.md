# TASKS.md — K-Journal Platform MVP

## Overview

This document breaks down all Functional Requirements from SPEC.md into implementable tasks for engineering execution.

**Total FRs:** 29 (5 Auth, 5 Catalog, 8 Journal, 5 Profile, 6 Admin)

---

## Wave 1 — Infrastructure & Foundation

### TASK-F-001
Title: Initialize NestJS project with required dependencies
Type: feature
Wave: 1
Assigned: Slot A
Size: M
FR refs: NFR-001, NFR-004, NFR-005
QG ref: —
Test type: —

Description:
Initialize a new NestJS project with TypeScript strict mode. Install all required dependencies for the API: class-validator, class-transformer, @nestjs/jwt, @nestjs/passport, passport, passport-jwt, argon2, prisma, @prisma/client, and development dependencies. Configure tsconfig.json with strict mode enabled and no implicit any.

Acceptance criteria:
- NestJS project initialized with `nest new` CLI
- package.json contains all required dependencies
- tsconfig.json has strict: true, noImplicitAny: true
- ESLint configured with @typescript-eslint/recommended
- Project compiles without errors with `npm run build`
- main.ts bootstraps app on port 3000

Dependencies: none

---

### TASK-F-002
Title: Configure Prisma with database schema
Type: feature
Wave: 1
Assigned: Slot A
Size: M
FR refs: FR-AUTH-001, FR-CAT-001, FR-JRN-001, FR-PROF-001, FR-ADM-001
QG ref: —
Test type: —

Description:
Set up Prisma ORM and create the complete database schema matching the Data Model section of SPEC.md. Define all models: User, UserProfile, Content, Genre, JournalEntry, ContentRequest, RefreshToken. Include all indexes specified in NFR-002 (userId, contentId, email, username, slug). Set up proper relations and cascading deletes where specified.

Acceptance criteria:
- prisma/schema.prisma contains all 7 models exactly as specified
- All fields have correct types and constraints
- Unique constraints on: email, username, slug, (userId, contentId)
- Indexes on: userId, contentId, email (case-insensitive), username (case-insensitive), slug
- Enum types defined: Role (USER, ADMIN), ContentType (DRAMA, MOVIE), WatchStatus (WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH), RequestStatus (PENDING, APPROVED, REJECTED)
- Genre model pre-seeded with 14 genres from SPEC
- `npx prisma generate` runs successfully
- `npx prisma migrate dev --name init` creates initial migration

Dependencies: TASK-F-001

---

### TASK-F-003
Title: Create PrismaService with connection management
Type: feature
Wave: 1
Assigned: Slot A
Size: S
FR refs: NFR-002
QG ref: —
Test type: —

Description:
Create a PrismaService that extends PrismaClient and implements Nest lifecycle hooks (onModuleInit, onModuleDestroy). The service must handle database connections gracefully and support transaction injection for repository pattern.

Acceptance criteria:
- PrismaService in src/prisma/prisma.service.ts
- Implements onModuleInit to connect to database
- Implements onModuleDestroy to disconnect gracefully
- Provides $transaction method passthrough
- Exported via PrismaModule for global use
- Logger logs connection events

Dependencies: TASK-F-002

---

### TASK-F-004
Title: Create base repository pattern
Type: feature
Wave: 1
Assigned: Slot B
Size: M
FR refs: NFR-002
QG ref: —
Test type: —

Description:
Create an abstract BaseRepository class that provides standard CRUD operations with retry logic, pagination support, and transaction handling. All domain repositories will extend this base class.

Acceptance criteria:
- BaseRepository in src/common/repositories/base.repository.ts
- Generic type parameter for domain entity
- Constructor accepts PrismaService and optional transaction client via @Inject('PRISMA_TRANSACTION')
- Methods: create, findById, findPaginated, update, delete
- findPaginated returns { items, meta: { total, page, limit, totalPages } }
- All methods use getClient() which returns transaction client if available, else prisma
- All write operations wrapped in withRetry() with exponential backoff
- Pagination enforces max limit of 100 (NFR-007)

Dependencies: TASK-F-003

---

### TASK-F-005
Title: Create base service pattern
Type: feature
Wave: 1
Assigned: Slot B
Size: S
FR refs: NFR-002
QG ref: —
Test type: —

Description:
Create an abstract BaseService class that provides common service-level operations and error handling patterns. Services will extend this base class.

Acceptance criteria:
- BaseService in src/common/services/base.service.ts
- Generic type parameter for repository type
- Provides protected error handling methods
- Provides protected logger instance
- Template methods for common patterns
- All public methods return Result<T> type with success/error discrimination

Dependencies: TASK-F-004

---

### TASK-F-006
Title: Create common API response format
Type: feature
Wave: 1
Assigned: Slot B
Size: S
FR refs: NFR-001
QG ref: —
Test type: —

Description:
Create standardized API response DTOs and interceptors that wrap all responses in the format specified in the API Contract section. Include success, error, and paginated response wrappers.

Acceptance criteria:
- ApiResponseDto with fields: success, statusCode, data, requestId, timestamp
- PaginatedResponseDto with items and meta fields
- Error response format with code and message
- TransformInterceptor wraps all successful responses
- RequestIdMiddleware generates unique request IDs
- All responses match API Contract format exactly

Dependencies: TASK-F-001

---

### TASK-F-007
Title: Create exception filters and error codes
Type: feature
Wave: 1
Assigned: Slot C
Size: S
FR refs: FR-AUTH-001, FR-AUTH-002, FR-JRN-001
QG ref: —
Test type: —

Description:
Create global exception filters that transform all exceptions into the standardized API error format. Define all error codes from the API Contract section.

Acceptance criteria:
- AllErrorCodes enum with all codes from SPEC: EMAIL_ALREADY_EXISTS, USERNAME_ALREADY_EXISTS, VALIDATION_FAILED, AUTH_INVALID_CREDENTIALS, AUTH_TOKEN_EXPIRED, AUTH_TOKEN_INVALID, INVALID_TOKEN, TOKEN_EXPIRED, INVALID_CURRENT_PASSWORD, INVALID_PASSWORD, USER_NOT_FOUND, ENTRY_ALREADY_EXISTS, RATE_LIMIT_EXCEEDED, DUPLICATE_REQUEST
- HttpExceptionFilter catches all HTTP exceptions and formats response
- PrismaExceptionFilter catches Prisma errors (P2002 for unique violations) and maps to appropriate error codes
- ValidationExceptionFilter catches class-validator errors and formats with field-level messages
- All filters log errors with request context

Dependencies: TASK-F-006

---

### TASK-F-008
Title: Create validation pipes and decorators
Type: feature
Wave: 1
Assigned: Slot C
Size: S
FR refs: FR-AUTH-001, FR-AUTH-002
QG ref: —
Test type: —

Description:
Create custom validation decorators and configure global ValidationPipe with class-validator. Create decorators for common validation patterns used across DTOs.

Acceptance criteria:
- Global ValidationPipe configured with whitelist, forbidNonWhitelisted, transform
- @IsUsername decorator validates 3-30 alphanumeric + underscore
- @IsPassword decorator validates min 8 characters
- @IsOptionalUrl decorator validates optional URL fields
- @IsRating decorator validates 0.5-5.0 in 0.5 increments
- Custom error messages are user-friendly
- All DTOs use class-validator decorators

Dependencies: TASK-F-001

---

### TASK-F-009
Title: Create JWT authentication strategy
Type: feature
Wave: 1
Assigned: Slot C
Size: M
FR refs: FR-AUTH-002, FR-AUTH-003, NFR-005
QG ref: —
Test type: —

Description:
Implement JWT authentication using Passport. Create JwtStrategy that validates access tokens and extracts user payload. Create JwtAuthGuard for protecting routes.

Acceptance criteria:
- JwtStrategy extends PassportStrategy(Strategy)
- Validates token and returns { userId, email, role }
- JwtAuthGuard extends AuthGuard('jwt')
- JwtAuthGuard properly handles expired tokens with AUTH_TOKEN_EXPIRED error
- Access token expires in 15 minutes (NFR-005)
- Refresh token expires in 7 days (30 days with rememberMe)
- JwtModule registered with secret from environment

Dependencies: TASK-F-001

---

### TASK-F-010
Title: Create role-based authorization guard
Type: feature
Wave: 1
Assigned: Slot C
Size: S
FR refs: FR-ADM-001
QG ref: —
Test type: —

Description:
Create a RolesGuard that checks user role against required roles. Create @Roles decorator for specifying required roles on endpoints.

Acceptance criteria:
- @Roles decorator accepts Role enum values
- RolesGuard extracts user from request and checks role
- Returns 403 Forbidden with ADMIN_ONLY error for non-admin accessing admin routes
- Works in combination with JwtAuthGuard
- Admin role check for all /admin/* routes

Dependencies: TASK-F-009

---

### TASK-F-011
Title: Create rate limiting guard
Type: feature
Wave: 1
Assigned: Slot C
Size: S
FR refs: NFR-006
QG ref: —
Test type: —

Description:
Create a rate limiting guard using Redis or in-memory store. Implement global rate limit of 100 requests per minute per IP. Create @RateLimit decorator for custom limits per endpoint.

Acceptance criteria:
- ThrottlerModule configured with 100 req/min per IP globally
- @RateLimit decorator allows custom limits (used for content requests: 5/day)
- Returns 429 with RATE_LIMIT_EXCEEDED error when limit exceeded
- Rate limit headers included in response (X-RateLimit-Limit, X-RateLimit-Remaining)
- Skip rate limit for admin users

Dependencies: TASK-F-001

---

## Wave 2 — Authentication & User Management

### TASK-F-012
Title: Create User and UserProfile entities
Type: feature
Wave: 2
Assigned: Slot A
Size: S
FR refs: FR-AUTH-001, FR-PROF-002
QG ref: —
Test type: —

Description:
Create UserEntity and UserProfileEntity classes that map to Prisma models. Include all fields from the Data Model section. Create mapper functions for converting between Prisma models and domain entities.

Acceptance criteria:
- UserEntity with id, email, username, passwordHash, role, createdAt, updatedAt
- UserProfileEntity with userId, avatarUrl, bio, profileFavorites, createdAt, updatedAt
- toUserEntity and toUserProfileEntity mapper functions
- Entities exclude passwordHash from serialization
- profileFavorites typed as string[] (max 4)

Dependencies: TASK-F-003

---

### TASK-F-013
Title: Create UserRepository
Type: feature
Wave: 2
Assigned: Slot A
Size: S
FR refs: FR-AUTH-001, FR-AUTH-002, FR-AUTH-005
QG ref: —
Test type: —

Description:
Create UserRepository extending BaseRepository with methods for user CRUD operations. Include specialized queries for authentication use cases.

Acceptance criteria:
- Extends BaseRepository<User>
- Methods: create, findById, findByEmail, findByUsername, update, delete
- findByEmail and findByUsername are case-insensitive
- updateEmail checks for duplicate email before update
- updatePassword accepts hashed password
- delete soft-deletes user data while preserving anonymized journal counts
- All methods use this.getClient() and this.withRetry()

Dependencies: TASK-F-004, TASK-F-012

---

### TASK-F-014
Title: Create UserProfileRepository
Type: feature
Wave: 2
Assigned: Slot A
Size: S
FR refs: FR-PROF-001, FR-PROF-002
QG ref: —
Test type: —

Description:
Create UserProfileRepository extending BaseRepository with methods for profile CRUD operations.

Acceptance criteria:
- Extends BaseRepository<UserProfile>
- Methods: create (auto-created on user registration), findByUserId, update
- updateProfileFavorites validates max 4 items and all content exists
- findByUserIdWithFavorites includes content details for profile favorites
- All methods use this.getClient() and this.withRetry()

Dependencies: TASK-F-004, TASK-F-012

---

### TASK-F-015
Title: Create Auth service
Type: feature
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-AUTH-001, FR-AUTH-002, FR-AUTH-003, FR-AUTH-004, FR-AUTH-005
QG ref: —
Test type: —

Description:
Create AuthService with all authentication business logic: register, login, logout, refresh tokens, forgot-password, reset-password. Implement secure token generation and management.

Acceptance criteria:
- register: validates unique email/username, hashes password with argon2id, creates user + profile, returns tokens
- login: validates credentials with constant-time comparison, returns tokens
- logout: invalidates refresh token
- refreshTokens: validates refresh token, generates new access/refresh pair
- forgotPassword: generates reset token (expires 24h), stores hashed token
- resetPassword: validates token, updates password
- Password hashing uses argon2id with recommended parameters
- Refresh tokens stored hashed in database
- rememberMe extends refresh token to 30 days

Dependencies: TASK-F-013, TASK-F-009

---

### TASK-F-016
Title: Create Auth controller
Type: feature
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-AUTH-001, FR-AUTH-002, FR-AUTH-003, FR-AUTH-004, FR-AUTH-005
QG ref: —
Test type: —

Description:
Create AuthController with all authentication endpoints matching the API Contract exactly. Include proper validation, guards, and response formatting.

Acceptance criteria:
- POST /api/v1/auth/register with RegisterDto validation
- POST /api/v1/auth/login with LoginDto validation
- POST /api/v1/auth/logout (authenticated)
- POST /api/v1/auth/refresh with RefreshTokenDto
- POST /api/v1/auth/forgot-password with ForgotPasswordDto
- POST /api/v1/auth/reset-password with ResetPasswordDto
- All endpoints return ApiResponseDto format
- Error codes match SPEC exactly
- Validation errors return field-level messages

Dependencies: TASK-F-015, TASK-F-008

---

### TASK-F-017
Title: Create User service
Type: feature
Wave: 2
Assigned: Slot A
Size: M
FR refs: FR-AUTH-005, FR-PROF-001, FR-PROF-002, FR-PROF-005
QG ref: —
Test type: —

Description:
Create UserService with user management business logic: get current user, update profile, change password, change email, delete account. Include profile stats calculation.

Acceptance criteria:
- getCurrentUser: returns user with profile
- updateProfile: updates avatarUrl, bio, profileFavorites with validation
- changePassword: verifies current password, updates to new hashed password
- changeEmail: verifies password, checks uniqueness, updates email
- deleteAccount: verifies password, soft-deletes user data
- calculateStats: returns { totalLogged, meanRating, favoritesCount }
- Profile favorites max 4, must be marked as favorite in journal
- Bio max 160 characters

Dependencies: TASK-F-013, TASK-F-014

---

### TASK-F-018
Title: Create User controller
Type: feature
Wave: 2
Assigned: Slot A
Size: S
FR refs: FR-AUTH-005, FR-PROF-001, FR-PROF-002
QG ref: —
Test type: —

Description:
Create UserController with user settings and profile endpoints matching the API Contract.

Acceptance criteria:
- GET /api/v1/users/me (authenticated)
- PATCH /api/v1/users/me (authenticated) with UpdateProfileDto
- PATCH /api/v1/users/me/password (authenticated) with ChangePasswordDto
- PATCH /api/v1/users/me/email (authenticated) with ChangeEmailDto
- DELETE /api/v1/users/me (authenticated) with DeleteAccountDto
- All endpoints return ApiResponseDto format
- All require authentication

Dependencies: TASK-F-017

---

## Wave 2 — Content Catalog

### TASK-F-019
Title: Create Content and Genre entities
Type: feature
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-CAT-001, FR-CAT-003
QG ref: —
Test type: —

Description:
Create ContentEntity and GenreEntity classes mapping to Prisma models. Include all fields from Data Model. Create mappers for domain conversion.

Acceptance criteria:
- ContentEntity with id, title, slug, type, year, synopsis, posterUrl, genres, cast, episodes, durationMinutes, country, isFeatured, createdAt, updatedAt
- GenreEntity with id, name, slug
- toContentEntity and toGenreEntity mapper functions
- genres field typed as string[]
- Conditional fields: episodes (drama), durationMinutes (movie)

Dependencies: TASK-F-003

---

### TASK-F-020
Title: Create ContentRepository
Type: feature
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-CAT-001, FR-CAT-002, FR-CAT-003, FR-CAT-005
QG ref: —
Test type: —

Description:
Create ContentRepository extending BaseRepository with methods for content browsing, searching, and featured content retrieval.

Acceptance criteria:
- Extends BaseRepository<Content>
- Methods: create, findById, findBySlug, findPaginated, update, delete
- findPaginated supports filter by type, genres, sort by title/year/rating
- searchByTitle performs case-insensitive partial match with limit
- findFeatured returns isFeatured=true items
- findRecentlyAdded returns latest 6 items by createdAt
- findTopRated returns highest avgRating items with min 5 ratings
- findByIdWithUserEntry includes user's journal entry if exists
- All queries use proper indexes

Dependencies: TASK-F-004, TASK-F-019

---

### TASK-F-021
Title: Create Content service
Type: feature
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-CAT-001, FR-CAT-002, FR-CAT-003, FR-CAT-005
QG ref: —
Test type: —

Description:
Create ContentService with content browsing, searching, and discovery business logic.

Acceptance criteria:
- browse: paginated list with filters (type, genres) and sorting (title, year, rating)
- search: case-insensitive partial title match, debounced (frontend), returns top 10
- getDetail: returns full content with userEntry if authenticated
- getFeatured: returns { featured, recentlyAdded, topRated }
- Average rating calculated from journal entries
- loggedCount calculated from journal entries
- Empty states handled per SPEC

Dependencies: TASK-F-020

---

### TASK-F-022
Title: Create Content controller
Type: feature
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-CAT-001, FR-CAT-002, FR-CAT-003, FR-CAT-005
QG ref: —
Test type: —

Description:
Create ContentController with public content endpoints matching the API Contract.

Acceptance criteria:
- GET /api/v1/content with query params: page, limit, type, genres, sort, order
- GET /api/v1/content/search with query params: q, limit
- GET /api/v1/content/featured
- GET /api/v1/content/:slug
- All endpoints public (optional auth for userEntry on detail)
- Response includes avgRating, loggedCount
- Pagination meta includes total, page, limit, totalPages

Dependencies: TASK-F-021

---

### TASK-F-023
Title: Create ContentRequest entity and repository
Type: feature
Wave: 2
Assigned: Slot C
Size: S
FR refs: FR-CAT-004
QG ref: —
Test type: —

Description:
Create ContentRequestEntity and ContentRequestRepository with methods for request management.

Acceptance criteria:
- ContentRequestEntity with id, userId, title, type, year, notes, status, rejectionReason, contentId, createdAt, reviewedAt, reviewedBy
- ContentRequestRepository extends BaseRepository
- Methods: create, findById, findByUserId, findAll, updateStatus
- Rate limit check: count by userId where createdAt >= today
- findByUserId paginated with status filter

Dependencies: TASK-F-004

---

### TASK-F-024
Title: Create ContentRequest service
Type: feature
Wave: 2
Assigned: Slot C
Size: S
FR refs: FR-CAT-004
QG ref: —
Test type: —

Description:
Create ContentRequestService with request submission and retrieval logic. Implement daily rate limiting.

Acceptance criteria:
- createRequest: validates daily limit (5 per user), creates PENDING request
- getMyRequests: paginated list with status filter
- checkDailyLimit: returns true if under 5 requests today
- Duplicate title check returns DUPLICATE_REQUEST error
- Rate limit exceeded returns RATE_LIMIT_EXCEEDED error

Dependencies: TASK-F-023

---

### TASK-F-025
Title: Create ContentRequest controller
Type: feature
Wave: 2
Assigned: Slot C
Size: S
FR refs: FR-CAT-004
QG ref: —
Test type: —

Description:
Create ContentRequestController with user request endpoints.

Acceptance criteria:
- POST /api/v1/content-requests (authenticated) with CreateRequestDto
- GET /api/v1/content-requests/me (authenticated) with query params
- Returns 429 if daily limit exceeded
- Returns 409 if duplicate request

Dependencies: TASK-F-024

---

## Wave 3 — Journaling

### TASK-F-026
Title: Create JournalEntry entity
Type: feature
Wave: 3
Assigned: Slot A
Size: S
FR refs: FR-JRN-001, FR-JRN-002
QG ref: —
Test type: —

Description:
Create JournalEntryEntity class mapping to Prisma model. Include all fields and relations.

Acceptance criteria:
- JournalEntryEntity with id, userId, contentId, status, rating, review, isFavorite, createdAt, updatedAt
- Includes content relation (ContentEntity)
- Includes user relation (UserEntity)
- rating validated: 0.5-5.0 in 0.5 increments
- status enum: WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH

Dependencies: TASK-F-003

---

### TASK-F-027
Title: Create JournalRepository
Type: feature
Wave: 3
Assigned: Slot A
Size: M
FR refs: FR-JRN-001, FR-JRN-002, FR-JRN-003, FR-JRN-004, FR-JRN-007
QG ref: —
Test type: —

Description:
Create JournalRepository extending BaseRepository with comprehensive journal entry management methods.

Acceptance criteria:
- Extends BaseRepository<JournalEntry>
- Methods: create, findById, findByUserAndContent, findPaginatedByUser, update, delete
- findPaginatedByUser supports status filter, sort by updatedAt/createdAt/rating/title
- findByFavorites returns all isFavorite=true entries
- updateProfileFavorites validates entries exist and are marked favorite
- Exists check for (userId, contentId) uniqueness
- Includes content relation in all find methods
- Count methods for stats: totalByUser, ratedByUser, favoritesByUser

Dependencies: TASK-F-004, TASK-F-026

---

### TASK-F-028
Title: Create Journal service
Type: feature
Wave: 3
Assigned: Slot A
Size: M
FR refs: FR-JRN-001, FR-JRN-002, FR-JRN-003, FR-JRN-004, FR-JRN-005, FR-JRN-006, FR-JRN-007, FR-JRN-008
QG ref: —
Test type: —

Description:
Create JournalService with all journal entry CRUD and management logic. Handle rating calculation, favorites management, and filtering.

Acceptance criteria:
- create: validates content exists, checks uniqueness, creates entry
- getEntries: paginated with status filter, sorting, includes content
- getEntry: single entry by ID with ownership check
- update: partial update of status, rating, review, isFavorite
- delete: permanent deletion with confirmation
- getFavorites: returns all favorite entries with profile favorites selection
- setProfileFavorites: max 4, must be marked as favorite
- updateAverageRating: recalc content avgRating after rating change
- Stats calculation: totalLogged, meanRating, favoritesCount

Dependencies: TASK-F-027, TASK-F-020

---

### TASK-F-029
Title: Create Journal controller
Type: feature
Wave: 3
Assigned: Slot A
Size: S
FR refs: FR-JRN-001, FR-JRN-002, FR-JRN-003, FR-JRN-004, FR-JRN-005, FR-JRN-006, FR-JRN-007, FR-JRN-008
QG ref: —
Test type: —

Description:
Create JournalController with all journal endpoints matching API Contract.

Acceptance criteria:
- GET /api/v1/journal (authenticated) with query params
- POST /api/v1/journal (authenticated) with CreateJournalDto
- GET /api/v1/journal/:id (authenticated, ownership check)
- PATCH /api/v1/journal/:id (authenticated, ownership check) with UpdateJournalDto
- DELETE /api/v1/journal/:id (authenticated, ownership check)
- GET /api/v1/journal/favorites (authenticated)
- PATCH /api/v1/journal/favorites/profile (authenticated) with SetProfileFavoritesDto
- All endpoints return ApiResponseDto format
- 403 for non-owned entries

Dependencies: TASK-F-028

---

## Wave 3 — User Profiles

### TASK-F-030
Title: Create Profile service
Type: feature
Wave: 3
Assigned: Slot B
Size: M
FR refs: FR-PROF-001, FR-PROF-002, FR-PROF-003, FR-PROF-004, FR-PROF-005
QG ref: —
Test type: —

Description:
Create ProfileService with public profile viewing, user search, and profile stats logic.

Acceptance criteria:
- getProfile: returns public user profile with favorites, stats
- getPublicJournal: returns user's journal entries (paginated)
- searchUsers: case-insensitive partial username match, returns top 10
- calculateStats: totalLogged, meanRating, favoritesCount
- Profile favorites include content details
- 404 for non-existent user
- Username lookup is case-insensitive

Dependencies: TASK-F-014, TASK-F-027

---

### TASK-F-031
Title: Create Profile controller
Type: feature
Wave: 3
Assigned: Slot B
Size: S
FR refs: FR-PROF-001, FR-PROF-002, FR-PROF-003, FR-PROF-004, FR-PROF-005
QG ref: —
Test type: —

Description:
Create ProfileController with public profile endpoints.

Acceptance criteria:
- GET /api/v1/users/:username (public)
- GET /api/v1/users/:username/journal (public) with query params
- GET /api/v1/users/search (public) with query param: q
- All endpoints public (no auth required)
- 404 with USER_NOT_FOUND for non-existent user

Dependencies: TASK-F-030

---

## Wave 4 — Admin

### TASK-F-032
Title: Create Admin dashboard service
Type: feature
Wave: 4
Assigned: Slot A
Size: S
FR refs: FR-ADM-001
QG ref: —
Test type: —

Description:
Create AdminService with dashboard summary and admin-specific operations.

Acceptance criteria:
- getDashboard: returns pendingRequestsCount, totalContentCount, recentRequests
- All methods require ADMIN role
- recentRequests limited to 5, sorted by createdAt desc

Dependencies: TASK-F-020, TASK-F-023

---

### TASK-F-033
Title: Create Admin content request management
Type: feature
Wave: 4
Assigned: Slot A
Size: M
FR refs: FR-ADM-002
QG ref: —
Test type: —

Description:
Create AdminContentRequestService with request review and processing logic.

Acceptance criteria:
- getAllRequests: paginated with status filter, includes submitter info
- approveRequest: creates content from request data, links content to request, sends notification
- rejectRequest: sets status to REJECTED with reason, sends notification
- Content creation reuses ContentService
- Status transitions: PENDING -> APPROVED or PENDING -> REJECTED
- Notifications stored in-app (no email for MVP)

Dependencies: TASK-F-024, TASK-F-020

---

### TASK-F-034
Title: Create Admin content management service
Type: feature
Wave: 4
Assigned: Slot A
Size: M
FR refs: FR-ADM-003, FR-ADM-004, FR-ADM-005, FR-ADM-006
QG ref: —
Test type: —

Description:
Create AdminContentService with content CRUD operations for admin users.

Acceptance criteria:
- createContent: creates content with slug auto-generation from title
- updateContent: partial update of any field
- deleteContent: cascade deletes all journal entries, shows confirmation warning
- listContent: paginated with search by title, type filter, sorting
- Slug validation: unique, URL-friendly
- Poster URL validation: valid URL format
- All methods require ADMIN role

Dependencies: TASK-F-020

---

### TASK-F-035
Title: Create Admin controller
Type: feature
Wave: 4
Assigned: Slot A
Size: M
FR refs: FR-ADM-001, FR-ADM-002, FR-ADM-003, FR-ADM-004, FR-ADM-005, FR-ADM-006
QG ref: —
Test type: —

Description:
Create AdminController with all admin endpoints. All routes require ADMIN role.

Acceptance criteria:
- GET /api/v1/admin/dashboard (admin only)
- GET /api/v1/admin/content-requests (admin only) with query params
- POST /api/v1/admin/content-requests/:id/approve (admin only) with ApproveRequestDto
- POST /api/v1/admin/content-requests/:id/reject (admin only) with RejectRequestDto
- POST /api/v1/admin/content (admin only) with CreateContentDto
- PATCH /api/v1/admin/content/:id (admin only) with UpdateContentDto
- DELETE /api/v1/admin/content/:id (admin only)
- GET /api/v1/admin/content (admin only) with query params
- 403 for non-admin users

Dependencies: TASK-F-032, TASK-F-033, TASK-F-034, TASK-F-010

---

## Wave 5 — Seeding & Integration

### TASK-F-036
Title: Create database seeding script
Type: feature
Wave: 5
Assigned: Slot A
Size: M
FR refs: FR-CAT-001, FR-CAT-005
QG ref: —
Test type: —

Description:
Create Prisma seeding script that populates the database with 50-100 K-drama/K-movie titles and 14 predefined genres. Create initial admin user.

Acceptance criteria:
- Seed script in prisma/seed.ts
- 14 genres seeded: Romance, Drama, Comedy, Thriller, Mystery, Horror, Fantasy, Action, Historical, Medical, Legal, School, Slice of Life, Sci-Fi
- 50-100 content items with complete metadata (title, type, year, synopsis, posterUrl, genres, cast)
- Mix of DRAMA and MOVIE types
- Some items marked isFeatured=true for homepage
- Admin user created with credentials from environment
- `npx prisma db seed` runs successfully

Dependencies: TASK-F-002

---

### TASK-F-037
Title: Create integration test utilities
Type: feature
Wave: 5
Assigned: Slot B
Size: M
FR refs: NFR-001, NFR-002
QG ref: —
Test type: —

Description:
Create test utilities for integration testing: test database setup, authenticated request helpers, fixture factories.

Acceptance criteria:
- TestModuleFactory creates isolated test app with test database
- createTestUser helper creates user and returns auth tokens
- createTestContent helper creates content fixtures
- createTestJournalEntry helper creates journal fixtures
- cleanDatabase helper truncates all tables between tests
- Request helpers for authenticated/unauthenticated requests

Dependencies: TASK-F-003

---

## Test Tasks

---

### TASK-T-001
Title: Verify project setup and configuration
Type: test
Wave: 1
Assigned: Slot A
Size: S
FR refs: NFR-001, NFR-004, NFR-005
QG ref: QG-001-setup, QG: Build-Quality-Gates
Test type: unit

Description:
Write tests verifying NestJS project configuration, TypeScript strict mode, and dependency installation.

Acceptance criteria:
- tsconfig.json has strict: true verified
- All required dependencies installed verified
- ESLint configuration valid verified
- main.ts bootstraps correctly verified
- Environment validation works
- No `any` types in codebase (QG: Build-Quality-Gates)
- ESLint passes with zero errors (QG: Build-Quality-Gates)
- `tsc --noEmit` passes (QG: Build-Quality-Gates)

Dependencies: TASK-F-001

---

### TASK-T-002
Title: Verify Prisma schema and models
Type: test
Wave: 1
Assigned: Slot A
Size: S
FR refs: FR-AUTH-001, FR-CAT-001, FR-JRN-001
QG ref: QG-002-database
Test type: unit

Description:
Write tests verifying Prisma schema correctness, model definitions, and constraints.

Acceptance criteria:
- All 7 models defined correctly
- All enums defined correctly
- Unique constraints verified
- Indexes verified
- Relations defined correctly
- Cascading deletes verified

Dependencies: TASK-F-002

---

### TASK-T-003
Title: Verify BaseRepository pattern
Type: test
Wave: 1
Assigned: Slot B
Size: M
FR refs: NFR-002
QG ref: QG-003-repository
Test type: unit

Description:
Write unit tests for BaseRepository with mocked PrismaService. Test all CRUD methods, pagination, and retry logic.

Acceptance criteria:
- create method tested with mock verification
- findById method tested with mock verification
- findPaginated tested with pagination edge cases
- update method tested with mock verification
- delete method tested with mock verification
- getClient() returns transaction when available
- withRetry() retries on transient errors
- Coverage >= 80%

Dependencies: TASK-F-004

---

### TASK-T-004
Title: Verify AuthService registration flow
Type: test
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-AUTH-001
QG ref: QG-004-auth-registration, QG: P0-AUTH-001, QG: P0-AUTH-004, QG: P0-AUTH-005
Test type: unit

Description:
Write unit tests for AuthService.register method. Test success, validation, and error cases.

Acceptance criteria:
- Successful registration creates user with hashed password
- Duplicate email returns EMAIL_ALREADY_EXISTS
- Duplicate username returns USERNAME_ALREADY_EXISTS
- Invalid email format returns validation error
- Username format validated (3-30 chars, alphanumeric + underscore)
- Password minimum 8 chars validated
- Profile auto-created with defaults
- Tokens returned on success
- Coverage >= 80%
- P0-AUTH-001: Registration with valid data creates user and returns tokens
- P0-AUTH-004: Duplicate email registration rejected with correct error
- P0-AUTH-005: Duplicate username registration rejected with correct error (case-insensitive)

Dependencies: TASK-F-015

---

### TASK-T-005
Title: Verify AuthService login flow
Type: test
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-AUTH-002
QG ref: QG-005-auth-login, QG: P0-AUTH-002, QG: P0-SEC-002
Test type: unit

Description:
Write unit tests for AuthService.login method. Test credential validation, token generation, and rememberMe.

Acceptance criteria:
- Valid credentials return tokens and user
- Invalid email returns AUTH_INVALID_CREDENTIALS
- Invalid password returns AUTH_INVALID_CREDENTIALS
- rememberMe=true extends refresh token to 30 days
- rememberMe=false sets refresh token to 7 days
- Access token expires in 15 minutes
- Coverage >= 80%
- P0-AUTH-002: Login with valid credentials returns tokens
- P0-SEC-002: Refresh token expires in 7 days (30 days with rememberMe)

Dependencies: TASK-F-015

---

### TASK-T-006
Title: Verify AuthService token refresh flow
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-AUTH-002, FR-AUTH-003
QG ref: QG-006-auth-tokens
Test type: unit

Description:
Write unit tests for AuthService token refresh and logout methods.

Acceptance criteria:
- Valid refresh token returns new access/refresh pair
- Invalid refresh token returns AUTH_TOKEN_INVALID
- Expired refresh token returns AUTH_TOKEN_EXPIRED
- Logout invalidates refresh token
- Old refresh token cannot be reused after refresh (rotation)
- Coverage >= 80%

Dependencies: TASK-F-015

---

### TASK-T-007
Title: Verify password reset flow
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-AUTH-004
QG ref: QG-007-password-reset
Test type: unit

Description:
Write unit tests for AuthService forgotPassword and resetPassword methods.

Acceptance criteria:
- forgotPassword generates reset token for existing email
- forgotPassword returns generic message for non-existent email
- resetPassword with valid token updates password
- resetPassword with invalid token returns INVALID_TOKEN
- resetPassword with expired token returns TOKEN_EXPIRED
- Reset token expires after 24 hours
- Coverage >= 80%

Dependencies: TASK-F-015

---

### TASK-T-008
Title: Verify User settings flow
Type: test
Wave: 2
Assigned: Slot A
Size: M
FR refs: FR-AUTH-005
QG ref: QG-008-user-settings
Test type: unit

Description:
Write unit tests for UserService settings methods. Test password change, email change, and account deletion.

Acceptance criteria:
- changePassword with correct current password succeeds
- changePassword with incorrect current password returns INVALID_CURRENT_PASSWORD
- changeEmail with correct password and unique email succeeds
- changeEmail with existing email returns EMAIL_ALREADY_EXISTS
- deleteAccount with correct password removes user data
- deleteAccount preserves anonymized journal counts for stats
- Coverage >= 80%

Dependencies: TASK-F-017

---

### TASK-T-009
Title: Verify Content browsing and filtering
Type: test
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-CAT-001
QG ref: QG-009-content-browse
Test type: unit

Description:
Write unit tests for ContentService.browse method. Test pagination, filtering, and sorting.

Acceptance criteria:
- Paginated results with correct meta
- Filter by type (DRAMA/MOVIE/ALL) works
- Filter by genres (multi-select) works
- Sort by title (asc/desc) works
- Sort by year (newest/oldest) works
- Sort by average rating (highest) works
- Default pagination: 20 items, max 100
- Empty state handled correctly
- Coverage >= 80%

Dependencies: TASK-F-021

---

### TASK-T-010
Title: Verify Content search
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-CAT-002
QG ref: QG-010-content-search
Test type: unit

Description:
Write unit tests for ContentService.search method. Test partial matching and limits.

Acceptance criteria:
- Case-insensitive partial match works
- Returns top 10 results
- Returns empty array for no matches
- Coverage >= 80%

Dependencies: TASK-F-021

---

### TASK-T-011
Title: Verify Content detail with user entry
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-CAT-003
QG ref: QG-011-content-detail
Test type: unit

Description:
Write unit tests for ContentService.getDetail method. Test authenticated and unauthenticated access.

Acceptance criteria:
- Returns full content metadata
- Returns avgRating and loggedCount
- Returns userEntry for authenticated user with entry
- Returns null userEntry for authenticated user without entry
- Returns null userEntry for unauthenticated user
- 404 for non-existent slug
- Coverage >= 80%

Dependencies: TASK-F-021

---

### TASK-T-012
Title: Verify Content featured sections
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-CAT-005
QG ref: QG-012-content-featured
Test type: unit

Description:
Write unit tests for ContentService.getFeatured method. Test all homepage sections.

Acceptance criteria:
- featured array contains isFeatured=true items
- recentlyAdded contains latest 6 items
- topRated contains highest rated with min 5 ratings
- All items include poster, title, type
- Coverage >= 80%

Dependencies: TASK-F-021

---

### TASK-T-013
Title: Verify ContentRequest creation and limits
Type: test
Wave: 2
Assigned: Slot C
Size: S
FR refs: FR-CAT-004
QG ref: QG-013-content-request, QG: P0-SEC-003
Test type: unit

Description:
Write unit tests for ContentRequestService. Test creation, rate limiting, and retrieval.

Acceptance criteria:
- Request created with PENDING status
- Daily limit of 5 enforced
- Duplicate title returns DUPLICATE_REQUEST
- getMyRequests paginated with status filter
- Rate limit exceeded returns RATE_LIMIT_EXCEEDED
- Coverage >= 80%
- P0-SEC-003: Rate limiting enforced (5 content req/user/day)

Dependencies: TASK-F-024

---

### TASK-T-014
Title: Verify Journal entry CRUD
Type: test
Wave: 3
Assigned: Slot A
Size: M
FR refs: FR-JRN-001, FR-JRN-002, FR-JRN-003, FR-JRN-004
QG ref: QG-014-journal-crud, QG: P0-JRN-001, QG: P0-JRN-002
Test type: unit

Description:
Write unit tests for JournalService CRUD operations. Test uniqueness, ownership, and filtering.

Acceptance criteria:
- Create entry with required status only
- Create entry with optional rating, review, favorite
- Duplicate (userId, contentId) returns ENTRY_ALREADY_EXISTS
- Update partial fields independently
- Delete removes entry permanently
- Filter by status works
- Sort by updatedAt, createdAt, rating, title works
- Ownership checked on all operations
- Coverage >= 80%
- P0-JRN-001: Journal entry creation enforces one-per-user-per-content
- P0-JRN-002: Journal entry belongs only to owner

Dependencies: TASK-F-028

---

### TASK-T-015
Title: Verify rating system
Type: test
Wave: 3
Assigned: Slot A
Size: S
FR refs: FR-JRN-005
QG ref: QG-015-rating, QG: P0-JRN-003
Test type: unit

Description:
Write unit tests for rating functionality. Test validation and average calculation.

Acceptance criteria:
- Rating 0.5-5.0 in 0.5 increments validated
- Invalid rating returns validation error
- Clear rating (set to null) works
- Average rating recalculated on rating change
- Unrated entries excluded from mean calculation
- Coverage >= 80%
- P0-JRN-003: Rating must be 0.5-5.0 in 0.5 increments

Dependencies: TASK-F-028

---

### TASK-T-016
Title: Verify favorites system
Type: test
Wave: 3
Assigned: Slot A
Size: S
FR refs: FR-JRN-007
QG ref: QG-016-favorites
Test type: unit

Description:
Write unit tests for favorites functionality. Test marking, listing, and profile favorites.

Acceptance criteria:
- Toggle favorite on/off
- getFavorites returns all isFavorite=true entries
- setProfileFavorites max 4 enforced
- Cannot set non-favorite as profile favorite
- Profile favorites displayed on user profile
- Coverage >= 80%

Dependencies: TASK-F-028

---

### TASK-T-017
Title: Verify Profile viewing and stats
Type: test
Wave: 3
Assigned: Slot B
Size: M
FR refs: FR-PROF-001, FR-PROF-003, FR-PROF-005
QG ref: QG-017-profile
Test type: unit

Description:
Write unit tests for ProfileService. Test profile viewing, stats calculation, and journal display.

Acceptance criteria:
- getProfile returns user info, favorites, stats
- 404 for non-existent user
- Username lookup case-insensitive
- Stats: totalLogged, meanRating, favoritesCount calculated correctly
- Public journal entries paginated
- Coverage >= 80%

Dependencies: TASK-F-030

---

### TASK-T-018
Title: Verify User search
Type: test
Wave: 3
Assigned: Slot B
Size: S
FR refs: FR-PROF-004
QG ref: QG-018-user-search
Test type: unit

Description:
Write unit tests for ProfileService.searchUsers method.

Acceptance criteria:
- Case-insensitive partial match
- Returns top 10 results
- Returns username, avatar, bio snippet
- Empty array for no matches
- Coverage >= 80%

Dependencies: TASK-F-030

---

### TASK-T-019
Title: Verify Admin dashboard
Type: test
Wave: 4
Assigned: Slot A
Size: S
FR refs: FR-ADM-001
QG ref: QG-019-admin-dashboard, QG: P0-ADM-001
Test type: unit

Description:
Write unit tests for AdminService.getDashboard method.

Acceptance criteria:
- Returns pendingRequestsCount
- Returns totalContentCount
- Returns recentRequests limited to 5
- Non-admin access returns 403
- Coverage >= 80%
- P0-ADM-001: Non-admin cannot access admin endpoints

Dependencies: TASK-F-032

---

### TASK-T-020
Title: Verify Admin content request review
Type: test
Wave: 4
Assigned: Slot A
Size: M
FR refs: FR-ADM-002
QG ref: QG-020-admin-requests
Test type: unit

Description:
Write unit tests for AdminContentRequestService. Test approval and rejection flows.

Acceptance criteria:
- getAllRequests paginated with filters
- approveRequest creates content and links to request
- rejectRequest sets status with reason
- Status transitions verified
- Non-admin access returns 403
- Coverage >= 80%

Dependencies: TASK-F-033

---

### TASK-T-021
Title: Verify Admin content CRUD
Type: test
Wave: 4
Assigned: Slot A
Size: M
FR refs: FR-ADM-003, FR-ADM-004, FR-ADM-005, FR-ADM-006
QG ref: QG-021-admin-content
Test type: unit

Description:
Write unit tests for AdminContentService. Test content creation, editing, deletion, and listing.

Acceptance criteria:
- createContent with auto-slug generation
- Slug uniqueness enforced
- updateContent partial updates
- deleteContent cascades to journal entries
- listContent with search, filter, sort
- Non-admin access returns 403
- Coverage >= 80%

Dependencies: TASK-F-034

---

## Wave E2E — E2E Tests

### TASK-T-022-e2e
Title: E2E test - Authentication flow
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: M
FR refs: FR-AUTH-001, FR-AUTH-002, FR-AUTH-003
QG ref: QG-022-e2e-auth
Test type: e2e

Description:
Write end-to-end tests for complete authentication flow using test database.

Acceptance criteria:
- Register -> Login -> Access protected route -> Logout flow works
- Invalid credentials rejected
- Token refresh works
- Protected routes reject unauthenticated requests
- All responses match API format

Dependencies: TASK-F-016, TASK-F-037

---

### TASK-T-023-e2e
Title: E2E test - Content browsing flow
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: M
FR refs: FR-CAT-001, FR-CAT-002, FR-CAT-003, FR-CAT-005
QG ref: QG-023-e2e-content
Test type: e2e

Description:
Write end-to-end tests for content browsing, search, and discovery using seeded data.

Acceptance criteria:
- Browse with pagination works
- Filter by type and genres works
- Sort by various fields works
- Search returns matching results
- Detail page shows content with user entry
- Featured sections populated

Dependencies: TASK-F-022, TASK-F-036, TASK-F-037

---

### TASK-T-024-e2e
Title: E2E test - Journal flow
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: M
FR refs: FR-JRN-001, FR-JRN-002, FR-JRN-003, FR-JRN-004
QG ref: QG-024-e2e-journal
Test type: e2e

Description:
Write end-to-end tests for complete journal management flow.

Acceptance criteria:
- Add content to journal with status
- Update journal entry
- Delete journal entry
- Filter and sort journal entries
- View favorites

Dependencies: TASK-F-029, TASK-F-037

---

### TASK-T-025-e2e
Title: E2E test - Profile flow
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: S
FR refs: FR-PROF-001, FR-PROF-003, FR-PROF-004
QG ref: QG-025-e2e-profile
Test type: e2e

Description:
Write end-to-end tests for profile viewing and user search.

Acceptance criteria:
- View own profile
- View other user's profile
- Search for users
- Stats calculated correctly

Dependencies: TASK-F-031, TASK-F-037

---

### TASK-T-026-e2e
Title: E2E test - Admin flow
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: M
FR refs: FR-ADM-001, FR-ADM-002, FR-ADM-003
QG ref: QG-026-e2e-admin
Test type: e2e

Description:
Write end-to-end tests for admin operations using admin test user.

Acceptance criteria:
- Admin dashboard loads
- Content request review (approve/reject)
- Content CRUD operations
- Non-admin blocked from admin routes

Dependencies: TASK-F-035, TASK-F-037

---

### TASK-T-027
Title: Verify password hashing with argon2id
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-AUTH-001, NFR-005
QG ref: QG: P0-AUTH-003
Test type: unit

Description:
Write unit tests verifying that password hashing uses argon2id algorithm with recommended parameters. This is a non-negotiable P0 security scenario.

Acceptance criteria:
- Password hashing uses argon2id algorithm verified
- Hashing parameters meet security recommendations
- Hash verification works correctly
- Different passwords produce different hashes
- Coverage = 100% for hash function

Dependencies: TASK-F-015

---

### TASK-T-028
Title: Verify JWT token expiry times
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-AUTH-002, NFR-005
QG ref: QG: P0-SEC-001, QG: Coverage-Guards
Test type: unit

Description:
Write unit tests verifying JWT access token expires in exactly 15 minutes. This is a non-negotiable P0 security scenario.

Acceptance criteria:
- Access token expiresIn = 900 seconds (15 minutes) verified
- Token payload contains correct expiry timestamp
- Expired tokens are rejected
- JwtStrategy validates expiry correctly
- Coverage = 100% for JwtStrategy

Dependencies: TASK-F-009

---

### TASK-T-029
Title: Verify JwtAuthGuard implementation
Type: test
Wave: 2
Assigned: Slot B
Size: S
FR refs: FR-AUTH-002, FR-AUTH-003
QG ref: QG: Coverage-Guards
Test type: unit

Description:
Write unit tests for JwtAuthGuard covering all authentication scenarios. Guards require 100% coverage.

Acceptance criteria:
- Valid token passes guard
- Invalid/malformed token returns 401
- Expired token returns 401 with AUTH_TOKEN_EXPIRED
- Missing token returns 401
- User payload attached to request
- Coverage = 100%

Dependencies: TASK-F-009

---

### TASK-T-030
Title: Verify RolesGuard implementation
Type: test
Wave: 2
Assigned: Slot C
Size: S
FR refs: FR-ADM-001
QG ref: QG: Coverage-Guards
Test type: unit

Description:
Write unit tests for RolesGuard covering all authorization scenarios. Guards require 100% coverage.

Acceptance criteria:
- User with required role passes guard
- User without required role returns 403
- Missing user (no auth) returns 401
- Multiple roles checked correctly
- Coverage = 100%

Dependencies: TASK-F-010

---

### TASK-T-031
Title: Verify RateLimitGuard implementation
Type: test
Wave: 2
Assigned: Slot C
Size: S
FR refs: NFR-006
QG ref: QG: Coverage-Guards, QG: P0-SEC-003
Test type: unit

Description:
Write unit tests for RateLimitGuard covering rate limiting scenarios. Guards require 100% coverage.

Acceptance criteria:
- Requests under limit pass
- Requests over limit return 429 with RATE_LIMIT_EXCEEDED
- Rate limit headers included
- Admin users bypass rate limit
- Custom limits per endpoint work
- Coverage = 100%

Dependencies: TASK-F-011

---

### TASK-T-032
Title: Verify Services 100% coverage
Type: test
Wave: 5
Assigned: Slot A
Size: M
FR refs: NFR-001
QG ref: QG: Coverage-Services
Test type: unit

Description:
Write additional unit tests to ensure all service classes achieve 100% coverage. Focus on edge cases and error paths not covered by existing tests.

Acceptance criteria:
- AuthService coverage = 100%
- UserService coverage = 100%
- ContentService coverage = 100%
- JournalService coverage = 100%
- ProfileService coverage = 100%
- AdminService coverage = 100%
- All error paths tested
- All edge cases tested

Dependencies: TASK-F-015, TASK-F-017, TASK-F-021, TASK-F-028, TASK-F-030, TASK-F-032

---

### TASK-T-033-e2e
Title: Verify SQL injection prevention
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: S
FR refs: NFR-001
QG ref: QG: SEC-SQL
Test type: e2e

Description:
Write integration tests verifying SQL injection is prevented across all input fields. Test various injection patterns.

Acceptance criteria:
- SQL injection in username field prevented
- SQL injection in email field prevented
- SQL injection in review text prevented
- SQL injection in search query prevented
- No SQL execution from user input
- Prisma parameterized queries verified

Dependencies: TASK-F-037

---

### TASK-T-034
Title: Verify XSS sanitization
Type: test
Wave: 5
Assigned: Slot B
Size: S
FR refs: NFR-001
QG ref: QG: SEC-XSS
Test type: unit

Description:
Write unit tests verifying XSS is prevented in user-generated content fields. HTML should be escaped or removed.

Acceptance criteria:
- HTML in review text sanitized/escaped
- HTML in bio sanitized/escaped
- Script tags removed or escaped
- No executable code in output
- Coverage = 100% for sanitization function

Dependencies: TASK-F-017, TASK-F-028

---

### TASK-T-035-e2e
Title: Verify API performance - latency thresholds
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: M
FR refs: NFR-001, NFR-002
QG ref: QG: PERF-Latency
Test type: e2e

Description:
Write integration tests measuring API response latency against P95 thresholds specified in QUALITY.md.

Acceptance criteria:
- GET /content P95 < 200ms verified
- GET /content/:slug P95 < 200ms verified
- GET /journal P95 < 200ms verified
- POST /journal P95 < 500ms verified
- POST /auth/login P95 < 500ms verified
- Pagination queries use indexes (no full table scans)
- Search query uses index

Dependencies: TASK-F-037

---

### TASK-T-036-e2e
Title: Verify global rate limiting (100 req/min/IP)
Type: e2e
Wave: e2e
Assigned: Slot E2E
Size: S
FR refs: NFR-006
QG ref: QG: P0-SEC-003
Test type: e2e

Description:
Write integration tests verifying global rate limiting of 100 requests per minute per IP is enforced. This is a non-negotiable P0 security scenario.

Acceptance criteria:
- 100 requests within 1 minute pass
- 101st request within 1 minute returns 429
- Rate limit headers present in response
- Rate limit resets after 1 minute
- Different IPs have separate limits

Dependencies: TASK-F-011, TASK-F-037

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 73 |
| Feature Tasks | 37 |
| Unit Test Tasks | 29 |
| E2E Test Tasks | 7 |
| Waves | 5 (feature) + 1 (e2e) |

### Wave Breakdown

| Wave | Tasks | Focus |
|------|-------|-------|
| 1 | 11 | Infrastructure & Foundation |
| 2 | 17 | Auth, User, Content modules |
| 3 | 8 | Journal, Profile modules |
| 4 | 6 | Admin module |
| 5 | 10 | Seeding, Integration, Quality gates |
| E2E | 8 | E2E Tests (all e2e tests batched) |

### FR Coverage

| Module | FRs | Tasks |
|--------|-----|-------|
| AUTH | 5 | F-012 to F-018, T-004 to T-008, T-027, T-028, T-029, T-022-e2e |
| CAT | 5 | F-019 to F-025, T-009 to T-013, T-023-e2e |
| JRN | 8 | F-026 to F-029, T-014 to T-016, T-034, T-024-e2e |
| PROF | 5 | F-030 to F-031, T-017 to T-018, T-025-e2e |
| ADM | 6 | F-032 to F-035, T-019 to T-021, T-026-e2e |
| NFR | 8 | F-001 to F-011, T-001 to T-003, T-032, T-033-e2e, T-035-e2e, T-036-e2e |

### Slot Assignment

| Slot | Tasks |
|------|-------|
| A | 26 |
| B | 23 |
| C | 17 |
| E2E | 8 |

### QG Coverage Summary

| Quality Gate | Task Reference |
|--------------|----------------|
| P0-AUTH-001 | TASK-T-004 |
| P0-AUTH-002 | TASK-T-005 |
| P0-AUTH-003 | TASK-T-027 |
| P0-AUTH-004 | TASK-T-004 |
| P0-AUTH-005 | TASK-T-004 |
| P0-JRN-001 | TASK-T-014 |
| P0-JRN-002 | TASK-T-014 |
| P0-JRN-003 | TASK-T-015 |
| P0-ADM-001 | TASK-T-019 |
| P0-SEC-001 | TASK-T-028 |
| P0-SEC-002 | TASK-T-005 |
| P0-SEC-003 | TASK-T-013, TASK-T-031, TASK-T-036-e2e |
| Coverage-Guards | TASK-T-028, TASK-T-029, TASK-T-030, TASK-T-031 |
| Coverage-Services | TASK-T-032 |
| Build-Quality-Gates | TASK-T-001 |
| SEC-SQL | TASK-T-033-e2e |
| SEC-XSS | TASK-T-034 |
| PERF-Latency | TASK-T-035-e2e |
