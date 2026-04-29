=== PRD: Journaling & Tracking ===
Version: 1.0
Scale: L
Project: kjournal-001-k-journal-platform
Flow Document ref: v0.1
MVP: IN
Status: Validated

═══════════════════════════════════════════════════════════════
1. PROBLEM STATEMENT
═══════════════════════════════════════════════════════════════

Users want to track their K-drama and K-movie viewing journey by setting watch status, rating content, writing short reviews, and marking favorites. This is the core value proposition of K-Journal: "Track what you watch. Express your taste."

**Current state:** No tracking system exists.
**Impact:** Users cannot maintain a personal record of their Korean content journey.
**What changes:** Users can create and manage journal entries with status, ratings, reviews, and favorites.

═══════════════════════════════════════════════════════════════
2. ROLES & PERMISSIONS
═══════════════════════════════════════════════════════════════

| Role | Create Entry | Edit Own Entry | Delete Own Entry | View Own Journal | View Others' Journal |
|------|--------------|----------------|------------------|------------------|---------------------|
| GUEST | ✗ | ✗ | ✗ | ✗ | ✓ (public entries only) |
| USER | ✓ | ✓ | ✓ | ✓ | ✓ (public entries only) |
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ (all entries) |

═══════════════════════════════════════════════════════════════
3. USER STORIES
═══════════════════════════════════════════════════════════════

### Story JRN-01: Add Content to Journal
As a logged-in user,
I want to add a K-drama or K-movie to my personal journal,
so that I can track my viewing progress and thoughts.

**Acceptance Criteria:**
- AC-JRN-01-001: "Add to Journal" button visible on Content Detail page
- AC-JRN-01-002: Clicking opens journal entry form (modal or dedicated page)
- AC-JRN-01-003: User can select watch status: WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH
- AC-JRN-01-004: User can optionally set rating (0.5 to 5.0 stars, 0.5 increments)
- AC-JRN-01-005: User can optionally write review (no character limit)
- AC-JRN-01-006: User can optionally mark as favorite
- AC-JRN-01-007: User can save with minimal data (status only)
- AC-JRN-01-008: One journal entry per user per content (enforced)
- AC-JRN-01-009: Success message: "Added to your journal!"
- AC-JRN-01-010: Cancel returns to Content Detail with no changes

---

### Story JRN-02: View Personal Journal
As a logged-in user,
I want to see all my journal entries in one place,
so that I can review my K-drama/K-movie journey.

**Acceptance Criteria:**
- AC-JRN-02-001: Journal page accessible from navigation
- AC-JRN-02-002: Displays all user's journal entries sorted by most recently updated
- AC-JRN-02-003: Each entry shows: poster, title, type, watch status, rating (if set), review snippet (if set), favorite icon (if marked)
- AC-JRN-02-004: User can filter entries by watch status
- AC-JRN-02-005: User can sort entries by: date added, date updated, rating, title
- AC-JRN-02-006: Clicking entry navigates to Content Detail page
- AC-JRN-02-007: Edit and Delete buttons visible on each entry
- AC-JRN-02-008: Empty state: "Your journal is empty. Start by browsing the catalog!"

---

### Story JRN-03: Edit Journal Entry
As a logged-in user,
I want to edit my journal entry,
so that I can update my status, rating, or review.

**Acceptance Criteria:**
- AC-JRN-03-001: Edit button opens journal entry form (pre-filled with current data)
- AC-JRN-03-002: All fields editable: status, rating, review, favorite
- AC-JRN-03-003: User can clear rating (set to unrated)
- AC-JRN-03-004: User can clear review (delete text)
- AC-JRN-03-005: User can toggle favorite on/off
- AC-JRN-03-006: Save updates entry and shows success message
- AC-JRN-03-007: Cancel discards changes and returns to previous view

---

### Story JRN-04: Delete Journal Entry
As a logged-in user,
I want to remove a journal entry,
so that I can clean up my journal.

**Acceptance Criteria:**
- AC-JRN-04-001: Delete button shows confirmation dialog: "Remove [title] from your journal?"
- AC-JRN-04-002: Confirm deletes entry permanently
- AC-JRN-04-003: Cancel dismisses dialog with no changes
- AC-JRN-04-004: Deleted entry no longer appears in journal
- AC-JRN-04-005: If entry was favorited, it's removed from favorites section

---

### Story JRN-05: Rate Content
As a logged-in user,
I want to rate K-dramas and K-movies with stars,
so that I can express my opinion quantitatively.

**Acceptance Criteria:**
- AC-JRN-05-001: Rating input is 5-star system with half-star increments (0.5, 1.0, 1.5, ... 5.0)
- AC-JRN-05-002: Rating is optional (user can leave unrated)
- AC-JRN-05-003: Rating is saved as part of journal entry
- AC-JRN-05-004: User can change rating at any time
- AC-JRN-05-005: Rating contributes to content's average rating (visible on Content Detail)

---

