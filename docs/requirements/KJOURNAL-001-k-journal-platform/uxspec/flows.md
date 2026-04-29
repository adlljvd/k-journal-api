=== FLOW MAPS: K-Journal ===
Project: KJOURNAL-001-k-journal-platform
Phase: 2
Status: Complete

═══════════════════════════════════════════════════════════════
OVERVIEW
═══════════════════════════════════════════════════════════════

This document maps the primary user journeys from entry to completion.
Each flow identifies decision points, friction risks, and success/failure states.

---

=== FLOW MAP: User Registration & Onboarding ===

**Actor:** Guest → User
**Entry state:** Guest lands on homepage or is redirected from protected route
**Success end state:** User is logged in, viewing empty Personal Journal with welcome prompt
**Failure/exit states:** 
- Validation error (return to form)
- Duplicate account (redirect to login)
- User abandons (leaves site)

**Journey narrative:**
A K-drama enthusiast discovers K-Journal and wants to start tracking their viewing journey. They click "Sign Up", enter their email, create a unique username, and set a password. After successful validation, they're automatically logged in and redirected to their journal—which is empty. A friendly welcome message encourages them to browse the catalog and add their first entry.

**Decision points:**
1. **CTA visibility** - Is "Sign Up" prominent enough on homepage?
2. **Form simplicity** - Only 3 required fields (email, username, password)
3. **Auto-login** - No extra step after registration; immediate value
4. **Empty state** - Clear guidance on what to do next

**Friction risks:**
- Username already taken → Show alternatives or suggest modifications
- Email already exists → Offer to log in instead
- Password requirements unclear → Show requirements inline
- Empty journal feels discouraging → Provide welcome prompt and CTA

**Screen sequence:**
```
S-01 (Homepage) → S-AUTH-01 (Registration) → S-JRN-01 (Personal Journal)
```

---

=== FLOW MAP: Content Discovery & Browse ===

**Actor:** User (or Guest)
**Entry state:** User on Homepage or uses search
**Success end state:** User finds desired content and views Content Detail page
**Failure/exit states:**
- No results found → Content Request flow
- User abandons search → Returns to previous page

**Journey narrative:**
A user wants to find a specific K-drama they just finished watching. They type the title into the search bar. As they type, results appear in real-time. They see the drama, click it, and land on the Content Detail page where they can add it to their journal.

Alternatively, they might browse the catalog by clicking "Browse All", filter by genre or type, sort by rating, and discover something new.

**Decision points:**
1. **Search vs Browse** - User may know what they want (search) or be exploring (browse)
2. **Filter/Sort** - User can narrow down options
3. **Content selection** - Click to view details
4. **Not found** - Trigger content request flow

**Friction risks:**
- Empty search results → Clear message + CTA to request
- Too many results → Filters and sort help narrow down
- Slow search → Debounce at 300ms, show loading state
- Poster images missing → Placeholder images

**Screen sequence:**
```
S-01 (Homepage) → S-CAT-02 (Catalog) or S-CAT-04 (Search Results) → S-CAT-03 (Content Detail)
```

**Branch: Not Found**
```
S-CAT-04 (Empty Results) → S-CAT-05 (Content Request Form)
```

---

=== FLOW MAP: Content Detail & Journal Entry ===

**Actor:** User
**Entry state:** User on Content Detail page (from catalog, search, or profile)
**Success end state:** Journal entry created, user sees success message
**Failure/exit states:**
- Cancel → Return to Content Detail with no changes
- Error → Show error message, allow retry

**Journey narrative:**
A user lands on a Content Detail page after searching. They see the title, poster, synopsis, genres, cast, and average rating. They decide to add it to their journal. They click "Add to Journal" which opens a form (modal or page). They select their watch status (required), optionally rate it with stars, optionally write a review, and optionally mark it as favorite. They click "Save to Journal" and see a success message. The Content Detail page now shows their journal entry.

**Decision points:**
1. **Already in journal?** - If yes, show current entry with edit option
2. **Status selection** - Required; must pick one of 4 options
3. **Rating** - Optional; can skip entirely
4. **Review** - Optional; no character limit
5. **Favorite** - Optional; toggle on/off
6. **Save vs Cancel** - Commit or discard

**Friction risks:**
- Form feels overwhelming → Make optional fields clearly optional
- Rating precision unclear → Show 0.5 increments visually
- Review too long → No character limit, but truncate in display
- User wants to save with status only → Allow minimal save

**Screen sequence:**
```
S-CAT-03 (Content Detail) → S-JRN-02 (Journal Entry Form) → S-CAT-03 (Content Detail, updated)
```

