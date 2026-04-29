=== PRD: Admin & Content Management ===
Version: 1.0
Scale: L
Project: kjournal-001-k-journal-platform
Flow Document ref: v0.1
MVP: IN
Status: Validated

═══════════════════════════════════════════════════════════════
1. PROBLEM STATEMENT
═══════════════════════════════════════════════════════════════

Admins need to manage the content catalog and review user-submitted content requests. The platform uses a curated catalog model where only admins can add content to the main database, ensuring quality and consistency. Users can request missing titles, which admins review and approve/reject.

**Current state:** No admin system exists.
**Impact:** No way to populate or maintain the content catalog.
**What changes:** Admins can manage content (CRUD), review content requests, and seed initial catalog data.

═══════════════════════════════════════════════════════════════
2. ROLES & PERMISSIONS
═══════════════════════════════════════════════════════════════

| Role | View Requests | Approve/Reject Requests | Create Content | Edit Content | Delete Content | View All Users |
|------|---------------|------------------------|----------------|--------------|----------------|----------------|
| USER | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (future) |

**Note:** MVP has single super-admin role. Multi-admin with granular permissions is Phase 2.

═══════════════════════════════════════════════════════════════
3. USER STORIES
═══════════════════════════════════════════════════════════════

### Story ADM-01: Access Admin Dashboard
As an admin,
I want to access an admin dashboard,
so that I can manage content and requests from one place.

**Acceptance Criteria:**
- AC-ADM-01-001: Admin dashboard accessible at /admin (requires admin role)
- AC-ADM-01-002: Dashboard shows summary: pending requests count, total content count, recent requests
- AC-ADM-01-003: Quick actions: "Review Pending Requests", "Add New Content", "Manage Catalog"
- AC-ADM-01-004: Non-admin users see 403 Forbidden when accessing /admin
- AC-ADM-01-005: Navigation shows "Admin" link when logged in as admin

---

### Story ADM-02: Review Content Requests
As an admin,
I want to review pending content requests,
so that I can approve legitimate requests and reject invalid ones.

**Acceptance Criteria:**
- AC-ADM-02-001: Request queue shows all requests sorted by submission date (oldest first)
- AC-ADM-02-002: Each request shows: title, type, year, notes, submitted by, date
- AC-ADM-02-003: Filter by status: All, Pending, Approved, Rejected
- AC-ADM-02-004: Approve action opens content creation form (pre-filled with request data)
- AC-ADM-02-005: Reject action opens rejection form (requires reason)
- AC-ADM-02-006: Approving request marks it APPROVED and links to created content
- AC-ADM-02-007: Rejecting request marks it REJECTED with reason stored
- AC-ADM-02-008: User is notified of decision (in-app notification)

---

### Story ADM-03: Create Content
As an admin,
I want to add new K-dramas and K-movies to the catalog,
so that users can track them.

**Acceptance Criteria:**
- AC-ADM-03-001: Content form accessible from admin dashboard
- AC-ADM-03-002: Required fields: title, type (Drama/Movie), year
- AC-ADM-03-003: Optional fields: synopsis, poster URL, genres (multi-select), cast, episodes (drama), duration (movie), country
- AC-ADM-03-004: Slug auto-generated from title (editable)
- AC-ADM-03-005: Validate poster URL is a valid image URL
- AC-ADM-03-006: Save creates content record in database
- AC-ADM-03-007: If creating from approved request, link request to content

---

### Story ADM-04: Edit Content
As an admin,
I want to edit existing content,
so that I can correct errors or add missing information.

**Acceptance Criteria:**
- AC-ADM-04-001: Edit button on each content item in catalog management
- AC-ADM-04-002: Edit form pre-filled with current data
- AC-ADM-04-003: All fields editable except ID and slug (slug can be edited with caution)
- AC-ADM-04-004: Save updates content record
- AC-ADM-04-005: Changes are reflected immediately on public content pages

---

### Story ADM-05: Delete Content
As an admin,
I want to remove content from the catalog,
so that I can clean up incorrect or inappropriate entries.

