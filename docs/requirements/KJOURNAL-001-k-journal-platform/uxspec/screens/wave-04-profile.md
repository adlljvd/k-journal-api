=== WAVE 4 SCREENS: User Profiles & Social Discovery ===
Project: KJOURNAL-001-k-journal-platform
Module: PROFILE
Wireframe: wireframes/04-profile.html

═══════════════════════════════════════════════════════════════
WAVE OVERVIEW
═══════════════════════════════════════════════════════════════

This wave covers user profiles and social discovery:
- Own profile viewing and editing
- Other users' public profiles
- User search functionality

**Screens in this wave:**
| ID | Screen Name | Purpose |
|----|-------------|---------|
| S-PROF-01 | Own Profile (View) | View own public profile |
| S-PROF-02 | Own Profile (Edit) | Edit profile information |
| S-PROF-03 | Other User Profile | View someone else's profile |
| S-PROF-04 | User Search | Find other users |

---

## S-PROF-01 Own Profile (View)

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Username | PRIMARY | User's identity; always visible |
| Profile favorites | PRIMARY | Showcases user's top 4 picks; key taste signal |
| Journal entries | PRIMARY | User's content journey; main profile content |
| Stats (total, mean rating, favorites) | SECONDARY | At-a-glance engagement summary |
| Bio | SECONDARY | Personal expression |
| Avatar | SECONDARY | Visual identity |

### Screen Definition

