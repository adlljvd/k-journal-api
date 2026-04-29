=== WAVE 2 SCREENS: Content Catalog & Discovery ===
Project: KJOURNAL-001-k-journal-platform
Module: CONTENT
Wireframe: wireframes/02-content.html

═══════════════════════════════════════════════════════════════
WAVE OVERVIEW
═══════════════════════════════════════════════════════════════

This wave covers content discovery and browsing:
- Homepage with featured content
- Full catalog with filters
- Search functionality
- Content detail pages

**Screens in this wave:**
| ID | Screen Name | Purpose |
|----|-------------|---------|
| S-CAT-01 | Homepage | Entry point, featured content |
| S-CAT-02 | Content Catalog | Browse all content |
| S-CAT-03 | Content Detail | View content info, add to journal |
| S-CAT-04 | Search Results | Find specific content |

---

## S-CAT-01 Homepage

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Featured content cards | PRIMARY | Editorial picks to engage users immediately |
| Search bar | PRIMARY | Primary discovery mechanism for known titles |
| Recently Added | SECONDARY | Fresh content signal; encourages return visits |
| Top Rated | SECONDARY | Quality signal; helps users find popular content |

### Screen Definition

**UX structure decision:**
- Primary action: Discover featured content OR search for specific title
- Information hierarchy: Featured section → Browse CTA → Recent/Top sections
- Principle applied: **Progressive Disclosure** - Show featured first; secondary content below fold
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Logo click, Direct URL / → to Content Detail, Catalog, Search

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click featured item | S-CAT-03 | This file |
| "Browse All" | S-CAT-02 | This file |
| Search submit | S-CAT-04 | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Featured content | PRIMARY | Content (featured=true) | Carousel/Grid of cards | Admin-curated |
| Featured card: Poster | PRIMARY | Content.poster_url | Image | Visual hook |
| Featured card: Title | PRIMARY | Content.title | Text | Identifies content |
| Featured card: Type | SECONDARY | Content.type | Badge (Drama/Movie) | Quick categorization |
| Search bar | PRIMARY | User input | Text field | Global search |
| Recently Added | SECONDARY | Content (latest 6) | Grid of cards | Freshness signal |
| Top Rated | SECONDARY | Content (high avg rating, min 5) | Grid of cards | Quality signal |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Click featured | Card click | Featured section | Navigate to Content Detail |
| Browse all | Primary button | Below featured | Navigate to full Catalog |
| Search | Input + button | Header | Navigate to Search Results |
| Click recent/top | Card click | Grid sections | Navigate to Content Detail |

**States:**
_Loading_: Skeleton loaders for content cards
_Empty featured_: "No featured content yet. Check back soon!"
_Populated_: Content cards visible with posters, titles, types
_Error_: "Unable to load content. Please try again."

**Navigation:**
Click content → /content/{slug}
Browse all → /catalog
Search → /search?q={query}

---

## S-CAT-02 Content Catalog

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Content grid | PRIMARY | Main content; what users came to browse |
| Filter controls | SECONDARY | Help narrow down large catalogs |
| Sort control | SECONDARY | Help find content by preference |
| Pagination | TERTIARY | Navigate large result sets |

### Screen Definition

**UX structure decision:**
- Primary action: Browse and select content to view
- Secondary action: Filter/sort to narrow results
- Information hierarchy: Filter controls → Content grid → Pagination
- Principle applied: **Efficiency for Frequent Tasks** - Filters and sort easily accessible; grid shows key info at a glance
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Homepage, Navigation / → to Content Detail

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click content card | S-CAT-03 | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Content grid | PRIMARY | Content (paginated) | Grid of cards (20 per page) | Main content |
| Card: Poster | PRIMARY | Content.poster_url | Image | Visual identifier |
| Card: Title | PRIMARY | Content.title | Text | Identifies content |
| Card: Type | SECONDARY | Content.type | Badge (Drama/Movie) | Quick categorization |
| Card: Year | SECONDARY | Content.year | Text | Release year |
| Card: Avg Rating | SECONDARY | Calculated | Stars | Quality signal |
| Type filter | SECONDARY | User selection | Dropdown | Filter by Drama/Movie/All |
| Genre filter | SECONDARY | User selection | Multi-select dropdown | Filter by genre(s) |
| Sort control | SECONDARY | User selection | Dropdown | Title, Year, Rating |
| Pagination | TERTIARY | Calculated | Page numbers | Navigate pages |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Filter by type | Dropdown | Top bar | Filter results |
| Filter by genre | Multi-select | Top bar | Filter results |
| Sort | Dropdown | Top bar | Reorder results |
| Click content | Card click | Grid | Navigate to Content Detail |
| Page navigation | Click page | Bottom | Navigate pages |