**Acceptance Criteria:**
- AC-ADM-05-001: Delete button on each content item in catalog management
- AC-ADM-05-002: Delete shows confirmation: "Delete [title]? This will also remove all journal entries for this content. This cannot be undone."
- AC-ADM-05-003: Confirm deletes content and all associated journal entries
- AC-ADM-05-04: Cancel dismisses confirmation
- AC-ADM-05-005: Deleted content no longer appears in catalog or search

---

### Story ADM-06: Manage Catalog (List View)
As an admin,
I want to view and search all content in the catalog,
so that I can find items to edit or delete.

**Acceptance Criteria:**
- AC-ADM-06-001: Catalog management shows all content in paginated table (50 items per page)
- AC-ADM-06-002: Each row shows: poster thumbnail, title, type, year, genres, date added
- AC-ADM-06-003: Search by title
- AC-ADM-06-004: Filter by type (Drama/Movie)
- AC-ADM-06-005: Sort by title, year, date added
- AC-ADM-06-006: Actions column: Edit, Delete buttons
- AC-ADM-06-007: "Add New Content" button at top

---

### Story ADM-07: Seed Initial Content
As an admin,
I want to add initial content to populate the catalog,
so that users have titles to browse and track.

**Acceptance Criteria:**
- AC-ADM-07-001: Admin can add 50-100 K-dramas and K-movies manually via content form
- AC-ADM-07-002: Content should include mix of: popular titles, diverse genres, both dramas and movies
- AC-ADM-07-003: Each seeded item has complete metadata (title, type, year, synopsis, poster, genres)
- AC-ADM-07-004: Seeded content is immediately available in catalog

**Note:** This is a one-time setup task, not a recurring feature. Initial seed data may be provided separately.

═══════════════════════════════════════════════════════════════
4. BUSINESS RULES
═══════════════════════════════════════════════════════════════

| Rule ID | Rule |
|---------|------|
| BR-ADM-01 | Only ADMIN role can access admin routes |
| BR-ADM-02 | Content slug must be unique |
| BR-ADM-03 | Deleting content cascades to delete all associated journal entries |
| BR-ADM-04 | Rejection reason is required when rejecting a content request |
| BR-ADM-05 | Approved requests cannot be rejected (and vice versa) |
| BR-ADM-06 | Admin account is pre-seeded (no public admin registration) |
| BR-ADM-07 | Content requests are processed in order (FIFO), oldest first |
| BR-ADM-08 | Duplicate content requests (same title + type) should be flagged for admin review |
| BR-ADM-09 | Admin can see user email when reviewing requests for accountability/spam detection |
| BR-ADM-10 | Duplicate content merging is Phase 2; not in MVP |
| BR-ADM-11 | Content deletion is hard delete for MVP; soft delete with recovery is Phase 2 |
| BR-ADM-12 | Admin can edit user-submitted request data during content creation before approving |

═══════════════════════════════════════════════════════════════
5. DATA MODEL
═══════════════════════════════════════════════════════════════

Refer to PRD-CONTENT.md for Content and Content Request entities.

Additional admin-specific considerations:

## Admin Activity Log (Optional for MVP)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| admin_id | UUID | FK -> User.id | Admin who performed action |
| action | ENUM | NOT NULL | CREATE_CONTENT, EDIT_CONTENT, DELETE_CONTENT, APPROVE_REQUEST, REJECT_REQUEST |
| entity_type | VARCHAR(50) | NOT NULL | Content, ContentRequest |
| entity_id | UUID | NOT NULL | ID of affected entity |
| details | JSON | NULLABLE | Additional details |
| created_at | TIMESTAMP | NOT NULL, auto | Action timestamp |

**Note:** Activity logging is recommended but may be Phase 2.

═══════════════════════════════════════════════════════════════
6. WORKFLOW MAP
═══════════════════════════════════════════════════════════════

```
Admin Authentication:
[Admin logs in] -> [Role checked] -> [Admin navigation visible]
    -> [Access /admin] -> [Dashboard displayed]

Content Request Workflow:
[Admin opens Request Queue] -> [Views pending requests]
    -> [Selects request] -> [Reviews details]
        -> [APPROVE] -> [Content creation form (pre-filled)] -> [Save] -> [Request marked APPROVED]
        -> [REJECT] -> [Rejection form] -> [Enter reason] -> [Save] -> [Request marked REJECTED]

Content Management Workflow:
[Admin opens Catalog Management] -> [Searches/browses content]
    -> [ADD] -> [Content form] -> [Save] -> [Content created]
    -> [EDIT] -> [Content form (pre-filled)] -> [Save] -> [Content updated]
    -> [DELETE] -> [Confirm] -> [Content + journal entries deleted]
```

