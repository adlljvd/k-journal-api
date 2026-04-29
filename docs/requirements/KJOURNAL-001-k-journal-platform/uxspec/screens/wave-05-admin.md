=== WAVE 5 SCREENS: Admin & Content Management ===
Project: KJOURNAL-001-k-journal-platform
Module: ADMIN
Wireframe: wireframes/05-admin.html

═══════════════════════════════════════════════════════════════
WAVE OVERVIEW
═══════════════════════════════════════════════════════════════

This wave covers admin functionality:
- Admin dashboard
- Content request review
- Content creation and management

**Screens in this wave:**
| ID | Screen Name | Purpose |
|----|-------------|---------|
| S-ADM-01 | Admin Dashboard | Central admin hub |
| S-ADM-02 | Content Request Queue | View all requests |
| S-ADM-03 | Content Request Detail | Review individual request |
| S-ADM-04 | Content Creation Form | Add new content |
| S-ADM-05 | Content Edit Form | Modify existing content |
| S-ADM-06 | Catalog Management | View/manage all content |

---

## S-ADM-01 Admin Dashboard

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Pending requests count | PRIMARY | Immediate action item; what admin needs to address |
| Quick actions | PRIMARY | Efficient access to common tasks |
| Total content count | SECONDARY | Catalog health indicator |
| Recent requests | SECONDARY | Quick preview of what's pending |

### Screen Definition

**UX structure decision:**
- Primary action: Access pending requests
- Secondary action: Add new content, manage catalog
- Information hierarchy: Pending count (prominent) → Quick actions → Stats → Recent requests
- Principle applied: **Efficiency for Frequent Tasks** - Most common action (review requests) is most prominent
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Navigation (admin only) / → to Request Queue, Content Form, Catalog

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Review requests | S-ADM-02 | This file |
| Add content | S-ADM-04 | This file |
| Manage catalog | S-ADM-06 | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Pending requests count | PRIMARY | ContentRequest (PENDING) | Large number + badge | Call to action |
| Total content count | SECONDARY | Content | Number | Catalog size |
| Recent requests | SECONDARY | ContentRequest (latest 5) | List | Quick preview |

**Quick Actions:**
| Action | Label | Result |
|--------|-------|--------|
| Review requests | "Review Pending Requests (X)" | Navigate to Request Queue |
| Add content | "Add New Content" | Navigate to Content Form |
| Manage catalog | "Manage Catalog" | Navigate to Catalog Management |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Review requests | Primary button | Quick actions | Navigate to Request Queue |
| Add content | Secondary button | Quick actions | Navigate to Content Form |
| Manage catalog | Secondary button | Quick actions | Navigate to Catalog Management |

**States:**
_Loading_: Skeleton for stats
_No pending_: "No pending requests. Great job!"
_Populated_: Stats and recent requests visible

**Navigation:**
Review requests → /admin/requests
Add content → /admin/content/new
Manage catalog → /admin/content

---

## S-ADM-02 Content Request Queue

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | What was requested; main reference point |
| Status | PRIMARY | Current state; drives admin action |
| Submitted by | PRIMARY | User info for accountability |
| Date | SECONDARY | Chronological ordering (FIFO) |
| Type | SECONDARY | Categorization |

### Screen Definition

**UX structure decision:**
- Primary action: Review and process pending requests
- Secondary action: Filter by status, view processed requests
- Information hierarchy: Filter → Request table → Actions per row
- Principle applied: **Efficiency for Frequent Tasks** - Quick approve/reject actions; oldest first ordering
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Admin Dashboard / → to Request Detail, Content Form

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click request | S-ADM-03 | This file |
| Quick approve | S-ADM-04 | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Request table | PRIMARY | ContentRequest (all) | Paginated table | Main content |
| Title | PRIMARY | ContentRequest.title | Text | What was requested |
| Type | SECONDARY | ContentRequest.type | Badge | Drama/Movie |
| Year | TERTIARY | ContentRequest.year | Text | If provided |
| Submitted by | PRIMARY | User.username | Text + link | User identifier |
| Status | PRIMARY | ContentRequest.status | Badge | PENDING/APPROVED/REJECTED |
| Date | SECONDARY | ContentRequest.created_at | Date | When submitted |

