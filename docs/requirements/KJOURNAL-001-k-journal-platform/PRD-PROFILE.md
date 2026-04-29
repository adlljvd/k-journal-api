=== PRD: User Profiles & Social Discovery ===
Version: 1.0
Scale: L
Project: kjournal-001-k-journal-platform
Flow Document ref: v0.1
MVP: IN
Status: Validated

═══════════════════════════════════════════════════════════════
1. PROBLEM STATEMENT
═══════════════════════════════════════════════════════════════

Users want to showcase their K-drama and K-movie taste through a public profile and discover other enthusiasts with similar interests. Unlike social platforms with follow relationships, K-Journal enables taste discovery through public profiles, favorites, and journal visibility.

**Current state:** No profile or social discovery system exists.
**Impact:** Users cannot express their identity or discover like-minded enthusiasts.
**What changes:** Users have public profiles with favorites, journal visibility, and stats; users can search for and view other users' profiles.

═══════════════════════════════════════════════════════════════
2. ROLES & PERMISSIONS
═══════════════════════════════════════════════════════════════

| Role | View Own Profile | Edit Own Profile | View Others' Profiles | Search Users | Manage Favorites |
|------|------------------|------------------|----------------------|--------------|------------------|
| GUEST | ✗ | ✗ | ✓ | ✓ | ✗ |
| USER | ✓ | ✓ | ✓ | ✓ | ✓ |
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ |

═══════════════════════════════════════════════════════════════
3. USER STORIES
═══════════════════════════════════════════════════════════════

### Story PROF-01: View Own Profile
As a logged-in user,
I want to view my public profile as others see it,
so that I can verify how my taste is presented.

**Acceptance Criteria:**
- AC-PROF-01-001: Profile page accessible from navigation menu
- AC-PROF-01-002: Profile displays: username, avatar, bio, 4 favorites, journal entries, stats
- AC-PROF-01-003: Edit button visible for modifying profile data
- AC-PROF-01-004: Stats show: total content logged, mean rating, favorites count
- AC-PROF-01-005: Journal entries section shows all entries (paginated, 20 per page)
- AC-PROF-01-006: Each journal entry shows: poster, title, status, rating, review snippet
- AC-PROF-01-007: "Edit Profile" button navigates to profile edit form

---

### Story PROF-02: Edit Profile
As a logged-in user,
I want to customize my public profile,
so that I can express my personality and taste.

**Acceptance Criteria:**
- AC-PROF-02-001: Edit form allows changing: avatar, bio, profile favorites
- AC-PROF-02-002: Avatar accepts image URL input (no upload for MVP)
- AC-PROF-02-003: Bio limited to 160 characters
- AC-PROF-02-004: Profile favorites selected from user's favorited content (max 4)
- AC-PROF-02-005: Cannot select content not marked as favorite in journal
- AC-PROF-02-006: Profile favorites displayed prominently at top of profile
- AC-PROF-02-007: Save updates profile and shows success message
- AC-PROF-02-008: Cancel discards changes

---

### Story PROF-03: View Other User's Profile
As a user,
I want to view another user's public profile,
so that I can discover their K-drama/K-movie taste.

**Acceptance Criteria:**
- AC-PROF-03-001: Profile accessible via user search or direct URL
- AC-PROF-03-002: Profile displays: username, avatar, bio, 4 favorites, journal entries, stats
- AC-PROF-03-003: All journal entries are visible (public by default)
- AC-PROF-03-004: Cannot edit another user's profile
- AC-PROF-03-005: Clicking favorite or journal entry navigates to Content Detail
- AC-PROF-03-006: URL format: /user/{username}

---

### Story PROF-04: Search Users
As a user,
I want to search for other users by username,
so that I can find and view their profiles.

**Acceptance Criteria:**
- AC-PROF-04-001: User search bar accessible from navigation or dedicated page
- AC-PROF-04-002: Search queries username field (case-insensitive, partial match)
- AC-PROF-04-003: Results show top 10 matches with: username, avatar, bio snippet
- AC-PROF-04-004: Clicking result navigates to user's public profile
- AC-PROF-04-005: No results state: "No users found for '[query]'."
- AC-PROF-04-006: Search is available to guests (public profiles)

---

### Story PROF-05: Select Profile Favorites
As a logged-in user,
I want to choose which 4 favorites to display on my profile,
so that I can showcase my top picks.

**Acceptance Criteria:**
- AC-PROF-05-001: Profile favorites selector shows all favorited content
- AC-PROF-05-002: User can select up to 4 items to display on profile
- AC-PROF-05-003: Selection order determines display order on profile
- AC-PROF-05-004: Removing a favorite from journal also removes from profile favorites
- AC-PROF-05-005: Empty slots show "Add favorite" placeholder