═══════════════════════════════════════════════════════════════
7. SCREEN SKELETON
═══════════════════════════════════════════════════════════════

**Screen Inventory:**

| ID | Name | Accessible to | Reached from | MVP |
|----|------|---------------|--------------|-----|
| S-ADM-01 | Admin Dashboard | Admin | Navigation, /admin | YES |
| S-ADM-02 | Content Request Queue | Admin | Dashboard | YES |
| S-ADM-03 | Content Request Detail | Admin | Request queue | YES |
| S-ADM-04 | Content Creation Form | Admin | Dashboard, Request approval | YES |
| S-ADM-05 | Content Edit Form | Admin | Catalog management | YES |
| S-ADM-06 | Catalog Management | Admin | Dashboard | YES |

---

**[S-ADM-01] Admin Dashboard**

Purpose: Central hub for admin operations
Accessible to: Admin only
Reached from: Navigation "Admin" link, /admin URL

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Pending requests count | ContentRequest table | Number badge | NO |
| Total content count | Content table | Number | NO |
| Recent requests | ContentRequest table (latest 5) | List | NO |
| Quick actions | N/A | Buttons | N/A |

Quick Actions:
- Review Pending Requests (X pending)
- Add New Content
- Manage Catalog

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Review requests | "Review Pending Requests" | Always | Navigate to request queue |
| Add content | "Add New Content" | Always | Navigate to content form |
| Manage catalog | "Manage Catalog" | Always | Navigate to catalog management |

States:
- No pending requests: "No pending requests. Great job!"

Navigation:
- Review requests → /admin/requests
- Add content → /admin/content/new
- Manage catalog → /admin/content

---

**[S-ADM-02] Content Request Queue**

Purpose: View and manage all content requests
Accessible to: Admin only
Reached from: Admin dashboard

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Request list | ContentRequest table | Paginated table | NO |
| Title | ContentRequest.title | Text | NO |
| Type | ContentRequest.type | Badge | NO |
| Year | ContentRequest.year | Text | NO |
| Submitted by | User.username | Text | NO |
| Status | ContentRequest.status | Badge | NO |
| Date | ContentRequest.created_at | Date | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Filter by status | Status dropdown | Always | Filter requests |
| View details | Click row | Always | Navigate to request detail |
| Quick approve | "Approve" | Status = PENDING | Open content form (pre-filled) |
| Quick reject | "Reject" | Status = PENDING | Open rejection modal |

States:
- Loading: Skeleton table
- Empty: "No content requests found."
- No pending: "All caught up! No pending requests."

Navigation:
- Click request → /admin/requests/{id}

---

**[S-ADM-03] Content Request Detail**

Purpose: View full request details and take action
Accessible to: Admin only
Reached from: Request queue

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Title | ContentRequest.title | Text | NO |
| Type | ContentRequest.type | Badge | NO |
| Year | ContentRequest.year | Text | NO |
| Notes | ContentRequest.notes | Text | NO |
| Submitted by | User.username | Text (link to profile) | NO |
| Status | ContentRequest.status | Badge | NO |
| Created | ContentRequest.created_at | Date | NO |
| Reviewed | ContentRequest.reviewed_at | Date (if applicable) | NO |
| Rejection reason | ContentRequest.rejection_reason | Text (if rejected) | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Approve | "Approve & Create Content" | Status = PENDING | Navigate to content form (pre-filled) |
| Reject | "Reject Request" | Status = PENDING | Open rejection modal |
| Back | "Back to Queue" | Always | Navigate to request queue |

Rejection Modal:
| Field | Type | Required |
|-------|------|----------|
| Rejection reason | Textarea | YES |

States:
- APPROVED: Shows link to content: "Content created: [title]"
- REJECTED: Shows rejection reason

Navigation:
- Approve → /admin/content/new?request={id}
- Back → /admin/requests

---

**[S-ADM-04] Content Creation Form**