**Status Filter:**
| Filter | Effect |
|--------|--------|
| All | Show all requests |
| Pending | Show only PENDING (default) |
| Approved | Show only APPROVED |
| Rejected | Show only REJECTED |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Filter by status | Dropdown | Top | Filter table |
| Click row | Row click | Table | Navigate to Request Detail |
| Quick approve | Button | PENDING rows | Open Content Form (pre-filled) |
| Quick reject | Button | PENDING rows | Open rejection modal |

**Quick Reject Modal:**
| Field | Type | Required |
|-------|------|----------|
| Rejection reason | Textarea | YES |
| Actions | "Cancel" / "Reject" | - |

**States:**
_Loading_: Skeleton table
_Empty_: "No content requests found."
_No pending_: "All caught up! No pending requests."
_Populated_: Request table visible

**Navigation:**
Click request → /admin/requests/{id}
Quick approve → /admin/content/new?request={id}

---

## S-ADM-03 Content Request Detail

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | What was requested; main content |
| Type | PRIMARY | Categorization for content creation |
| Status | PRIMARY | Current state; determines available actions |
| Notes | SECONDARY | User's additional context |
| Submitted by | SECONDARY | User info for follow-up |
| Rejection reason | PRIMARY (if rejected) | Explanation for user |

### Screen Definition

**UX structure decision:**
- Primary action: Approve or reject the request
- Secondary action: View user profile, go back to queue
- Information hierarchy: Title + Status → Details → Actions
- Principle applied: **Clear Error Recovery** - Clear approve/reject paths; rejection requires reason
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Request Queue / → to Content Form (approve), Queue (back/reject)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Approve | S-ADM-04 | This file |
| User profile | S-PROF-03 | 04-profile.html |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Title | PRIMARY | ContentRequest.title | Text | What was requested |
| Type | PRIMARY | ContentRequest.type | Badge | Drama/Movie |
| Year | SECONDARY | ContentRequest.year | Text | If provided |
| Notes | SECONDARY | ContentRequest.notes | Text | User's additional info |
| Submitted by | SECONDARY | User | Link to profile | User info |
| Status | PRIMARY | ContentRequest.status | Badge | Current state |
| Created | TERTIARY | ContentRequest.created_at | Date | When submitted |
| Reviewed | TERTIARY | ContentRequest.reviewed_at | Date | When processed |
| Rejection reason | PRIMARY | ContentRequest.rejection_reason | Text | If rejected |

**Actions (PENDING):**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Approve | Primary button | Bottom | Navigate to Content Form (pre-filled) |
| Reject | Danger button | Bottom | Open rejection modal |
| Back | Secondary button | Top | Return to Request Queue |

**Actions (APPROVED):**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| View content | Primary button | Bottom | Navigate to Content Detail |
| Back | Secondary button | Top | Return to Request Queue |

**Actions (REJECTED):**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Back | Secondary button | Top | Return to Request Queue |

**Rejection Modal:**
| Field | Type | Required |
|-------|------|----------|
| Rejection reason | Textarea | YES |
| Actions | "Cancel" / "Reject Request" | - |

**States:**
_Pending_: Approve and Reject buttons visible
_Approved_: Shows "Content created: [title]" + View button
_Rejected_: Shows rejection reason

**Navigation:**
Approve → /admin/content/new?request={id}
Reject → Stay on page, show rejection reason
Back → /admin/requests
View content → /content/{slug}
User profile → /user/{username}

---

