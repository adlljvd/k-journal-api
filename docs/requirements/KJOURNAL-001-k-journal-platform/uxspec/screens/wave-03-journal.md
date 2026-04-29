=== WAVE 3 SCREENS: Journaling & Favorites ===
Project: KJOURNAL-001-k-journal-platform
Module: JOURNAL
Wireframe: wireframes/03-journal.html

═══════════════════════════════════════════════════════════════
WAVE OVERVIEW
═══════════════════════════════════════════════════════════════

This wave covers the core journaling functionality:
- Personal journal management
- Journal entry creation/editing
- Favorites management
- Content requests

**Screens in this wave:**
| ID | Screen Name | Purpose |
|----|-------------|---------|
| S-JRN-01 | Personal Journal | View all tracked content |
| S-JRN-02 | Journal Entry Form | Add/edit journal entries |
| S-JRN-03 | My Favorites | View favorited content |
| S-CAT-05 | Content Request Form | Request missing titles |
| S-CAT-06 | My Requests | View request status |

---

## S-JRN-01 Personal Journal

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Content title | PRIMARY | Identifies what the user tracked; main reference point |
| Watch status | PRIMARY | User's current relationship with content; drives filtering |
| Rating | PRIMARY | User's opinion; key taste signal |
| Poster | SECONDARY | Visual recognition; faster scanning |
| Review snippet | SECONDARY | User's thoughts; context for rating |
| Favorite icon | SECONDARY | Highlighted status; special flag |
| Type/Year | TERTIARY | Categorization reference |
| Date added | TERTIARY | Chronological reference |

### Screen Definition