**UX structure decision:**
- Primary action: View own profile as others see it
- Secondary action: Edit profile, view journal entries
- Information hierarchy: Avatar + Username + Bio → Profile Favorites → Stats → Journal entries
- Principle applied: **Recognition over Recall** - See exactly what others see; clear edit action
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Navigation, Settings / → to Profile Edit, Content Detail

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Edit Profile | S-PROF-02 | This file |
| Click favorite | S-CAT-03 | 02-content.html |
| Click journal entry | S-CAT-03 | 02-content.html |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Username | PRIMARY | User.username | H1 | User's identity |
| Avatar | SECONDARY | UserProfile.avatar_url | Image | Or default placeholder |
| Bio | SECONDARY | UserProfile.bio | Text | Max 160 chars |
| Profile favorites | PRIMARY | UserProfile.profile_favorites | 4 content cards | Top picks |
| Stats: Total logged | SECONDARY | Calculated | Number + label | All journal entries |
| Stats: Mean rating | SECONDARY | Calculated | Stars | Average of rated entries |
| Stats: Favorites | SECONDARY | Calculated | Number + label | Entries with is_favorite=true |
| Journal entries | PRIMARY | JournalEntry (user's) | Paginated list | All public entries |

**Profile Favorites Card:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Poster | PRIMARY | Content.poster_url | Image | Visual |
| Title | PRIMARY | Content.title | Text | Content name |
| Type | SECONDARY | Content.type | Badge | Drama/Movie |

**Journal Entry Card:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Poster | PRIMARY | Content.poster_url | Thumbnail | Visual |
| Title | PRIMARY | Content.title | Text | Content name |
| Status | PRIMARY | JournalEntry.status | Badge | Watch status |
| Rating | PRIMARY | JournalEntry.rating | Stars | User's rating |
| Review snippet | SECONDARY | JournalEntry.review | Text (truncated) | User's thoughts |
| Date | TERTIARY | JournalEntry.updated_at | Date | When last updated |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Edit Profile | Primary button | Below avatar/bio | Navigate to Edit form |
| Click favorite | Card click | Profile favorites | Navigate to Content Detail |
| Click journal entry | Card click | Journal section | Navigate to Content Detail |

**States:**
_Loading_: Skeleton for avatar, favorites, journal
_No avatar_: Default placeholder image
_Empty bio_: No bio displayed (or placeholder text "No bio yet")
_Empty favorites_: "Add favorites to showcase your top picks here." + "Go to Favorites" link
_Empty journal_: "No entries yet. Start tracking your K-dramas and K-movies!" + "Browse Catalog" link
_Populated_: All profile sections visible

**Navigation:**
Edit Profile → /profile/edit
Click favorite → /content/{slug}
Click entry → /content/{slug}
Go to Favorites → /favorites
Browse Catalog → /catalog

---

## S-PROF-02 Own Profile (Edit)

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Profile favorites | PRIMARY | Key taste expression; limited to 4 slots |
| Bio | SECONDARY | Personal expression; limited to 160 chars |
| Avatar URL | SECONDARY | Visual identity; URL-only in MVP |

### Screen Definition

**UX structure decision:**
- Primary action: Save profile changes
- Secondary action: Cancel and discard
- Information hierarchy: Avatar URL → Bio → Profile favorites selection
- Principle applied: **Error Prevention First** - Character counter for bio; max 4 favorites enforced
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Own Profile View / → to Own Profile View (on save)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| None - all navigation within this file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Avatar URL input | SECONDARY | User input | Text field | URL to image |
| Avatar preview | SECONDARY | User input | Image preview | Shows current/entered URL |
| Bio input | SECONDARY | User input | Textarea | Max 160 chars |
| Character counter | TERTIARY | Calculated | "X/160" | Bio length |
| Profile favorites selector | PRIMARY | User selection | 4 slots | Selected from favorites |

**Profile Favorites Selector:**
- Shows all content marked as favorite in journal
- User clicks to select/deselect for profile
- Max 4 selections enforced
- Visual indicator of current selections (checkmark + position number)
- Empty slots show "+ Add" placeholder

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Save | Primary button | Bottom | Update profile, redirect to view |
| Cancel | Secondary button | Bottom | Discard changes, redirect to view |

**States:**
_Loading_: Button spinner during save
_Success_: "Profile updated!" toast, redirect to profile view
_Error_: "Unable to save. Please try again."
_No favorites_: "Mark some content as favorites in your journal to display them here."
_Profile full_: 4 slots filled; cannot add more without removing

**Validation:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Avatar URL | Valid URL format (if provided) | "Please enter a valid URL." |
| Bio | Max 160 characters | "Bio must be 160 characters or less." |

**Navigation:**
Save → /user/{username} (profile view)
Cancel → /user/{username} (profile view)

---

## S-PROF-03 Other User Profile

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Username | PRIMARY | Identifies whose profile this is |
| Profile favorites | PRIMARY | Their taste at a glance |
| Journal entries | PRIMARY | Their content journey; main discovery content |
| Stats | SECONDARY | Their engagement summary |
| Bio | SECONDARY | Their personal expression |
| Avatar | SECONDARY | Their visual identity |

### Screen Definition

**UX structure decision:**
- Primary action: Explore user's taste (favorites + journal)
- Secondary action: Click to view content details
- Information hierarchy: Same as Own Profile but without edit action
- Principle applied: **Momentum Through the Flow** - Easy to click favorites/entries to explore content
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from User Search, Direct URL / → to Content Detail

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click favorite | S-CAT-03 | 02-content.html |
| Click journal entry | S-CAT-03 | 02-content.html |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Username | PRIMARY | User.username | H1 | Their identity |
| Avatar | SECONDARY | UserProfile.avatar_url | Image | Or default placeholder |
| Bio | SECONDARY | UserProfile.bio | Text | Max 160 chars |
| Profile favorites | PRIMARY | UserProfile.profile_favorites | 4 content cards | Their top picks |
| Stats: Total logged | SECONDARY | Calculated | Number + label | Their journal count |
| Stats: Mean rating | SECONDARY | Calculated | Stars | Their average rating |
| Stats: Favorites | SECONDARY | Calculated | Number + label | Their favorites count |
| Journal entries | PRIMARY | JournalEntry (user's) | Paginated list | All their public entries |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Click favorite | Card click | Profile favorites | Navigate to Content Detail |
| Click journal entry | Card click | Journal section | Navigate to Content Detail |

**States:**
_Loading_: Skeleton for avatar, favorites, journal
_User not found_: "User not found. The username may have been changed or the account deleted."
_No avatar_: Default placeholder image
_Empty bio_: No bio displayed
_Empty favorites_: "This user hasn't added any favorites yet."
_Empty journal_: "This user hasn't logged any content yet."
_Populated_: All profile sections visible

**Navigation:**
Click favorite → /content/{slug}
Click entry → /content/{slug}

---

## S-PROF-04 User Search

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Search input | PRIMARY | User's intent; what they're looking for |
| Result cards | PRIMARY | Matching users; main content |
| Username | PRIMARY | Identifies each user in results |
| Bio snippet | SECONDARY | Quick context about user |
| Avatar | SECONDARY | Visual identifier |

### Screen Definition

**UX structure decision:**
- Primary action: Search for and find other users
- Secondary action: View a user's profile
- Information hierarchy: Search input → Results → User cards
- Principle applied: **Efficiency for Frequent Tasks** - Quick search, immediate results, one click to profile
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Navigation / → to Other User Profile

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click result | S-PROF-03 | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Search input | PRIMARY | User input | Text field | Username search |
| Results list | PRIMARY | User (matches) | List of cards | Top 10 results |
| Card: Avatar | SECONDARY | UserProfile.avatar_url | Thumbnail | Visual |
| Card: Username | PRIMARY | User.username | Text | User identifier |
| Card: Bio snippet | SECONDARY | UserProfile.bio | Text (50 chars) | Quick context |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Search | Input submit | Search bar | Display results |
| Click result | Card click | Results list | Navigate to user profile |

**States:**
_Loading_: Skeleton results
_No query_: "Enter a username to search for users."
_No results_: "No users found for '[query]'. Try a different search."
_Results found_: List of matching user cards

**Navigation:**
Click result → /user/{username}

---

═══════════════════════════════════════════════════════════════
WAVE NOTES
═══════════════════════════════════════════════════════════════

## Profile URL Structure

All profile URLs follow this pattern:
- `/user/{username}`
- Case-insensitive (e.g., /user/JohnDoe and /user/johndoe resolve to same profile)
- Username cannot be changed after registration

## Own vs Other Profile Differentiation

| Aspect | Own Profile | Other Profile |
|--------|-------------|---------------|
| URL | /profile or /user/{own-username} | /user/{username} |
| Edit button | Visible | Not visible |
| Empty state CTAs | "Add favorites", "Browse catalog" | "User hasn't added..." |
| Stats visibility | Visible | Visible |
| Journal entries | All visible | All visible (public by default) |

## Stats Computation

Stats are calculated on-demand (not stored):

| Stat | Calculation |
|------|-------------|
| Total logged | COUNT(*) FROM journal_entries WHERE user_id = ? |
| Mean rating | AVG(rating) FROM journal_entries WHERE user_id = ? AND rating IS NOT NULL |
| Favorites count | COUNT(*) FROM journal_entries WHERE user_id = ? AND is_favorite = true |

**Mean Rating Display:**
- If no ratings: "No ratings yet"
- If rated: "★ X.X" (one decimal place)

## Profile Favorites Slots

The 4 profile favorites slots are:
1. **Slot 1** - Most prominent position (leftmost or top)
2. **Slot 2** - Second position
3. **Slot 3** - Third position
4. **Slot 4** - Fourth position

**Selection behavior:**
- User selects from their favorited content
- Can reorder in Phase 2 (drag and drop)
- MVP: Selection order = display order

## Bio Guidelines

- Max 160 characters
- No formatting (plain text)
- Optional field
- Display: Single line or truncated with "Read more"

## Cross-File Links Summary

| From Screen | Action | To Screen | Wireframe File |
|-------------|--------|-----------|----------------|
| S-PROF-01 | Edit Profile | S-PROF-02 | This file |
| S-PROF-01 | Click favorite/entry | S-CAT-03 | 02-content.html |
| S-PROF-02 | Save/Cancel | S-PROF-01 | This file |
| S-PROF-03 | Click favorite/entry | S-CAT-03 | 02-content.html |
| S-PROF-04 | Click result | S-PROF-03 | This file |