### Story JRN-06: Write Review
As a logged-in user,
I want to write a short review for content I've watched,
so that I can capture my thoughts and share them.

**Acceptance Criteria:**
- AC-JRN-06-001: Review text field accepts unlimited characters
- AC-JRN-06-002: Review is optional (user can save entry without review)
- AC-JRN-06-003: Review is public on user's profile and content detail page
- AC-JRN-06-004: Review displays with "Read more" expansion if longer than 300 characters
- AC-JRN-06-005: User can edit review at any time
- AC-JRN-06-006: User can delete review (clear text and save)

---

### Story JRN-07: Mark Favorite
As a logged-in user,
I want to mark certain content as favorites,
so that I can highlight my top picks.

**Acceptance Criteria:**
- AC-JRN-07-001: Favorite toggle (heart icon) on journal entry form
- AC-JRN-07-002: No limit on number of favorites a user can have
- AC-JRN-07-003: Favorites appear in dedicated "My Favorites" view
- AC-JRN-07-004: User can select up to 4 favorites to display on public profile
- AC-JRN-07-005: Toggling favorite off removes from favorites list
- AC-JRN-07-006: Favorite status is visible on journal entries with heart icon

---

### Story JRN-08: Filter by Watch Status
As a logged-in user,
I want to filter my journal by watch status,
so that I can see specific subsets of my tracked content.

**Acceptance Criteria:**
- AC-JRN-08-001: Filter dropdown shows all statuses: Watching, Completed, Dropped, Plan to Watch, All
- AC-JRN-08-002: Selecting a status shows only entries with that status
- AC-JRN-08-003: "All" shows all entries regardless of status
- AC-JRN-08-004: Filter state persists during session
- AC-JRN-08-005: Count badge shows number of entries per status

═══════════════════════════════════════════════════════════════
4. BUSINESS RULES
═══════════════════════════════════════════════════════════════

| Rule ID | Rule |
|---------|------|
| BR-JRN-01 | One journal entry per user per content (unique constraint) |
| BR-JRN-02 | Rating is stored as decimal (0.5 increments: 0.5, 1.0, 1.5, ..., 5.0) |
| BR-JRN-03 | Rating null is allowed (unrated state) |
| BR-JRN-04 | Review null is allowed (no review) |
| BR-JRN-05 | Watch status is required (cannot be null) |
| BR-JRN-06 | Favorite flag defaults to false |
| BR-JRN-07 | Journal entries are public by default (visible on public profile) |
| BR-JRN-08 | Deleting journal entry also removes from favorites and profile stats |
| BR-JRN-09 | Updated_at timestamp changes on any field modification |
| BR-JRN-10 | Users cannot log multiple views/rewatches (one entry per content) |
| BR-JRN-11 | Watch date tracking (diary date) is Phase 2; not in MVP |
| BR-JRN-12 | "Plan to Watch" entries are visible on public profile (all entries public) |

═══════════════════════════════════════════════════════════════
5. DATA MODEL
═══════════════════════════════════════════════════════════════

## Journal Entry Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK -> User.id, NOT NULL | Entry owner |
| content_id | UUID | FK -> Content.id, NOT NULL | Content being tracked |
| status | ENUM | NOT NULL | WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH |
| rating | DECIMAL(2,1) | NULLABLE, CHECK (0.5 <= rating <= 5.0) | User rating |
| review | TEXT | NULLABLE | User review text |
| is_favorite | BOOLEAN | NOT NULL, DEFAULT FALSE | Favorite flag |
| created_at | TIMESTAMP | NOT NULL, auto | Entry creation time |
| updated_at | TIMESTAMP | NOT NULL, auto-update | Last modification time |

**Unique Constraint:** (user_id, content_id)