**UX structure decision:**
- Primary action: View and manage journal entries
- Secondary action: Filter/sort entries, navigate to content detail
- Information hierarchy: Filter controls → Entry list → Entry cards with status/rating prominent
- Principle applied: **Efficiency for Frequent Tasks** - Quick status filter, one click to content, inline actions
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Navigation, Content Detail / → to Content Detail, Journal Entry Form

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click entry | S-CAT-03 | 02-content.html |
| Edit entry | S-JRN-02 | This file |
| Delete entry | Confirmation dialog | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Entry list | PRIMARY | JournalEntry (user's) | Paginated cards (20/page) | Main content |
| Card: Poster | SECONDARY | Content.poster_url | Thumbnail | Visual reference |
| Card: Title | PRIMARY | Content.title | Text | Content identifier |
| Card: Type | TERTIARY | Content.type | Badge | Drama/Movie |
| Card: Status | PRIMARY | JournalEntry.status | Badge | WATCHING/COMPLETED/DROPPED/PLAN_TO_WATCH |
| Card: Rating | PRIMARY | JournalEntry.rating | Stars (or unrated) | User's rating |
| Card: Review snippet | SECONDARY | JournalEntry.review | Text (150 chars) | User's thoughts |
| Card: Favorite | SECONDARY | JournalEntry.is_favorite | Heart icon | If favorited |
| Card: Date added | TERTIARY | JournalEntry.created_at | Date | When added |
| Status filter | SECONDARY | User selection | Tabs/Dropdown | Filter by status |
| Sort control | SECONDARY | User selection | Dropdown | Date, rating, title |
| Status counts | TERTIARY | Calculated | Badges | Entries per status |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Filter by status | Tab/Dropdown | Top | Filter entries |
| Sort | Dropdown | Top | Reorder entries |
| Click entry | Card click | Any card | Navigate to Content Detail |
| Edit | Button | Card actions | Open Journal Entry Form |
| Delete | Button | Card actions | Show confirmation dialog |

**States:**
_Loading_: Skeleton cards
_Empty_: "Your journal is empty. Start by browsing the catalog!" + "Browse Catalog" button
_No results (filter)_: "No entries with status '[status]'."
_Populated_: Entry cards visible with all metadata
_Error_: "Unable to load your journal. Please try again."

**Delete Confirmation Dialog:**
- Title: "Remove from Journal"
- Message: "Remove '[title]' from your journal? This will also remove any rating, review, and favorite status."
- Actions: "Cancel" / "Remove"

**Navigation:**
Click entry → /content/{slug}
Edit → Journal Entry Form (modal or page)
Delete → Confirm → Remove entry, refresh journal
Browse Catalog → /catalog

---

## S-JRN-02 Journal Entry Form

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Watch status | PRIMARY | Required; defines user's relationship with content |
| Rating | PRIMARY | Key taste expression; optional but highly valuable |
| Content title/info | PRIMARY | Context; confirms what user is tracking |
| Review | SECONDARY | Deep expression; optional |
| Favorite | SECONDARY | Highlight flag; optional |

### Screen Definition

**UX structure decision:**
- Primary action: Save journal entry
- Secondary action: Cancel and discard changes
- Information hierarchy: Content info (context) → Status (required) → Rating → Review → Favorite
- Principle applied: **Progressive Disclosure** - Status is required; everything else optional but accessible
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Content Detail (Add/Edit), Journal (Edit) / → to Content Detail or Journal (on save)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| None - this is a modal or overlay |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Content poster | PRIMARY | Content.poster_url | Thumbnail | Visual confirmation |
| Content title | PRIMARY | Content.title | Text | What's being tracked |
| Content type | SECONDARY | Content.type | Badge | Drama/Movie |
| Content year | SECONDARY | Content.year | Text | Release year |
| Watch status | PRIMARY | User input | Radio/Dropdown | REQUIRED: WATCHING, COMPLETED, DROPPED, PLAN_TO_WATCH |
| Rating | PRIMARY | User input | Star picker (0.5-5.0) | Optional |
| Review | SECONDARY | User input | Textarea | Optional, no limit |
| Favorite | SECONDARY | User input | Toggle (heart) | Optional |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Save | Primary button | Bottom | Save entry, show success, close form |
| Cancel | Secondary button | Bottom | Discard changes, close form |

**States:**
_New entry_: All fields default (status unselected, no rating, empty review, favorite off)
_Edit entry_: Fields pre-filled with current values
_Loading_: Button spinner during save
_Success_: "Saved to your journal!" toast notification
_Error_: "Unable to save. Please try again."
_Validation error_: "Please select a watch status."

**Rating Interaction:**
- 10 star positions (0.5, 1.0, 1.5, ... 5.0)
- Click to set rating
- Clear/Unrate option available
- Visual: Filled stars up to rating, empty stars after

**Status Options:**
| Status | Label | Color Context |
|--------|-------|---------------|
| WATCHING | "Currently Watching" | Active, ongoing |
| COMPLETED | "Completed" | Finished |
| DROPPED | "Dropped" | Stopped watching |
| PLAN_TO_WATCH | "Plan to Watch" | On watchlist |

**Navigation:**
Save → Return to previous page (Content Detail or Journal)
Cancel → Return to previous page

---

## S-JRN-03 My Favorites

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Content title | PRIMARY | Identifies favorited content |
| Poster | PRIMARY | Visual recognition for favorites |
| Rating | PRIMARY | User's opinion on favorite content |
| Profile badge | PRIMARY | Shows if selected for public profile |
| Type/Year | SECONDARY | Categorization reference |

### Screen Definition

**UX structure decision:**
- Primary action: View and manage favorites
- Secondary action: Select favorites for profile display
- Information hierarchy: Profile favorites section → All favorites grid
- Principle applied: **Hierarchy and Visual Weight** - Profile favorites (max 4) are prominently displayed; all favorites below
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Navigation, Profile / → to Content Detail, Profile Edit

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click favorite | S-CAT-03 | 02-content.html |
| "Edit Profile" | S-PROF-02 | 04-profile.html |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Profile favorites section | PRIMARY | Selected 4 | Highlighted cards | What appears on public profile |
| All favorites grid | PRIMARY | JournalEntry (is_favorite=true) | Grid of cards | All favorited content |
| Card: Poster | PRIMARY | Content.poster_url | Image | Visual reference |
| Card: Title | PRIMARY | Content.title | Text | Content identifier |
| Card: Type | SECONDARY | Content.type | Badge | Drama/Movie |
| Card: Rating | PRIMARY | JournalEntry.rating | Stars | User's rating |
| Card: Profile badge | PRIMARY | Calculated | "On Profile" badge | If selected for profile |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Click favorite | Card click | Any card | Navigate to Content Detail |
| Remove favorite | Heart toggle | Card | Toggle favorite off, remove from list |
| Select for profile | Checkbox/Button | Card | Add to profile favorites (max 4) |
| Edit profile | Button | Profile section | Navigate to Profile Edit |

**States:**
_Loading_: Skeleton grid
_Empty_: "You haven't marked any favorites yet. Browse your journal to add some!"
_Profile full_: "You've selected 4 favorites for your profile. Remove one to add another."
_Populated_: Favorite cards visible

**Profile Favorites Selection:**
- Max 4 slots visible
- Empty slots show "+ Add" placeholder
- Clicking filled slot allows replacement
- Order matters for display on profile

**Navigation:**
Click favorite → /content/{slug}
Edit Profile → /profile/edit

---

## S-CAT-05 Content Request Form

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Required; identifies what user wants |
| Type | PRIMARY | Required; categorizes the request |
| Year | SECONDARY | Optional; helps admin verify |
| Notes | TERTIARY | Optional; additional context for admin |

### Screen Definition

**UX structure decision:**
- Primary action: Submit content request
- Secondary action: Cancel and return
- Information hierarchy: Form fields → Submit/Cancel
- Principle applied: **Error Prevention First** - Clear required/optional distinction; set expectations
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Search empty state, Settings / → to My Requests (on success)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| None - all navigation within this file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Title input | PRIMARY | User input | Text field | Required, 1-255 chars |
| Type dropdown | PRIMARY | User input | Dropdown | Required: Drama/Movie |
| Year input | SECONDARY | User input | Number field | Optional |
| Notes textarea | TERTIARY | User input | Textarea | Optional |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Submit | Primary button | Bottom | Create request, show success |
| Cancel | Secondary button | Bottom | Return to previous page |

**States:**
_New form_: Empty fields (or pre-filled from search query)
_Loading_: Button spinner during submission
_Success_: "Request submitted! We'll review it shortly." + redirect to My Requests
_Error_: "Unable to submit request. Please try again."
_Rate limited_: "You've reached your daily request limit (5). Try again tomorrow."

**Validation:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Title | Required, 1-255 chars | "Please enter a title." |
| Type | Required | "Please select a type." |

**Navigation:**
Submit → /my-requests
Cancel → Previous page

---

## S-CAT-06 My Requests

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Identifies what was requested |
| Status | PRIMARY | Current state; user needs to know if approved/rejected |
| Type | SECONDARY | Categorization |
| Submitted date | SECONDARY | Chronological reference |
| Rejection reason | PRIMARY (if rejected) | Explains why request was denied |
| View in Catalog | PRIMARY (if approved) | Action to add to journal |

### Screen Definition

**UX structure decision:**
- Primary action: Check request status, view approved content
- Secondary action: Submit new request
- Information hierarchy: Request list with status prominent
- Principle applied: **Feedback and System Status** - Clear status indicators, action available for approved requests
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Content Request Form, Settings / → to Content Detail (approved), Content Request Form (new)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| "View in Catalog" | S-CAT-03 | 02-content.html |
| "Request Another" | S-CAT-05 | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Request list | PRIMARY | ContentRequest (user's) | Table/List | All user's requests |
| Title | PRIMARY | ContentRequest.title | Text | What was requested |
| Type | SECONDARY | ContentRequest.type | Badge | Drama/Movie |
| Status | PRIMARY | ContentRequest.status | Badge | PENDING/APPROVED/REJECTED |
| Submitted | SECONDARY | ContentRequest.created_at | Date | When submitted |
| Rejection reason | PRIMARY | ContentRequest.rejection_reason | Text | If rejected |

**Status Badge Colors:**
| Status | Color | Meaning |
|--------|-------|---------|
| PENDING | Yellow/Gray | Awaiting admin review |
| APPROVED | Green | Content created |
| REJECTED | Red | Content not added |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| View in Catalog | Primary button | APPROVED rows | Navigate to Content Detail |
| Request another | Secondary button | Top/bottom | Navigate to Content Request Form |

**States:**
_Loading_: Skeleton list
_Empty_: "You haven't submitted any content requests."
_Populated_: Request rows visible with status badges
_Pending only_: "No pending requests."

**Navigation:**
View in Catalog → /content/{slug}
Request Another → /request-content

---

═══════════════════════════════════════════════════════════════
WAVE NOTES
═══════════════════════════════════════════════════════════════

## Journal Entry Form Modes

The Journal Entry Form has two modes:

1. **Add Mode** - Accessed from Content Detail when content not in journal
   - All fields start empty/default
   - Success: Entry created

2. **Edit Mode** - Accessed from Content Detail or Journal when content already in journal
   - Fields pre-filled with current values
   - Success: Entry updated
   - Can clear rating (set to unrated)
   - Can clear review (delete text)
   - Can toggle favorite on/off

## Watch Status Design Considerations

The 4 watch statuses serve different user needs:

| Status | User Intent | Journal Behavior |
|--------|-------------|------------------|
| WATCHING | Currently consuming | Should appear at top of journal; encourages rating/review when complete |
| COMPLETED | Finished | Full entry; likely to have rating and review |
| DROPPED | Stopped before finishing | May have lower rating; shorter review |
| PLAN_TO_WATCH | On watchlist | No rating/review yet; placeholder for future |

**Suggested Default Sort:**
- WATCHING first (active)
- Then by most recently updated
- PLAN_TO_WATCH last

## Rating Display

Ratings use half-star increments (0.5 - 5.0):

**Visual representation:**
- 0.5 stars: ★☆☆☆☆ (half filled)
- 1.0 stars: ★☆☆☆☆
- 1.5 stars: ★★☆☆☆ (half filled)
- ...
- 5.0 stars: ★★★★★

**Unrated state:**
- Show "Not rated" text
- Or show empty stars outline

## Profile Favorites Selection Logic

1. User must first mark content as favorite in journal
2. From My Favorites, user can select up to 4 for profile display
3. Selection is stored in UserProfile.profile_favorites (ordered array)
4. Removing favorite from journal also removes from profile favorites
5. Empty profile favorites show placeholders on profile

## Cross-File Links Summary

| From Screen | Action | To Screen | Wireframe File |
|-------------|--------|-----------|----------------|
| S-JRN-01 | Click entry | S-CAT-03 | 02-content.html |
| S-JRN-01 | Edit | S-JRN-02 | This file |
| S-JRN-02 | Save | S-CAT-03 or S-JRN-01 | 02-content.html or this file |
| S-JRN-03 | Click favorite | S-CAT-03 | 02-content.html |
| S-JRN-03 | Edit Profile | S-PROF-02 | 04-profile.html |
| S-CAT-05 | Submit | S-CAT-06 | This file |
| S-CAT-06 | View in Catalog | S-CAT-03 | 02-content.html |
| S-CAT-06 | Request another | S-CAT-05 | This file |