## S-ADM-04 Content Creation Form

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Required; main identifier |
| Type | PRIMARY | Required; categorization |
| Year | PRIMARY | Required; release context |
| Slug | SECONDARY | Auto-generated; URL identifier |
| Synopsis | SECONDARY | Content description |
| Poster URL | SECONDARY | Visual representation |
| Genres | SECONDARY | Categorization |
| Episodes/Duration | SECONDARY | Type-specific detail |
| Cast | TERTIARY | Reference information |
| Country | TERTIARY | Origin (default: South Korea) |

### Screen Definition

**UX structure decision:**
- Primary action: Create new content entry
- Secondary action: Cancel and return
- Information hierarchy: Required fields → Important optional → Tertiary optional
- Principle applied: **Error Prevention First** - Clear required/optional; validation on submit
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Dashboard, Request approval / → to Catalog Management (on save)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| None - all navigation within this file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Title input | PRIMARY | User input | Text field | Required, 1-255 chars |
| Slug input | SECONDARY | Auto-gen (editable) | Text field | URL-friendly |
| Type dropdown | PRIMARY | User input | Dropdown | Required: Drama/Movie |
| Year input | PRIMARY | User input | Number field | Required, 1900-current+1 |
| Synopsis textarea | SECONDARY | User input | Textarea | Optional |
| Poster URL input | SECONDARY | User input | Text field | URL, optional |
| Genres multi-select | SECONDARY | User input | Multi-select | From predefined list |
| Cast input | TERTIARY | User input | Text field | Comma-separated |
| Episodes input | SECONDARY | User input | Number field | Drama only |
| Duration input | SECONDARY | User input | Number field | Movie only, in minutes |
| Country input | TERTIARY | User input | Text field | Default: South Korea |

**Pre-defined Genres:**
Romance, Drama, Comedy, Thriller, Mystery, Horror, Fantasy, Action, Historical, Medical, Legal, School, Slice of Life, Sci-Fi

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Create | Primary button | Bottom | Create content, show success |
| Cancel | Secondary button | Bottom | Discard, return to previous page |

**Conditional Fields:**
- If Type = Drama: Show Episodes field, hide Duration
- If Type = Movie: Show Duration field, hide Episodes

**States:**
_From request_: Form pre-filled with request data (title, type, year, notes → synopsis)
_New content_: Empty form
_Loading_: Button spinner during save
_Success_: "Content '[title]' created successfully!"
_Error_: "Failed to create content. Please try again."

**Validation:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Title | Required, 1-255 chars | "Please enter a title." |
| Type | Required | "Please select a type." |
| Year | Required, 1900-current+1 | "Please enter a valid year." |
| Poster URL | Valid URL format (if provided) | "Please enter a valid URL." |

**Navigation:**
Create → /admin/content (Catalog Management)
Cancel → Previous page or /admin/content

---

## S-ADM-05 Content Edit Form

### Data Field Importance Matrix

Same as Content Creation Form - all fields editable except ID.

### Screen Definition

**UX structure decision:**
- Primary action: Update existing content
- Secondary action: Cancel and return
- Information hierarchy: Same as Creation Form
- Principle applied: **Feedback and System Status** - Changes reflected immediately on public pages
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Catalog Management / → to Catalog Management (on save)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| None - all navigation within this file |

**Data displayed:**
Same as Creation Form, with all fields pre-filled with current content data.

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Save | Primary button | Bottom | Update content, show success |
| Cancel | Secondary button | Bottom | Discard, return to Catalog |

**States:**
_Edit mode_: All fields pre-filled
_Loading_: Button spinner during save
_Success_: "Content updated successfully!"
_Error_: "Failed to update content. Please try again."

**Navigation:**
Save → /admin/content (Catalog Management)
Cancel → /admin/content

---

## S-ADM-06 Catalog Management

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Main identifier for finding content |
| Type | PRIMARY | Categorization; helps filter |
| Actions (Edit/Delete) | PRIMARY | Admin controls; reason for this page |
| Poster | SECONDARY | Visual confirmation |
| Year | SECONDARY | Context |
| Genres | SECONDARY | Categorization |
| Date added | TERTIARY | Chronological reference |