---

### Story PROF-06: View Profile Stats
As a user,
I want to see statistics on my profile,
so that I can understand my viewing patterns.

**Acceptance Criteria:**
- AC-PROF-06-001: Stats section shows: Total content logged, Mean rating, Favorites count
- AC-PROF-06-002: Total content logged = count of all journal entries
- AC-PROF-06-003: Mean rating = average of all rated entries (excludes unrated)
- AC-PROF-06-004: Favorites count = count of entries with is_favorite = true
- AC-PROF-06-005: Stats are visible on own profile and other users' profiles

═══════════════════════════════════════════════════════════════
4. BUSINESS RULES
═══════════════════════════════════════════════════════════════

| Rule ID | Rule |
|---------|------|
| BR-PROF-01 | All profiles are public (no private profiles in MVP) |
| BR-PROF-02 | All journal entries are visible on public profile |
| BR-PROF-03 | Profile favorites must be selected from content marked as favorite in journal |
| BR-PROF-04 | Maximum 4 profile favorites |
| BR-PROF-05 | Bio is limited to 160 characters |
| BR-PROF-06 | Avatar is URL-only (no file upload in MVP) |
| BR-PROF-07 | Username changes are not allowed (display name is username) |
| BR-PROF-08 | Mean rating excludes unrated entries (null ratings) |
| BR-PROF-09 | Profile URL uses username (not user ID) |
| BR-PROF-10 | Guests can search users and view public profiles (all profiles public) |
| BR-PROF-11 | Profile URLs are case-insensitive (e.g., /user/JohnDoe and /user/johndoe resolve to same profile) |
| BR-PROF-12 | "Copy profile link" feature is Phase 2; not in MVP |

═══════════════════════════════════════════════════════════════
5. DATA MODEL
═══════════════════════════════════════════════════════════════

## User Profile Entity (Extended from Auth PRD)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| user_id | UUID | FK -> User.id, PK | One-to-one with User |
| avatar_url | VARCHAR(500) | NULLABLE | Avatar image URL |
| bio | VARCHAR(160) | NULLABLE | Short bio text |
| profile_favorites | JSON/ARRAY | NULLABLE | Ordered array of up to 4 content IDs |
| created_at | TIMESTAMP | NOT NULL, auto | Profile creation time |
| updated_at | TIMESTAMP | NOT NULL, auto-update | Last modification time |

**Note:** User entity (username, email, etc.) defined in PRD-AUTH.md

**Computed Stats (not stored):**
- Total logged: COUNT(*) FROM journal_entries WHERE user_id = ?
- Mean rating: AVG(rating) FROM journal_entries WHERE user_id = ? AND rating IS NOT NULL
- Favorites count: COUNT(*) FROM journal_entries WHERE user_id = ? AND is_favorite = true

═══════════════════════════════════════════════════════════════
6. WORKFLOW MAP
═══════════════════════════════════════════════════════════════

```
Profile Setup (First Time):
[User registers] -> [Profile created with defaults]
    -> [User navigates to Profile] -> [Sees empty state]
    -> [Edits profile: avatar, bio, selects favorites]

Profile Discovery:
[User searches for username] -> [Results displayed]
    -> [Clicks result] -> [View public profile]
    -> [Sees favorites, stats, journal entries]
    -> [Clicks content] -> [Content Detail page]

Profile Edit:
[User on own profile] -> [Clicks Edit]
    -> [Edit form: avatar URL, bio, profile favorites]
    -> [Save] -> [Profile updated]
```

═══════════════════════════════════════════════════════════════
7. SCREEN SKELETON
═══════════════════════════════════════════════════════════════

**Screen Inventory:**

| ID | Name | Accessible to | Reached from | MVP |
|----|------|---------------|--------------|-----|
| S-PROF-01 | Own Profile (View) | User | Navigation, Settings | YES |
| S-PROF-02 | Own Profile (Edit) | User | Own profile view | YES |
| S-PROF-03 | Other User Profile | All | User search, Direct URL | YES |
| S-PROF-04 | User Search | All | Navigation | YES |

---

**[S-PROF-01] Own Profile (View)**

Purpose: View own public profile as others see it
Accessible to: User only (own profile)
Reached from: Navigation menu "My Profile", Settings

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Username | User.username | H1 | NO |
| Avatar | UserProfile.avatar_url | Image | NO |
| Bio | UserProfile.bio | Text | NO |
| Profile favorites | UserProfile.profile_favorites | 4 content cards | NO |
| Stats | Computed | Stats section | NO |
| Journal entries | JournalEntry table | Paginated list | NO |