**States:**
_Loading_: Skeleton grid
_Empty_: "No content found. Try adjusting your filters."
_No results_: "No content matches your filters. Try different criteria."
_Populated_: Content cards visible
_Error_: "Unable to load content. Please try again."

**Navigation:**
Click content → /content/{slug}
Clear filters → Reset to default view

---

## S-CAT-03 Content Detail

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Title | PRIMARY | Primary identifier; what user searched for |
| Poster | PRIMARY | Visual confirmation; recognition |
| Watch status / Rating | PRIMARY | User's relationship with this content; decision point |
| Synopsis | SECONDARY | Helps user decide to watch/track |
| Type/Year | SECONDARY | Context information |
| Genres | SECONDARY | Categorization; taste matching |
| Average rating | SECONDARY | Community quality signal |
| Add to Journal button | PRIMARY | Primary action for logged-in users |
| Cast | TERTIARY | Reference information |
| Episodes/Duration | TERTIARY | Specific details for type |
| Total logged | TERTIARY | Popularity signal |

### Screen Definition

**UX structure decision:**
- Primary action: Add to journal (logged in) OR view journal entry status
- Secondary action: View metadata, ratings, reviews
- Information hierarchy: Poster + Title + Primary action → Metadata → User's entry (if exists) → Stats
- Principle applied: **Recognition over Recall** - Show user's current entry status if they've already added
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Catalog, Search, Profile / → to Journal Entry Form (add/edit)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| "Add to Journal" | S-JRN-02 | 03-journal.html |
| "Edit Entry" | S-JRN-02 | 03-journal.html |
| "Log in to add" | S-AUTH-02 | 01-auth.html |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Title | PRIMARY | Content.title | H1 | Main identifier |
| Type | SECONDARY | Content.type | Badge | Drama or Movie |
| Year | SECONDARY | Content.year | Text | Release year |
| Poster | PRIMARY | Content.poster_url | Large image | Visual hook |
| Synopsis | SECONDARY | Content.synopsis | Paragraph | Plot description |
| Genres | SECONDARY | Content.genres | Tags | Genre list |
| Cast | TERTIARY | Content.cast | Comma-separated | Actor names |
| Episodes | TERTIARY | Content.episodes | "X episodes" | Drama only |
| Duration | TERTIARY | Content.duration_minutes | "X min" | Movie only |
| Country | TERTIARY | Content.country | Text | Default: South Korea |
| Average rating | SECONDARY | Calculated | Stars + count | Community rating |
| Total logged | TERTIARY | Calculated | "X users logged this" | Popularity |
| User's status | PRIMARY | JournalEntry.status | Badge | If in journal |
| User's rating | PRIMARY | JournalEntry.rating | Stars | If rated |
| User's review | SECONDARY | JournalEntry.review | Text (truncated) | If reviewed |
| User's favorite | TERTIARY | JournalEntry.is_favorite | Heart icon | If favorited |

**Actions (logged in, not in journal):**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Add to Journal | Primary button | Below poster | Open Journal Entry Form |

**Actions (logged in, in journal):**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Edit Entry | Secondary button | Below user's entry | Open Journal Entry Form (pre-filled) |

**Actions (guest):**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Log in to add | Primary button | Below poster | Navigate to Login |

**States:**
_Loading_: Skeleton for poster + metadata
_Empty poster_: Placeholder image
_No rating_: "Not yet rated"
_Populated_: All metadata visible
_Error_: "Unable to load content. Please try again."

