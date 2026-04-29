=== DATA FIELD IMPORTANCE MATRIX: K-Journal ===
Project: KJOURNAL-001-k-journal-platform
Phase: 3
Status: Complete

═══════════════════════════════════════════════════════════════
OVERVIEW
═══════════════════════════════════════════════════════════════

This document consolidates the Data Field Importance for all screens in K-Journal.
Each field is classified by its importance to the user's decision-making process.

**Importance Levels:**
- **PRIMARY**: Decision-driving information. User needs this to take their next action.
- **SECONDARY**: Supporting context. Helps confirm or explain decisions.
- **TERTIARY**: Reference information. Nice to have but not critical for immediate action.

---

═══════════════════════════════════════════════════════════════
AUTHENTICATION MODULE
═══════════════════════════════════════════════════════════════

## S-AUTH-01 Registration Page

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Email | PRIMARY | Required for account creation and future communication; must be unique |
| Username | PRIMARY | User's public identity across the platform; must be unique |
| Password | PRIMARY | Security credential; must meet minimum requirements |
| Confirm Password | SECONDARY | Validation only; prevents typos during signup |

## S-AUTH-02 Login Page

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Email | PRIMARY | Unique identifier for authentication |
| Password | PRIMARY | Security credential for verification |
| Remember Me | TERTIARY | Convenience option; affects session duration |

## S-AUTH-03 Forgot Password Page

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Email | PRIMARY | Required to send reset instructions; must match existing account |

## S-AUTH-05 Account Settings Page

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Current password | PRIMARY | Required for security verification before changes |
| New password | PRIMARY | Required if changing password |
| Current email | SECONDARY | Reference only; shows current account email |
| Change email | SECONDARY | Optional; for updating contact information |
| Delete account | TERTIARY | Destructive action; requires confirmation |

---

═══════════════════════════════════════════════════════════════
CONTENT CATALOG MODULE
═══════════════════════════════════════════════════════════════

## S-CAT-01 Homepage

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Featured content cards | PRIMARY | Editorial picks to engage users immediately |
| Search bar | PRIMARY | Primary discovery mechanism for known titles |
| Recently Added | SECONDARY | Fresh content signal; encourages return visits |
| Top Rated | SECONDARY | Quality signal; helps users find popular content |

## S-CAT-02 Content Catalog

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Content grid | PRIMARY | Main content; what users came to browse |
| Filter controls | SECONDARY | Help narrow down large catalogs |
| Sort control | SECONDARY | Help find content by preference |
| Pagination | TERTIARY | Navigate large result sets |

### Content Card (reusable)

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Poster | PRIMARY | Visual identifier for quick recognition |
| Title | PRIMARY | Content name; what user is looking for |
| Type badge | SECONDARY | Quick categorization (Drama/Movie) |
| Year | SECONDARY | Release context |
| Average rating | SECONDARY | Quality signal from community |

## S-CAT-03 Content Detail

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Primary identifier; what user searched for |
| Poster | PRIMARY | Visual confirmation; recognition |
| Watch status / Rating | PRIMARY | User's relationship with this content; decision point |
| Add to Journal button | PRIMARY | Primary action for logged-in users |
| Synopsis | SECONDARY | Helps user decide to watch/track |
| Type/Year | SECONDARY | Context information |
| Genres | SECONDARY | Categorization; taste matching |
| Average rating | SECONDARY | Community quality signal |
| Cast | TERTIARY | Reference information |
| Episodes/Duration | TERTIARY | Specific details for type |
| Total logged | TERTIARY | Popularity signal |
| Country | TERTIARY | Origin information |

## S-CAT-04 Search Results

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Search query | PRIMARY | User's intent; confirmation of what they searched |
| Result cards | PRIMARY | Matches to user's query; what they came for |
| "No results" message | PRIMARY | Critical feedback when query fails |
| Content Request CTA | PRIMARY | Recovery path when content not found |

---

═══════════════════════════════════════════════════════════════
JOURNALING MODULE
═══════════════════════════════════════════════════════════════

## S-JRN-01 Personal Journal

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

## S-JRN-02 Journal Entry Form

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Watch status | PRIMARY | Required; defines user's relationship with content |
| Rating | PRIMARY | Key taste expression; optional but highly valuable |
| Content title/info | PRIMARY | Context; confirms what user is tracking |
| Review | SECONDARY | Deep expression; optional |
| Favorite | SECONDARY | Highlight flag; optional |

## S-JRN-03 My Favorites

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Content title | PRIMARY | Identifies favorited content |
| Poster | PRIMARY | Visual recognition for favorites |
| Rating | PRIMARY | User's opinion on favorite content |
| Profile badge | PRIMARY | Shows if selected for public profile |
| Type/Year | SECONDARY | Categorization reference |

## S-CAT-05 Content Request Form

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Required; identifies what user wants |
| Type | PRIMARY | Required; categorizes the request |
| Year | SECONDARY | Optional; helps admin verify |
| Notes | TERTIARY | Optional; additional context for admin |

## S-CAT-06 My Requests

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Identifies what was requested |
| Status | PRIMARY | Current state; user needs to know if approved/rejected |
| Type | SECONDARY | Categorization |
| Submitted date | SECONDARY | Chronological reference |
| Rejection reason | PRIMARY (if rejected) | Explains why request was denied |
| View in Catalog | PRIMARY (if approved) | Action to add to journal |