**Alternative flow for logged-out users:**
```
S-CAT-03 (Content Detail) → "Log in to add" prompt → S-AUTH-02 (Login)
```

---

=== FLOW MAP: Personal Journal Management ===

**Actor:** User
**Entry state:** User navigates to "My Journal"
**Success end state:** User has viewed, edited, or deleted journal entries
**Failure/exit states:**
- Error loading journal → Show error with retry
- Delete cancelled → Return to journal

**Journey narrative:**
A user wants to review all their tracked content. They click "My Journal" from the navigation. They see all their journal entries sorted by most recently updated. Each entry shows the poster, title, type, status, rating, review snippet, and favorite icon. They can filter by status (Watching, Completed, Dropped, Plan to Watch), sort by different criteria, and click any entry to view the content detail. They can also edit an entry to change their rating or review, or delete an entry they no longer want to track.

**Decision points:**
1. **Filter by status** - Narrow down to specific subset
2. **Sort order** - Date added, date updated, rating, title
3. **View content** - Click to see full details
4. **Edit entry** - Modify status, rating, review, favorite
5. **Delete entry** - Confirm or cancel

**Friction risks:**
- Long list overwhelming → Pagination (20 per page), filters
- Can't find specific entry → Search within journal (not in MVP)
- Accidental delete → Confirmation dialog
- Losing place after edit → Return to same position in list

**Screen sequence:**
```
S-JRN-01 (Personal Journal) → [View] S-CAT-03 (Content Detail)
                              → [Edit] S-JRN-02 (Journal Entry Form)
                              → [Delete] Confirmation Dialog
```

---

=== FLOW MAP: Public Profile Discovery ===

**Actor:** User (or Guest)
**Entry state:** User searches for another user or follows a profile link
**Success end state:** User views another user's public profile and journal
**Failure/exit states:**
- User not found → "User not found" message
- Empty profile → Still shows profile with empty states

**Journey narrative:**
A user wants to see what K-dramas their friend has watched. They search for the friend's username using the user search feature. They see results and click on the correct profile. The public profile shows the friend's username, avatar, bio, their 4 profile favorites, stats (total logged, mean rating, favorites count), and their journal entries. The user can click on any favorite or journal entry to view the content detail.

**Decision points:**
1. **User search** - Enter username, see results
2. **Select user** - Click result to view profile
3. **Explore profile** - View favorites, stats, journal entries
4. **Click content** - Navigate to content detail

**Friction risks:**
- Username typo → "No users found" with suggestion to try again
- Private profiles → Not in MVP; all profiles are public
- Empty profile → Still informative, shows stats (even if 0)

**Screen sequence:**
```
S-PROF-04 (User Search) → S-PROF-03 (Other User Profile) → S-CAT-03 (Content Detail)
```

---

=== FLOW MAP: Content Request (Missing Title) ===

**Actor:** User
**Entry state:** User cannot find content in search/catalog
**Success end state:** Request submitted with PENDING status
**Failure/exit states:**
- Validation error → Return to form with errors
- Rate limited → Show limit message
- Cancel → Return to previous page

**Journey narrative:**
A user searches for a K-drama they just watched, but it's not in the catalog. The search results page shows "No results" with a link to request the title. They click "Request this title" and land on the Content Request form. They enter the title (required), select type - Drama or Movie (required), optionally enter the year and notes. They submit the request and see a confirmation. Later, they can check "My Requests" to see if it was approved.

**Decision points:**
1. **Trigger** - Empty search results or manual navigation
2. **Form completion** - Title and type required; year and notes optional
3. **Submit** - Create request, show confirmation
4. **Status check** - View request status in "My Requests"

**Friction risks:**
- Don't know exact title → Encourage best guess in notes
- Duplicate request → System merges; inform user
- Rate limiting → Clear message about daily limit (5/day)
- Long wait time → Set expectations; "We'll review it shortly"

**Screen sequence:**
```
S-CAT-04 (Empty Results) → S-CAT-05 (Content Request Form) → S-CAT-06 (My Requests)
```

**Alternative entry:**
```
Settings → S-CAT-05 (Content Request Form)
```

---

=== FLOW MAP: User Profile Management ===

**Actor:** User
**Entry state:** User navigates to "My Profile"
**Success end state:** Profile updated with new avatar, bio, or profile favorites
**Failure/exit states:**
- Cancel → Discard changes
- Error → Show error, allow retry

**Journey narrative:**
A user wants to customize their public profile to better express their K-drama taste. They click "My Profile" from navigation. They see their current profile as others see it: username, avatar, bio, 4 profile favorites, stats, and journal entries. They click "Edit Profile" to make changes. They can update their avatar URL, write a bio (max 160 characters), and select up to 4 favorites from their favorited content. They save their changes and return to the profile view.