**Navigation:**
Add to Journal → Journal Entry Form
Edit Entry → Journal Entry Form
Log in → /login
Back → Previous page or /catalog

---

## S-CAT-04 Search Results

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Search query | PRIMARY | User's intent; confirmation of what they searched |
| Result cards | PRIMARY | Matches to user's query; what they came for |
| "No results" message | PRIMARY | Critical feedback when query fails |
| Content Request CTA | PRIMARY | Recovery path when content not found |

### Screen Definition

**UX structure decision:**
- Primary action: Select a result to view details
- Secondary action: Request missing content (if no results)
- Information hierarchy: Search query → Results → No results message + CTA
- Principle applied: **Meaningful Empty States** - When no results, provide clear path forward (request content)
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Search bar (any page) / → to Content Detail or Content Request

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Click result | S-CAT-03 | This file |
| "Request this title" | S-CAT-05 | 03-journal.html |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Search query | PRIMARY | User input | Display text | "Results for '[query]'" |
| Result cards | PRIMARY | Content (search matches) | List of cards (top 10) | Search results |
| Card: Poster | PRIMARY | Content.poster_url | Thumbnail | Visual identifier |
| Card: Title | PRIMARY | Content.title | Text | Matched content |
| Card: Type | SECONDARY | Content.type | Badge | Drama or Movie |
| Card: Year | SECONDARY | Content.year | Text | Release year |
| No results message | PRIMARY | N/A | Text + CTA | When no matches |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Click result | Card click | Results list | Navigate to Content Detail |
| Request content | Text link | No results state | Navigate to Content Request Form |
| Modify search | Input field | Top | Update results |

**States:**
_Loading_: Skeleton results
_Results found_: List of matching content cards
_No results_: "No results for '[query]'. Try a different search or request this title." + "Request this title" link
_Error_: "Search failed. Please try again."

**Navigation:**
Click result → /content/{slug}
Request content → /request-content?title={query}
Modify search → Update results

---

═══════════════════════════════════════════════════════════════
WAVE NOTES
═══════════════════════════════════════════════════════════════

## Content Card Pattern

The content card is a reusable component used across multiple screens.

**Card Anatomy:**
```
┌─────────────────────┐
│                     │
│    [Poster Image]   │
│                     │
├─────────────────────┤
│ Title               │
│ [Type Badge] Year   │
│ ★★★★☆ (4.2)        │
└─────────────────────┘
```

**Card States:**
- Default: Shows poster, title, type, year, avg rating
- Hover: Slight elevation, pointer cursor
- Loading: Skeleton placeholder
- Error: Placeholder with "Image unavailable"

**Card Interaction:**
- Click anywhere → Navigate to Content Detail
- No separate "View" button; entire card is clickable

## Search Behavior

- **Trigger:** User types in search bar (global header)
- **Debounce:** 300ms delay before search executes
- **Scope:** Title field only (case-insensitive, partial match)
- **Results:** Top 10 matches shown in dropdown
- **Full results:** "See all results" link → Search Results page

## Filter/Sort Persistence

- Filter and sort state persists during session
- URL reflects current filter/sort state (shareable)
- Clear filters button returns to default view

## Cross-File Links Summary

| From Screen | Action | To Screen | Wireframe File |
|-------------|--------|-----------|----------------|
| S-CAT-01 | Click featured/recent/top | S-CAT-03 | This file |
| S-CAT-01 | Browse All | S-CAT-02 | This file |
| S-CAT-01 | Search | S-CAT-04 | This file |
| S-CAT-02 | Click content | S-CAT-03 | This file |
| S-CAT-03 | Add to Journal | S-JRN-02 | 03-journal.html |
| S-CAT-03 | Edit Entry | S-JRN-02 | 03-journal.html |
| S-CAT-03 | Log in | S-AUTH-02 | 01-auth.html |
| S-CAT-04 | Click result | S-CAT-03 | This file |
| S-CAT-04 | Request content | S-CAT-05 | 03-journal.html |
