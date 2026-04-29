=== MULTI-ACTOR WORKFLOW: K-Journal ===
Project: KJOURNAL-001-k-journal-platform
Phase: 2
Status: Complete

═══════════════════════════════════════════════════════════════
OVERVIEW
═══════════════════════════════════════════════════════════════

K-Journal involves two primary actors with interdependent workflows:
- **USER (Enthusiast)** - Primary content consumer and journal owner
- **ADMIN** - Content manager and request approver

This document maps the handoffs and dependencies between these roles.

---

═══════════════════════════════════════════════════════════════
WORKFLOW 1: Content Request Pipeline
═══════════════════════════════════════════════════════════════

**Context:** User wants to track content that doesn't exist in the catalog.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Search for content → Not found                                      │
│  2. Submit Content Request (title, type, year, notes)                   │
│  3. Request stored with status: PENDING                                 │
│  4. User navigates to "My Requests" to check status                     │
│                                                                         │
│  ┌──────────────────────┐                                               │
│  │   WAITING STATE      │ ← User cannot proceed until admin acts       │
│  │   Status: PENDING    │                                               │
│  └──────────────────────┘                                               │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           ADMIN WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│  5. Admin opens Request Queue                                           │
│  6. Admin reviews request details                                       │
│  7. Decision point:                                                     │
│     ├── APPROVE → Open content form (pre-filled) → Create content       │
│     └── REJECT → Enter rejection reason → Save                          │
│  8. Request status updated: APPROVED or REJECTED                        │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER NOTIFICATION                             │
├─────────────────────────────────────────────────────────────────────────┤
│  9. User sees updated status in "My Requests"                           │
│                                                                         │
│  IF APPROVED:                                                           │
│  ├── CTA: "View in Catalog" → Content Detail page                       │
│  └── User can now add to journal                                        │
│                                                                         │
│  IF REJECTED:                                                           │
│  ├── Reason displayed                                                   │
│  └── No further action possible                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Handoff Points:**

| Step | From | To | Data Passed | Wait Time |
|------|------|-----|-------------|-----------|
| 2→5 | User | Admin | Request data (title, type, year, notes, user info) | Hours to days |
| 7→9 | Admin | User | Status (APPROVED/REJECTED), rejection reason, content link | Immediate |

**Design Implications:**

1. **User side:**
   - Clear status visibility in "My Requests"
   - Set expectations: "We'll review it shortly"
   - No notification spam; user checks when they want

2. **Admin side:**
   - Efficient queue view (oldest first)
   - Quick approve/reject actions
   - User context visible (email for spam detection)

3. **System side:**
   - Rate limiting (5 requests/day/user)
   - Duplicate detection (same title + type)
   - Notification on status change (in-app)

---

═══════════════════════════════════════════════════════════════
WORKFLOW 2: Catalog Growth Loop
═══════════════════════════════════════════════════════════════

**Context:** How the catalog grows over time through user requests and admin actions.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   USERS      │     │   REQUESTS   │     │   ADMIN      │
│  (Many)      │     │   QUEUE      │     │  (One)       │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │  Search fails      │                    │
       │───────────────────▶│                    │
       │                    │                    │
       │  Submit request    │                    │
       │───────────────────▶│                    │
       │                    │  Request pending   │
       │                    │───────────────────▶│
       │                    │                    │
       │                    │    Approve/Reject  │
       │                    │◀───────────────────│
       │                    │                    │
       │  Status update     │                    │
       │◀───────────────────│                    │
       │                    │                    │
       │  If approved:      │                    │
       │  View content      │                    │
       │────────────────────────────────────────▶│
       │                    │                    │
       │  Add to journal    │                    │
       │────────────────────────────────────────▶│
       │                    │                    │
       │  Journal entry     │    Content now     │
       │◀───────────────────────────────────────│
       │                    │    available to    │
       │                    │    ALL users       │
       │                    │                    │
       ▼                    ▼                    ▼
  ┌─────────────────────────────────────────────────────┐
  │              CATALOG GROWS                          │
  │  • More content available                           │
  │  • More users can find what they want               │
  │  • Platform value increases                         │
  └─────────────────────────────────────────────────────┘