---

═══════════════════════════════════════════════════════════════
PROFILES MODULE
═══════════════════════════════════════════════════════════════

## S-PROF-01 Own Profile (View)

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Username | PRIMARY | User's identity; always visible |
| Profile favorites | PRIMARY | Showcases user's top 4 picks; key taste signal |
| Journal entries | PRIMARY | User's content journey; main profile content |
| Stats (total, mean rating, favorites) | SECONDARY | At-a-glance engagement summary |
| Bio | SECONDARY | Personal expression |
| Avatar | SECONDARY | Visual identity |

## S-PROF-02 Own Profile (Edit)

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Profile favorites | PRIMARY | Key taste expression; limited to 4 slots |
| Bio | SECONDARY | Personal expression; limited to 160 chars |
| Avatar URL | SECONDARY | Visual identity; URL-only in MVP |

## S-PROF-03 Other User Profile

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Username | PRIMARY | Identifies whose profile this is |
| Profile favorites | PRIMARY | Their taste at a glance |
| Journal entries | PRIMARY | Their content journey; main discovery content |
| Stats | SECONDARY | Their engagement summary |
| Bio | SECONDARY | Their personal expression |
| Avatar | SECONDARY | Their visual identity |

## S-PROF-04 User Search

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Search input | PRIMARY | User's intent; what they're looking for |
| Result cards | PRIMARY | Matching users; main content |
| Username | PRIMARY | Identifies each user in results |
| Bio snippet | SECONDARY | Quick context about user |
| Avatar | SECONDARY | Visual identifier |

---

═══════════════════════════════════════════════════════════════
ADMIN MODULE
═══════════════════════════════════════════════════════════════

## S-ADM-01 Admin Dashboard

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Pending requests count | PRIMARY | Immediate action item; what admin needs to address |
| Quick actions | PRIMARY | Efficient access to common tasks |
| Total content count | SECONDARY | Catalog health indicator |
| Recent requests | SECONDARY | Quick preview of what's pending |

## S-ADM-02 Content Request Queue

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | What was requested; main reference point |
| Status | PRIMARY | Current state; drives admin action |
| Submitted by | PRIMARY | User info for accountability |
| Date | SECONDARY | Chronological ordering (FIFO) |
| Type | SECONDARY | Categorization |

## S-ADM-03 Content Request Detail

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | What was requested; main content |
| Type | PRIMARY | Categorization for content creation |
| Status | PRIMARY | Current state; determines available actions |
| Notes | SECONDARY | User's additional context |
| Submitted by | SECONDARY | User info for follow-up |
| Rejection reason | PRIMARY (if rejected) | Explanation for user |

## S-ADM-04 Content Creation Form

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

## S-ADM-06 Catalog Management

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Main identifier for finding content |
| Type | PRIMARY | Categorization; helps filter |
| Actions (Edit/Delete) | PRIMARY | Admin controls; reason for this page |
| Poster | SECONDARY | Visual confirmation |
| Year | SECONDARY | Context |
| Genres | SECONDARY | Categorization |
| Date added | TERTIARY | Chronological reference |

---

═══════════════════════════════════════════════════════════════
CROSS-CUTTING PATTERNS
═══════════════════════════════════════════════════════════════

## Status Badge (Watch Status)

| Status | Primary Use | Visual Weight |
|--------|-------------|---------------|
| WATCHING | Active, ongoing | Highest prominence |
| COMPLETED | Finished | Standard |
| DROPPED | Stopped | Muted/Warning |
| PLAN_TO_WATCH | On watchlist | Lower prominence |

## Rating Display

| Context | Importance | Visual Treatment |
|---------|------------|------------------|
| User's own rating | PRIMARY | Filled stars, clear number |
| Average rating | SECONDARY | Filled stars, count shown |
| Unrated | TERTIARY | Empty outline or "Not rated" text |

## Content Card (Reusable)

| Field | Importance | Notes |
|-------|------------|-------|
| Poster | PRIMARY | Always visible |
| Title | PRIMARY | Always visible |
| Type badge | SECONDARY | Quick categorization |
| Year | SECONDARY | Context |
| Rating | SECONDARY | Quality signal (when available) |

---

═══════════════════════════════════════════════════════════════
HIERARCHY PRINCIPLES
═══════════════════════════════════════════════════════════════

## Domain Context Questions Applied

For each field, we asked:

| Question | If YES → PRIMARY | If NO → Consider SECONDARY/TERTIARY |
|----------|------------------|-------------------------------------|
| Does user need this to make their NEXT decision? | ✓ | |
| Would missing this cause a wrong decision? | ✓ | |
| Does this help explain WHY they're seeing this screen? | | SECONDARY |
| Is this for verification after the decision is made? | | SECONDARY |
| Is this only needed occasionally or by power users? | | TERTIARY |
| Is this for compliance/audit purposes? | | TERTIARY |

## Anti-Patterns Avoided

❌ "Important information" - Too generic
❌ "User needs to see this" - Not domain-specific
❌ "Nice to have" - No reasoning

## Good Examples

✓ "User's current relationship with content; drives filtering" (Watch status)
✓ "Key taste expression; limited to 4 slots" (Profile favorites)
✓ "User info for accountability" (Submitted by in admin)