**Indexes:**
- user_id (for user's journal queries)
- content_id (for content stats)
- status (for filtering)

═══════════════════════════════════════════════════════════════
6. WORKFLOW MAP
═══════════════════════════════════════════════════════════════

```
Journal Entry Creation:
[User on Content Detail] -> [Click "Add to Journal"]
    -> [Journal Entry Form]
    -> [Select status (required)] -> [Optional: rating, review, favorite]
    -> [Save] -> [Entry created] -> [Redirect to Journal or stay on page]

Journal Entry Edit:
[User on Journal or Content Detail] -> [Click "Edit"]
    -> [Journal Entry Form (pre-filled)]
    -> [Modify fields]
    -> [Save] -> [Entry updated]

Journal Entry Delete:
[User on Journal] -> [Click "Delete"]
    -> [Confirmation Dialog]
    -> [Confirm] -> [Entry deleted] -> [Journal refreshes]
```

═══════════════════════════════════════════════════════════════
7. SCREEN SKELETON
═══════════════════════════════════════════════════════════════

**Screen Inventory:**

| ID | Name | Accessible to | Reached from | MVP |
|----|------|---------------|--------------|-----|
| S-JRN-01 | Personal Journal | User | Navigation, Content Detail | YES |
| S-JRN-02 | Journal Entry Form | User | Content Detail, Journal | YES |
| S-JRN-03 | My Favorites | User | Navigation, Profile | YES |

---

**[S-JRN-01] Personal Journal**

Purpose: View and manage all user's journal entries
Accessible to: User (own journal)
Reached from: Navigation menu, Post-login redirect, Content Detail

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Entry list | Journal Entry table (user's) | Card/Grid | View only |
| Poster | Content.poster_url | Image | NO |
| Title | Content.title | Text | NO |
| Type | Content.type | Badge | NO |
| Status | JournalEntry.status | Badge | NO |
| Rating | JournalEntry.rating | Stars | NO |
| Review snippet | JournalEntry.review | Text (truncated to 150 chars) | NO |
| Favorite icon | JournalEntry.is_favorite | Heart icon | NO |
| Date added | JournalEntry.created_at | Date | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Filter by status | Status filter dropdown | Always | Filter entries |
| Sort | Sort dropdown | Always | Reorder entries |
| View content | Click entry card | Always | Navigate to Content Detail |
| Edit | "Edit" button | Each entry | Open Journal Entry Form |
| Delete | "Delete" button | Each entry | Show confirmation dialog |

States:
- Loading: Skeleton loaders
- Empty: "Your journal is empty. Start by browsing the catalog!" + CTA to /catalog
- Error: "Unable to load your journal. Please try again."

Navigation:
- Entry click → /content/{slug}
- Edit → Journal Entry Form (modal or page)
- Delete → Confirmation dialog

---

**[S-JRN-02] Journal Entry Form**

Purpose: Create or edit a journal entry
Accessible to: User only
Reached from: Content Detail (Add to Journal / Edit), Journal (Edit)

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Content info | Content record | Display (poster, title, type) | NO |
| Watch status | User input | Radio/Dropdown (WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH) | YES |
| Rating | User input | Star rating (0.5-5.0) | YES |
| Review | User input | Textarea | YES |
| Favorite | User input | Heart toggle | YES |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Save | "Save to Journal" | Form valid | Save entry, show success |
| Cancel | "Cancel" | Always | Discard changes, close form |

States:
- New entry: All fields empty/default
- Edit entry: Fields pre-filled with current values
- Loading: Button spinner during save
- Success: "Saved to your journal!" toast notification
- Error: "Unable to save. Please try again."

Validation:
| Field | Rule | Error Message |
|-------|------|---------------|
| Watch status | Required | "Please select a watch status." |

Navigation:
- Save → Return to previous page (Content Detail or Journal)
- Cancel → Return to previous page

---

**[S-JRN-03] My Favorites**

Purpose: View all favorited content
Accessible to: User only
Reached from: Navigation, Profile edit

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Favorite list | Journal Entry (is_favorite=true) | Grid | NO |
| Poster | Content.poster_url | Image | NO |
| Title | Content.title | Text | NO |
| Type | Content.type | Badge | NO |
| Rating | JournalEntry.rating | Stars | NO |
| Profile badge | "On Profile" badge | If selected for profile | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| View content | Click card | Always | Navigate to Content Detail |
| Remove favorite | Heart icon toggle | Each entry | Toggle favorite off |
| Select for profile | "Add to Profile" | < 4 selected | Add to profile favorites |

States:
- Loading: Skeleton loaders
- Empty: "You haven't marked any favorites yet. Browse your journal to add some!"
- Profile full: "You've selected 4 favorites for your profile. Remove one to add another."

Navigation:
- Entry click → /content/{slug}

═══════════════════════════════════════════════════════════════
8. ENTRY POINTS PER ROLE
═══════════════════════════════════════════════════════════════

| Role | Entry Points |
|------|--------------|
| Guest | Can view other users' public journal entries on their profiles |
| User | Personal Journal, My Favorites, Journal Entry Form, Content Detail (add/edit) |
| Admin | Same as User |

═══════════════════════════════════════════════════════════════
9. NOTIFICATIONS
═══════════════════════════════════════════════════════════════

No system notifications for journal actions. Toast confirmations for save/delete are sufficient.

═══════════════════════════════════════════════════════════════
10. SCOPE
═══════════════════════════════════════════════════════════════

**In MVP:**
- Create, read, update, delete journal entries
- 4 watch statuses: WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH
- 5-star rating with half-star increments
- Unlimited review text
- Favorite marking (unlimited favorites)
- Profile favorite selection (up to 4)
- Filter and sort journal entries

**Not in MVP (Phase 2+):**
- Episode-level progress tracking
- Rewatch logging (multiple entries per content)
- Private journal entries
- Journal entry sharing (direct link)
- Export journal data
- Watch date tracking (diary date)
- "On Hold" status
- Journal stats (ratings distribution, watching time)

═══════════════════════════════════════════════════════════════
11. OPEN ITEMS
═══════════════════════════════════════════════════════════════

No open items. All decisions confirmed.