### Screen Definition

**UX structure decision:**
- Primary action: Find and manage content (edit/delete)
- Secondary action: Add new content, filter/search
- Information hierarchy: Search/Filter → Content table → Actions per row
- Principle applied: **Efficiency for Frequent Tasks** - Quick search, easy edit/delete access
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Admin Dashboard / → to Content Edit Form, Content Creation Form

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Add new | S-ADM-04 | This file |
| Edit | S-ADM-05 | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Content table | PRIMARY | Content (all) | Paginated table (50/page) | Main content |
| Poster | SECONDARY | Content.poster_url | Thumbnail | Visual |
| Title | PRIMARY | Content.title | Text | Identifier |
| Type | PRIMARY | Content.type | Badge | Drama/Movie |
| Year | SECONDARY | Content.year | Text | Release year |
| Genres | SECONDARY | Content.genres | Tags | Genre list |
| Date added | TERTIARY | Content.created_at | Date | When added |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Search | Input field | Top | Filter by title |
| Filter by type | Dropdown | Top | Filter results |
| Sort | Dropdown | Top | Reorder results |
| Add new | Primary button | Top | Navigate to Content Form |
| Edit | Button | Each row | Navigate to Edit Form |
| Delete | Danger button | Each row | Show confirmation dialog |

**Delete Confirmation Dialog:**
- Title: "Delete Content"
- Message: "Delete '[title]'? This will also remove all journal entries for this content. This cannot be undone."
- Actions: "Cancel" / "Delete"

**States:**
_Loading_: Skeleton table
_Empty_: "No content in catalog. Add some to get started!"
_Populated_: Content table visible
_Error_: "Failed to load content. Please try again."

**Navigation:**
Add new → /admin/content/new
Edit → /admin/content/{id}/edit
Delete → Confirm → Remove content, refresh table

---

═══════════════════════════════════════════════════════════════
WAVE NOTES
═══════════════════════════════════════════════════════════════

## Admin Access Control

- Only ADMIN role can access /admin/* routes
- Non-admin users see 403 Forbidden
- Admin navigation link only visible to admins
- Admin session has same duration as regular user session

## Request Processing Workflow

```
Request submitted (PENDING)
        │
        ▼
Admin reviews request
        │
   ┌────┴────┐
   │         │
APPROVE    REJECT
   │         │
   ▼         ▼
Content    Reason
created    stored
   │         │
   ▼         ▼
APPROVED  REJECTED
   │         │
   ▼         ▼
User can   User sees
add to     reason
journal
```

## Content Deletion Impact

When admin deletes content:
1. All journal entries for that content are deleted (cascade)
2. All ratings, reviews, favorites are removed
3. Content no longer appears in catalog or search
4. User profile stats are recalculated
5. **This is permanent** - no undo (MVP)

## Spam Prevention

Admin can see:
- User email when reviewing requests
- Request history per user
- Duplicate requests flagged

Rate limiting:
- 5 content requests per user per day
- Duplicate requests (same title + type) merged

## Cross-File Links Summary

| From Screen | Action | To Screen | Wireframe File |
|-------------|--------|-----------|----------------|
| S-ADM-01 | Review requests | S-ADM-02 | This file |
| S-ADM-01 | Add content | S-ADM-04 | This file |
| S-ADM-01 | Manage catalog | S-ADM-06 | This file |
| S-ADM-02 | Click request | S-ADM-03 | This file |
| S-ADM-02 | Quick approve | S-ADM-04 | This file |
| S-ADM-03 | Approve | S-ADM-04 | This file |
| S-ADM-03 | User profile | S-PROF-03 | 04-profile.html |
| S-ADM-04 | Create | S-ADM-06 | This file |
| S-ADM-05 | Save | S-ADM-06 | This file |
| S-ADM-06 | Add new | S-ADM-04 | This file |
| S-ADM-06 | Edit | S-ADM-05 | This file |