Stats section:
- Total logged: X titles
- Mean rating: X.X stars
- Favorites: X titles

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Edit profile | "Edit Profile" | Always (own profile) | Navigate to edit form |
| View entry | Click journal entry | Always | Navigate to Content Detail |
| View favorite | Click profile favorite | Always | Navigate to Content Detail |

States:
- Loading: Skeleton loaders
- Empty favorites: "Add favorites to showcase your top picks here."
- Empty journal: "No entries yet. Start tracking your K-dramas and K-movies!"
- No avatar: Show default avatar placeholder

Navigation:
- Edit → /profile/edit
- Entry click → /content/{slug}

---

**[S-PROF-02] Own Profile (Edit)**

Purpose: Edit own profile information
Accessible to: User only
Reached from: Own profile view

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Avatar URL | User input | Text field (URL) | YES |
| Bio | User input | Textarea (max 160 chars) | YES |
| Profile favorites | User selection | Multi-select from favorites | YES |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Save | "Save Changes" | Always | Update profile, redirect to view |
| Cancel | "Cancel" | Always | Discard changes, redirect to view |

Profile Favorites Selection:
- Shows all favorited content from journal
- User clicks to select/deselect (max 4)
- Selected items show checkmark and position number
- Drag to reorder (optional, nice-to-have)

States:
- Loading: Button spinner during save
- Success: "Profile updated!" toast
- Error: "Unable to save. Please try again."
- No favorites: "Mark some content as favorites in your journal to display them here."

Validation:
| Field | Rule | Error Message |
|-------|------|---------------|
| Avatar URL | Valid URL format (optional) | "Please enter a valid URL." |
| Bio | Max 160 characters | "Bio must be 160 characters or less." |
| Profile favorites | Max 4 items | N/A (enforced by UI) |

Navigation:
- Save → /user/{username}
- Cancel → /user/{username}

---

**[S-PROF-03] Other User Profile**

Purpose: View another user's public profile
Accessible to: All (Guest, User, Admin)
Reached from: User search results, Direct URL

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Username | User.username | H1 | NO |
| Avatar | UserProfile.avatar_url | Image | NO |
| Bio | UserProfile.bio | Text | NO |
| Profile favorites | UserProfile.profile_favorites | 4 content cards | NO |
| Stats | Computed | Stats section | NO |
| Journal entries | JournalEntry table | Paginated list | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| View entry | Click journal entry | Always | Navigate to Content Detail |
| View favorite | Click profile favorite | Always | Navigate to Content Detail |

States:
- Loading: Skeleton loaders
- User not found: "User not found. The username may have been changed or the account deleted."
- Empty favorites: "This user hasn't added any favorites yet."
- Empty journal: "This user hasn't logged any content yet."

Navigation:
- Entry click → /content/{slug}

---

**[S-PROF-04] User Search**

Purpose: Find other users by username
Accessible to: All (Guest, User, Admin)
Reached from: Navigation menu, Header search

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Search input | User input | Text field | YES |
| Results list | User table | List of user cards | NO |

Each result shows:
- Avatar (or placeholder)
- Username
- Bio snippet (first 50 chars)

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Search | Submit search | Input has text | Display results |
| View profile | Click result | Always | Navigate to user profile |

States:
- Loading: Skeleton loaders during search
- Empty: "No users found for '[query]'. Try a different search."
- No query: "Enter a username to search for users."

Navigation:
- Result click → /user/{username}

═══════════════════════════════════════════════════════════════
8. ENTRY POINTS PER ROLE
═══════════════════════════════════════════════════════════════

| Role | Entry Points |
|------|--------------|
| Guest | User search, View public profiles (direct URL or search result) |
| User | My Profile, User search, View any public profile |
| Admin | Same as User |

═══════════════════════════════════════════════════════════════
9. NOTIFICATIONS
═══════════════════════════════════════════════════════════════

No system notifications for profile actions. Toast confirmations for save are sufficient.

═══════════════════════════════════════════════════════════════
10. SCOPE
═══════════════════════════════════════════════════════════════

**In MVP:**
- View own profile
- Edit profile (avatar URL, bio, profile favorites)
- View other users' public profiles
- User search by username
- Profile favorites selection (up to 4)
- Basic stats (total logged, mean rating, favorites count)
- Public journal entries visible on profile

**Not in MVP (Phase 2+):**
- Follow/unfollow users
- Follower/following counts
- Activity feed
- Private profiles or private entries
- Profile customization (themes, colors)
- Badge/achievement system
- Profile sharing links (beyond URL)
- Block/mute users
- Avatar image upload (URL only for MVP)
- Advanced stats (ratings distribution, genre breakdown)

═══════════════════════════════════════════════════════════════
11. OPEN ITEMS
═══════════════════════════════════════════════════════════════

No open items. All decisions confirmed.