Purpose: Add new content to catalog
Accessible to: Admin only
Reached from: Dashboard, Request approval

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Title | User input | Text field (required) | YES |
| Slug | Auto-generated (editable) | Text field | YES |
| Type | User input | Dropdown: Drama/Movie (required) | YES |
| Year | User input | Number field (required) | YES |
| Synopsis | User input | Textarea | YES |
| Poster URL | User input | Text field (URL) | YES |
| Genres | User input | Multi-select from predefined list | YES |
| Cast | User input | Text field (comma-separated) | YES |
| Episodes | User input | Number field (drama only) | YES |
| Duration | User input | Number field in minutes (movie only) | YES |
| Country | User input | Text field (default: South Korea) | YES |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Save | "Create Content" | Form valid | Create content, show success |
| Cancel | "Cancel" | Always | Discard and return to previous page |

States:
- From request: Form pre-filled with request data
- New content: Empty form
- Loading: Button spinner during save
- Success: "Content '[title]' created successfully!"
- Error: "Failed to create content. Please try again."

Validation:
| Field | Rule | Error Message |
|-------|------|---------------|
| Title | Required, 1-255 chars | "Please enter a title." |
| Type | Required | "Please select a type." |
| Year | Required, valid year (1900-current+1) | "Please enter a valid year." |
| Poster URL | Valid URL format | "Please enter a valid URL." |

Navigation:
- Save → /admin/content (catalog management)
- Cancel → Previous page or /admin/content

---

**[S-ADM-05] Content Edit Form**

Purpose: Edit existing content
Accessible to: Admin only
Reached from: Catalog management

Same fields as creation form, pre-filled with current data.

Additional Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Save | "Save Changes" | Form valid | Update content, show success |

---

**[S-ADM-06] Catalog Management**

Purpose: View, search, and manage all content
Accessible to: Admin only
Reached from: Admin dashboard

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Content list | Content table | Paginated table | NO |
| Poster | Content.poster_url | Thumbnail image | NO |
| Title | Content.title | Text | NO |
| Type | Content.type | Badge | NO |
| Year | Content.year | Text | NO |
| Genres | Content.genres | Tags | NO |
| Date added | Content.created_at | Date | NO |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Search | Search bar | Always | Filter by title |
| Filter by type | Type dropdown | Always | Filter results |
| Sort | Sort dropdown | Always | Reorder results |
| Add new | "Add New Content" | Always | Navigate to creation form |
| Edit | "Edit" | Each row | Navigate to edit form |
| Delete | "Delete" | Each row | Show confirmation dialog |

States:
- Loading: Skeleton table
- Empty: "No content in catalog. Add some to get started!"
- Error: "Failed to load content. Please try again."

Navigation:
- Add new → /admin/content/new
- Edit → /admin/content/{id}/edit
- Delete → Confirmation dialog

═══════════════════════════════════════════════════════════════
8. ENTRY POINTS PER ROLE
═══════════════════════════════════════════════════════════════

| Role | Entry Points |
|------|--------------|
| USER | N/A (no admin access) |
| ADMIN | Admin Dashboard, Request Queue, Catalog Management, Content Forms |

═══════════════════════════════════════════════════════════════
9. NOTIFICATIONS
═══════════════════════════════════════════════════════════════

| Trigger | Type | Recipient | Message |
|---------|------|-----------|---------|
| Content request approved | In-app | Request user | "Your content request '[title]' has been approved!" |
| Content request rejected | In-app | Request user | "Your content request '[title]' was not approved. Reason: [reason]" |

═══════════════════════════════════════════════════════════════
10. SCOPE
═══════════════════════════════════════════════════════════════

**In MVP:**
- Admin dashboard with summary stats
- Content request queue with approve/reject actions
- Content creation and edit forms
- Catalog management (list, search, edit, delete)
- Single super-admin role
- Manual content seeding (50-100 titles)

**Not in MVP (Phase 2+):**
- Multi-admin with granular permissions
- Admin activity logging
- Bulk content operations (import, delete multiple)
- External API integration for auto-import
- Content versioning/history
- User management (view, suspend, delete users)
- Platform analytics dashboard

═══════════════════════════════════════════════════════════════
11. OPEN ITEMS
═══════════════════════════════════════════════════════════════

No open items. All decisions confirmed.