**Decision points:**
1. **View profile** - See current state as others see it
2. **Edit trigger** - Click "Edit Profile" button
3. **Avatar URL** - Enter image URL (no upload in MVP)
4. **Bio** - Write short description (160 char limit)
5. **Profile favorites** - Select up to 4 from favorites
6. **Save vs Cancel** - Commit or discard

**Friction risks:**
- No favorites yet → Can't select profile favorites; show placeholder
- Avatar URL invalid → Validate format; show preview if possible
- Bio too long → Character counter; truncate on save
- Forgot to save → Warn before leaving unsaved changes

**Screen sequence:**
```
S-PROF-01 (Own Profile View) → S-PROF-02 (Own Profile Edit) → S-PROF-01 (Own Profile View)
```

---

=== FLOW MAP: Admin Content Management ===

**Actor:** Admin
**Entry state:** Admin logs in and accesses Admin Dashboard
**Success end state:** Content requests processed, catalog updated
**Failure/exit states:**
- Error → Show error, allow retry
- Cancel → Return to dashboard

**Journey narrative:**
An admin logs into K-Journal and sees an "Admin" link in the navigation (only visible to admins). They click it and land on the Admin Dashboard, which shows pending request count, total content count, and recent requests. They can:

1. **Review Requests** - See the request queue, filter by status, click to view details, approve (opens content form) or reject (requires reason).

2. **Manage Catalog** - See all content in a table, search by title, filter by type, edit metadata, or delete content.

3. **Add Content** - Create new content entries manually or from approved requests.

**Decision points:**
1. **Dashboard entry** - Choose action: Review requests, Add content, Manage catalog
2. **Request queue** - Filter, view details, approve or reject
3. **Content creation** - Fill form, validate, save
4. **Content editing** - Modify fields, save
5. **Content deletion** - Confirm with cascade warning

**Friction risks:**
- Too many requests → Quick approve/reject actions, batch processing
- Content form too long → Pre-fill from request, sensible defaults
- Accidental delete → Confirmation dialog with cascade warning
- Duplicate content → System should flag; admin decides

**Screen sequence:**
```
S-ADM-01 (Admin Dashboard) → S-ADM-02 (Request Queue) → S-ADM-03 (Request Detail)
                           → S-ADM-04 (Content Creation)
                           
S-ADM-01 (Admin Dashboard) → S-ADM-06 (Catalog Management) → S-ADM-05 (Content Edit)
```

---

═══════════════════════════════════════════════════════════════
FLOW CROSS-REFERENCE MATRIX
═══════════════════════════════════════════════════════════════

| Flow | Primary Actor | Entry Screen | Exit Screen | Key Screens |
|------|---------------|--------------|-------------|-------------|
| Registration | Guest | S-01 (Home) | S-JRN-01 (Journal) | S-AUTH-01 |
| Content Discovery | User | S-01 (Home) | S-CAT-03 (Detail) | S-CAT-02, S-CAT-04 |
| Journal Entry | User | S-CAT-03 (Detail) | S-CAT-03 (Detail) | S-JRN-02 |
| Journal Management | User | S-JRN-01 (Journal) | S-JRN-01 | S-JRN-02, S-CAT-03 |
| Profile Discovery | User | S-PROF-04 (Search) | S-CAT-03 (Detail) | S-PROF-03 |
| Content Request | User | S-CAT-04 (Empty) | S-CAT-06 (Requests) | S-CAT-05 |
| Profile Management | User | S-PROF-01 (Profile) | S-PROF-01 | S-PROF-02 |
| Admin Management | Admin | S-ADM-01 (Dashboard) | S-ADM-01 | S-ADM-02 to S-ADM-06 |

---

═══════════════════════════════════════════════════════════════
FRICTION MITIGATION SUMMARY
═══════════════════════════════════════════════════════════════

| Friction | Flow | Mitigation |
|----------|------|------------|
| Title not found | Discovery | Clear empty state + Content Request CTA |
| Long signup form | Registration | Minimal fields (3 required) |
| Overwhelm in journal | Journal Management | Filters, pagination, clear hierarchy |
| No favorites for profile | Profile Management | Placeholder + guidance |
| Admin request backlog | Admin Management | Quick approve/reject, pre-filled forms |
| Guest hesitation | Registration | Value visible before signup, quick registration |
| Accidental delete | Journal, Admin | Confirmation dialogs |
| Form abandonment | Journal Entry | Save with status only; rating/review truly optional |