```

**Metrics to Track:**

| Metric | Target | Owner |
|--------|--------|-------|
| Request submission rate | 5+ per day | Users |
| Request approval rate | 80%+ | Admin |
| Time to approval | < 48 hours | Admin |
| Post-approval adoption | 50%+ add to journal | Users |

---

═══════════════════════════════════════════════════════════════
WORKFLOW 3: Journal Entry to Profile Visibility
═══════════════════════════════════════════════════════════════

**Context:** How user actions in journal become visible on public profile.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER CREATES JOURNAL ENTRY                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Inputs:                                                                │
│  ├── Watch status (required)                                            │
│  ├── Rating (optional)                                                   │
│  ├── Review (optional)                                                   │
│  └── Favorite flag (optional)                                            │
│                                                                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│    PERSONAL JOURNAL       │   │    PUBLIC PROFILE         │
│    (User's view)          │   │    (Others' view)         │
├───────────────────────────┤   ├───────────────────────────┤
│ • All entries visible     │   │ • All entries visible     │
│ • Edit/Delete actions     │   │ • View only               │
│ • Filter by status        │   │ • Click to content        │
│ • Sort options            │   │                           │
└───────────────────────────┘   └───────────────────────────┘
                │                               │
                │                               ▼
                │               ┌───────────────────────────┐
                │               │    PROFILE STATS          │
                │               │    (Auto-computed)        │
                │               ├───────────────────────────┤
                │               │ • Total logged            │
                │               │ • Mean rating             │
                │               │ • Favorites count         │
                │               └───────────────────────────┘
                │
                ▼ (if favorite = true)
┌─────────────────────────────────────────────────────────────────────────┐
│                        PROFILE FAVORITES SELECTION                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User can select up to 4 favorites to display prominently on profile   │
│                                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │  Fave 1 │ │  Fave 2 │ │  Fave 3 │ │  Fave 4 │                       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                       │
│                                                                         │
│  Selection from: All content marked as favorite in journal              │
│  Display order: User-defined (draggable in Phase 2)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Data Flow:**

| User Action | Journal Effect | Profile Effect | Stats Effect |
|-------------|----------------|----------------|--------------|
| Add entry | +1 entry | +1 visible entry | +1 total logged |
| Rate (0.5-5.0) | Rating stored | Rating visible on entry | Mean rating updated |
| Write review | Review stored | Review visible on entry | - |
| Mark favorite | Favorite flag set | Entry in favorites list | +1 favorites count |
| Select for profile | Profile favorite set | Shows in top 4 slots | - |
| Delete entry | Entry removed | Entry removed | Stats recomputed |

---

═══════════════════════════════════════════════════════════════
WORKFLOW 4: Guest to User Conversion
═══════════════════════════════════════════════════════════════

**Context:** How a guest becomes a registered user.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           GUEST STATE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CAN:                          CANNOT:                                  │
│  ✓ Browse catalog              ✗ Add to journal                         │
│  ✓ Search content              ✗ Rate/review                            │
│  ✓ View content detail         ✗ Mark favorites                         │
│  ✓ View public profiles        ✗ Submit content requests                │
│  ✓ Search users                ✗ Edit profile                           │
│                                                                         │
│  When guest tries restricted action → "Log in to [action]" prompt      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ Trigger: Guest wants to add to journal
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CONVERSION FUNNEL                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Click "Log in to add to your journal"                               │
│     ↓                                                                   │
│  2. Login page with "Create an account" option                          │
│     ↓                                                                   │
│  3. Registration form (email, username, password)                       │
│     ↓                                                                   │
│  4. Account created → Auto-login                                        │
│     ↓                                                                   │
│  5. Redirect to Journal Entry Form (context preserved)                  │
│     ↓                                                                   │
│  6. User completes their first journal entry                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER STATE                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  All guest permissions PLUS:                                            │
│  ✓ Add to journal                                                       │
│  ✓ Rate/review                                                          │
│  ✓ Mark favorites                                                       │
│  ✓ Submit content requests                                              │
│  ✓ Edit profile                                                         │
│  ✓ View own journal                                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Conversion Optimization:**

| Stage | Friction Risk | Mitigation |
|-------|---------------|------------|
| Login prompt | Extra click | Clear value prop: "Log in to add to your journal" |
| Registration form | Abandonment | 3 fields only, no email verification |
| Post-signup | Lost context | Redirect to Journal Entry Form, not generic page |
| First entry | Unclear what to do | Welcome prompt with CTA |

---

═══════════════════════════════════════════════════════════════
WORKFLOW 5: Content Lifecycle
═══════════════════════════════════════════════════════════════

**Context:** How content moves through the system from creation to user interaction.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CONTENT LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐                                                   │
│  │    CREATION      │                                                   │
│  │    (Admin)       │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           │ Admin creates content manually or via request approval      │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │    AVAILABLE     │                                                   │
│  │    (Catalog)     │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           │ Content visible in: catalog, search, homepage               │
│           ▼                                                             │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐│
│  │    DISCOVERY     │────▶│    USER VIEW     │────▶│   JOURNAL ADD    ││
│  │    (Users)       │     │    (Detail)      │     │   (Users)        ││
│  └──────────────────┘     └──────────────────┘     └────────┬─────────┘│
│                                                              │          │
│                                                              ▼          │
│           ┌──────────────────────────────────────────────────────────┐ │
│           │                    JOURNAL ENTRIES                       │ │
│           │  • Each user can have ONE entry per content              │ │
│           │  • Entry includes: status, rating, review, favorite      │ │
│           │  • Entry visible on user's public profile                │ │
│           └──────────────────────────────────────────────────────────┘ │
│                                                              │          │
│                                                              ▼          │
│           ┌──────────────────────────────────────────────────────────┐ │
│           │                    AGGREGATE STATS                       │ │
│           │  • Average rating (from all ratings)                     │ │
│           │  • Total logged count                                    │ │
│           │  • Visible on content detail page                        │ │
│           └──────────────────────────────────────────────────────────┘ │
│           │                                                             │
│           │ Admin may edit content metadata                            │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │    UPDATE        │                                                   │
│  │    (Admin)       │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                             │
│           │ Changes reflected immediately in all views                 │
│           │                                                             │
│           │ Admin may delete content (with cascade)                    │
│           ▼                                                             │
│  ┌──────────────────┐                                                   │
│  │    DELETION      │                                                   │
│  │    (Admin)       │                                                   │
│  └──────────────────┘                                                   │
│                                                                         │
│  ⚠️ Warning: Deleting content removes ALL associated journal entries   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

═══════════════════════════════════════════════════════════════
DEPENDENCY MATRIX
═══════════════════════════════════════════════════════════════

| User Action | Depends On | Admin Action | User Impact |
|-------------|------------|--------------|-------------|
| Add to journal | Content exists in catalog | Create content | Can track content |
| Submit request | None | Approve/Reject | Can (or cannot) track content |
| Set profile favorites | Has favorites in journal | None | Profile showcases taste |
| View profile stats | Has journal entries | None | Stats auto-computed |
| Search content | Catalog has content | Seed/curate catalog | Better discovery |

| Admin Action | Depends On | User Action | Admin Impact |
|--------------|------------|-------------|--------------|
| Approve request | User submitted request | Submit request | Creates content |
| Edit content | Content exists | Users have entries | Metadata updated |
| Delete content | Content exists | Users lose entries | Removes journal data |

---

═══════════════════════════════════════════════════════════════
TIMING EXPECTATIONS
═══════════════════════════════════════════════════════════════

| Workflow | User Wait Time | Admin Action Time | System Response |
|----------|----------------|-------------------|-----------------|
| Search/Browse | Instant | N/A | < 500ms |
| Journal entry save | Instant | N/A | < 1s |
| Content request | Days | Minutes | Instant status update |
| Profile update | Instant | N/A | < 1s |
| Content creation | N/A | Minutes | Instant availability |
| Stats computation | Instant | N/A | Calculated on load |

---

═══════════════════════════════════════════════════════════════
NOTIFICATION TRIGGERS
═══════════════════════════════════════════════════════════════

| Event | Actor | Recipient | Method | Message |
|-------|-------|-----------|--------|---------|
| Request approved | Admin | User | In-app | "Your content request '[title]' has been approved!" |
| Request rejected | Admin | User | In-app | "Your content request '[title]' was not approved. Reason: [reason]" |
| Password reset | User | User | Email | "Reset your K-Journal password" |
| Email changed | User | User | Email | "Confirm your new email address" |
| Account deleted | User | User | Email | "Your K-Journal account has been deleted" |

**Note:** Email notifications are Phase 2 for password reset and email change. MVP uses admin-assisted password reset.
