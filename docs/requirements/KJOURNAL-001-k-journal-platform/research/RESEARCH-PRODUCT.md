=== RESEARCH-PRODUCT.md ===
Project: KJOURNAL-001-k-journal-platform
From: @researcher-product
To: @product-analyst
Date: 2026-04-27

═══════════════════════════════════════════════════════════════
EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════

Letterboxd sets the gold standard for entertainment journaling with its diary workflow, 5-star half-increment ratings, and profile-based taste discovery. MyAnimeList (MAL) establishes the industry standard for watch status workflows with 6 distinct states (watching, completed, on-hold, dropped, plan to watch, and an all option). Short reviews in entertainment tracking platforms typically range from no limit (user choice) to 300-500 characters for platform-enforced brevity, though Letterboxd allows unlimited review length. Spotify demonstrates that taste discovery without follow relationships works through Wrapped shareable profiles and public playlist linking. Content request workflows follow TMDB's model: community submission with moderator review, requiring verification of theatrical release, festival screening, or professional distribution.

═══════════════════════════════════════════════════════════════
FINDINGS
═══════════════════════════════════════════════════════════════

## Finding 1: Journaling & Tracking Patterns

### Products analyzed
- **Letterboxd**: Users press a green plus button to add a film. Workflow includes: watch date specification, first-time/rewatch toggle, 5-star rating with half-star increments, heart/like button, and full text review with blog-style formatting, spoiler tags, and external links. Films appear in a "diary" view on user profiles.
- **MyAnimeList**: Users track progress with 6 status options: Watching, Completed, On-Hold, Dropped, Plan to Watch, and All (aggregate view). Each entry allows episode progress tracking, 1-10 scoring system, and notes/tags. Lists can be customized with CSS.
- **Goodreads**: Default bookshelves (read, currently-reading, to-read) plus custom shelf creation. 5-star rating system. Reading progress tracked via page numbers or percentage.

### Common pattern
The core journaling workflow follows a consistent pattern across platforms:
1. Search/find content in database
2. Add to personal list with single action
3. Optionally add metadata (date, rating, review)
4. Content appears in chronological or status-organized view

### Key differences
| Feature | Letterboxd | MyAnimeList | Goodreads |
|---------|------------|-------------|-----------|
| Rating scale | 5 stars (0.5 increments) | 1-10 integer | 5 stars |
| Watch status | Watched/Watchlist | 6 status types | 3 default + custom |
| Date tracking | Per-view diary date | Start/end dates | Date added |
| Rewatch tracking | Explicit toggle | Episode count | None |
| Review length | Unlimited | Unlimited | Unlimited |

### Trade-offs
| Approach | Pro | Con |
|----------|-----|-----|
| 5-star (Letterboxd) | Familiar, easy to understand | Limited granularity |
| 1-10 (MAL) | More nuance for enthusiasts | Steeper learning curve |
| Status-heavy (MAL) | Precise tracking for long-form | Complexity for casual users |
| Status-light (Letterboxd) | Simple, low friction | Less granular state |

### Sources
- https://www.pcmag.com/reviews/letterboxd: PCMag review detailing Letterboxd workflow including green plus button, diary, ratings, and reviews
- https://en.wikipedia.org/wiki/MyAnimeList: Wikipedia article on MAL features including 1-10 scoring and status tracking
- https://en.wikipedia.org/wiki/Goodreads: Wikipedia article on Goodreads features including bookshelves and rating system

---

## Finding 2: Watch Status Workflows

### Products analyzed
- **MyAnimeList**: Industry standard with 6 distinct states: Watching, Completed, On-Hold, Dropped, Plan to Watch, All. Specifically designed for TV series and anime tracking where users watch episodes over time.
- **Letterboxd**: Binary approach (Watched/Watchlist) since films are typically consumed in single sessions. No "dropped" or "on-hold" states.
- **Goodreads**: Currently-Reading (for active progress), Read, To-Read. Similar to MAL but fewer intermediate states.

### Common pattern
For serialized content (TV shows, anime), the 6-state model (Watching/Completed/On-Hold/Dropped/Plan to Watch/All) is the industry standard. For single-session content (films, books), simpler 3-state models (current/read/to-read or watched/watchlist) dominate.

### For K-drama context
K-dramas fall between films and anime—they are serialized (typically 16 episodes) but consumed more like films (binged over days/weeks). This suggests a hybrid approach:
- **Plan to Watch** (added but not started)
- **Watching** (actively viewing)
- **Completed** (finished all episodes)
- **On-Hold** (paused mid-series)
- **Dropped** (abandoned before completion)

### Trade-offs
| States | Best for | Limitation |
|--------|----------|------------|
| 2 (Watched/Watchlist) | Films, casual users | No progress tracking |
| 3 (Current/Read/To-Read) | Books, moderate engagement | No "abandoned" state |
| 6 (Full MAL model) | TV/anime, power users | Complexity for newcomers |

### Sources
- https://en.wikipedia.org/wiki/MyAnimeList: MAL's 6-state status system
- https://en.wikipedia.org/wiki/Letterboxd: Letterboxd's binary watched/watchlist approach
- https://en.wikipedia.org/wiki/Goodreads: Goodreads 3-shelf system

---

## Finding 3: Short Review Character Limits

### Products analyzed
- **Letterboxd**: No character limit. Reviews support blog-style formatting (bold, italic, links), spoiler tags, and external links. Reviews can range from one-liners to full essays.
- **MyAnimeList**: No official character limit for reviews. Users can write extensive reviews.
- **Goodreads**: No character limit for reviews.
- **Twitter/X (comparison)**: 280 characters for "short form" content.
- **Instagram captions (comparison)**: 2,200 characters, though most users write 100-150 characters.
- **Yelp (comparison)**: No minimum, though quality filter favors reviews over 40 words.

### Common pattern
Entertainment cataloging platforms do NOT enforce character limits on reviews. This is a deliberate design choice:
- Allows depth for enthusiasts who want to write essays
- Doesn't alienate users who prefer quick reactions
- Community norms self-regulate length

### What platforms DO instead
Instead of hard limits, platforms use:
1. **Display truncation**: Long reviews show "read more" after initial lines
2. **Social curation**: Popular reviews surface regardless of length
3. **One-click reactions**: Heart/Like for users who don't want to write
4. **Quick rating**: 5-star or 1-10 scale for users who don't want to write text

### Recommendation for "short reviews"
If K-Journal wants to encourage completion without overwhelming:
- **DO NOT set hard character limit** (follow Letterboxd/MAL/Goodreads precedent)
- **Consider UI encouragement**: Placeholder text, optional "quick thought" field separate from full review
- **Use display truncation**: Show first ~150-300 characters in list views, expandable
- **Offer reactions**: Heart/Like option for users who don't want to write

### Sources
- https://www.pcmag.com/reviews/letterboxd: PCMag review noting "thorough text review with blog-style formatting options"
- https://en.wikipedia.org/wiki/Goodreads: Goodreads unlimited review length
- https://en.wikipedia.org/wiki/MyAnimeList: MAL's review system

---

## Finding 4: Social Discovery Without Follow Relationships

### Products analyzed
- **Spotify**: Wrapped year-end shareables, public playlists via link sharing, Blend collaborative playlists, public user profiles with top artists/tracks, and "Users also listen to" sections on artist pages.
- **Last.fm**: All profiles public by default, showing listening history, top artists (all-time/7-day/30-day), and "neighbors" (users with similar taste) algorithm.
- **Letterboxd**: Public profiles with favorites (4 films), recent activity, stats (films watched, hours), and the "Popular with Friends" section. Also: public lists, review sharing.

### Key pattern: Taste as identity
Platforms enable discovery through:
1. **Public profiles**: Visible favorites, stats, recent activity
2. **Shareable artifacts**: Wrapped images, lists, reviews
3. **Algorithmic "neighbors"**: Users with similar patterns
4. **Content-level signals**: "Users who liked this also liked"

### Spotify's approach (for music)
Spotify Wrapped is the flagship example:
- Year-end personalized data visualization
- Top artists, genres, minutes listened
- Shareable card format optimized for Instagram Stories
- Drives viral organic discovery without requiring follows

### Letterboxd's approach (for films)
- **4 Favorites**: Front-and-center on profile
- **Film pages**: Show friends' ratings prominently
- **Lists**: User-created, shareable via URL
- **Reviews**: Surface on film pages regardless of follow status

### For K-Journal
Key elements to implement for taste-based discovery:
1. **Public profile with favorites**: 4-5 favorite K-dramas displayed prominently
2. **Shareable taste cards**: Stats visualization (genres, years, ratings distribution)
3. **Content page social proof**: Show what similar users rated
4. **Public lists**: User-created collections shareable via link

### Trade-offs
| Approach | Pro | Con |
|----------|-----|-----|
| All profiles public | Maximum discovery | Privacy concerns for some users |
| Opt-in public profiles | Privacy-first | Reduces discovery potential |
| Default public, private option | Balanced | Requires clear settings |

### Sources
- https://www.last.fm/about: Last.fm profile and discovery features
- https://en.wikipedia.org/wiki/Letterboxd: Letterboxd social features and profiles
- https://newsroom.spotify.com/2025-wrapped/: Spotify Wrapped documentation

---

## Finding 5: Public Profile Pages for Taste Showcase

### Products analyzed
- **Letterboxd Profile**: 
  - 4 favorite films (prominent display)
  - Avatar and bio
  - Films watched count
  - Diary (recent activity)
  - Lists created
  - Reviews written
  - Followers/Following counts
  - Stats (Pro tier): hours watched, favorite directors, average rating
- **MyAnimeList Profile**:
  - Custom CSS styling
  - Anime/Manga statistics (completed, watching, dropped)
  - Mean score
  - Episode count
  - Favorites (anime, manga, characters, people)
  - Blog posts
  - Clubs membership
- **Spotify Profile**:
  - Public playlists
  - Recently played artists
  - Top artists (if enabled)
  - Followers/Following

### Common pattern
Profile pages consistently include:
1. **Identity markers**: Avatar, username, optional bio
2. **Favorites**: 4-5 featured items (Letterboxd's 4 films, MAL's favorites section)
3. **Activity feed**: Recent watches/reviews
4. **Statistics**: Count-based metrics (films watched, hours, ratings)
5. **Social signals**: Followers/following counts

### For K-Journal
Recommended profile elements:
- Avatar + username
- Bio (optional, ~160 chars)
- 4 favorite K-dramas (prominent)
- Stats: K-dramas watched, hours watched, mean rating
- Recent diary entries
- Lists created
- Reviews written

### Sources
- https://en.wikipedia.org/wiki/Letterboxd: Profile features and favorites
- https://en.wikipedia.org/wiki/MyAnimeList: MAL profile customization and statistics
- https://www.last.fm/about: Last.fm profile structure

---

## Finding 6: Content Request & Curation Workflows

### Products analyzed
- **TMDB (The Movie Database)**: Community-driven content addition. Users can add missing films/TV shows. Requirements:
  - Minimum: Original title + overview for films
  - Minimum: Title + overview + air date for TV
  - Content must meet qualifying criteria (theatrical release, festival screening, professional distribution, Netflix/streaming release)
  - Amateur content has strict requirements (festival qualification, national TV, or proper distribution)
  - Moderators review and may delete non-qualifying content
  - Adult content allowed but requires account setting toggle
- **Letterboxd**: Uses TMDB as data source. Does not manage content addition directly.
- **MyAnimeList**: User submissions reviewed by moderators. Database managed by staff.

### TMDB content submission workflow
1. User searches for existing entry (to avoid duplicates)
2. User clicks "Add New Movie" or "Add New TV Show"
3. User fills required fields (title, overview, air date)
4. User adds optional metadata (cast, crew, images, release dates)
5. Entry is created immediately
6. Moderators may remove entries that don't meet guidelines
7. User receives notification if entry is deleted

### Content NOT allowed on TMDB
- Video games
- Music videos (exceptions for festival-screened extended videos)
- YouTube/viral videos (exceptions for YouTube Originals)
- Fan films, fan edits, fan dubs
- Amateur content (exceptions for qualified festival screenings)
- Alternative versions (director's cuts, 3D versions)
- Live sports events (exceptions for pay-per-view)
- Audio-only content (audiobooks, podcasts)

### Admin workflow for content review
1. New entries appear in moderation queue (or are reviewed post-hoc)
2. Moderators verify against guidelines
3. Entries not meeting criteria are deleted
4. User receives private message explaining deletion
5. User can contest with documentation

### For K-Journal content requests
Recommended approach:
1. **Form submission**: Title, Korean title (if known), year, network/streaming service, reason for request
2. **Verification queue**: Admin reviews for legitimacy
3. **Data source**: Consider using TMDB or building Korean content database
4. **User communication**: Notification on approval/rejection
5. **Priority tiers**: Popular requests prioritized

### Sources
- https://www.themoviedb.org/bible/new_content: TMDB content guidelines and submission workflow
- https://en.wikipedia.org/wiki/Letterboxd: Letterboxd's use of TMDB

---

## Finding 7: MVP Feature Set for Journaling Platforms

### Products analyzed
- **Letterboxd MVP** (launched 2011): 
  - Film logging
  - Ratings (5-star)
  - Reviews
  - Watchlist
  - Public profile
  - Following/followers
  - Lists
- **Goodreads MVP** (launched 2007):
  - Book logging
  - Ratings (5-star)
  - Reviews
  - To-read shelf
  - Currently-reading shelf
  - Public profile
  - Friends/following

### Core MVP features (consensus across platforms)
| Feature | Priority | Rationale |
|---------|----------|-----------|
| Content logging | Must-have | Core value proposition |
| Rating | Must-have | Enables taste expression |
| Watchlist/To-Read | Must-have | Future intent capture |
| Profile | Must-have | Identity and social foundation |
| Reviews (optional) | Should-have | Depth for engaged users |
| Lists | Should-have | Curation and organization |
| Search | Must-have | Content discovery |
| Social following | Should-have | Network effects |

### Phase 2 features (post-MVP)
- Stats/analytics
- Recommendation engine
- Challenges (reading/watching goals)
- Groups/communities
- Events/calendar
- API/integrations
- Premium tier

### Letterboxd growth timeline
- 2011: Launched with core features
- 2013: Opened to public (from beta)
- 2019: JustWatch partnership for streaming availability
- 2022: 1 billion films logged
- 2024: 17 million users, 96.4 million reviews written

### Key insight
The MVP must nail the **core loop**: Find → Log → Rate → Share. Everything else is enhancement.

### Sources
- https://en.wikipedia.org/wiki/Letterboxd: Launch timeline and feature history
- https://en.wikipedia.org/wiki/Goodreads: Goodreads launch and early features
- https://www.pcmag.com/reviews/letterboxd: PCMag review of core features

---

## Finding 8: Engagement Patterns & Rating Distributions

### Rating distribution patterns
Research on entertainment ratings shows consistent patterns:

**Skewed positive distribution**
- Letterboxd ratings skew positive: most films average 3-4 stars
- IMDb ratings skew toward 6-8 out of 10 for popular films
- MAL ratings show strong clustering at 7-8 for anime

**Factors affecting distribution**
- Selection bias: Users rate what they choose to watch
- Genre effects: Drama/art-house rated higher than action/horror
- Recency bias: New releases get more initial ratings
- Cultural factors: Regional preferences vary

### Engagement drivers
Key factors that drive repeat engagement:
1. **Progress tracking**: Completing series, episode counts
2. **Social proof**: Seeing friends' activity
3. **Discovery**: Finding new content through recommendations
4. **Goals/challenges**: Reading/watching targets
5. **End-of-year recaps**: Wrapped-style summaries
6. **Contribution**: Writing reviews, creating lists

### Letterboxd engagement metrics (2024)
- 96.4 million reviews written
- 701 million films marked watched
- 6.8 million lists created
- 17 million users

### Recommendations for K-Journal
- Implement **annual recap** (like Wrapped) as primary engagement hook
- Add **watching goals** (e.g., "Watch 20 K-dramas this year")
- Show **social activity feed** to encourage return visits
- Enable **quick reactions** (heart) alongside ratings for lower-friction engagement

### Sources
- https://en.wikipedia.org/wiki/Letterboxd: 2024 usage statistics
- https://en.wikipedia.org/wiki/MyAnimeList: MAL scoring formula and distribution
- https://deadline.com/2025/01/letterboxd-indie-films-members-surge-in-2024-favorite-films-1236251217/: 2024 Letterboxd statistics

═══════════════════════════════════════════════════════════════
COMPARISON MATRIX
═══════════════════════════════════════════════════════════════

| Feature | Letterboxd | MyAnimeList | Goodreads | Spotify |
|---------|------------|-------------|-----------|---------|
| Rating scale | 5 stars (0.5) | 1-10 | 5 stars | No rating |
| Watch status | 2 (Watched/Watchlist) | 6 states | 3 shelves | N/A |
| Review limit | Unlimited | Unlimited | Unlimited | N/A |
| Favorites on profile | 4 films | Multiple categories | None | 5 artists |
| Public profiles | Yes (default) | Yes (default) | Yes (default) | Yes (default) |
| Lists | Yes | Yes | Yes | Playlists |
| Content submission | Via TMDB | User submission | User submission | N/A |
| Year-end recap | No (stats only) | No | "My Year in Books" | Wrapped |
| Challenges | No | No | Reading Challenge | No |
| Mobile app | Yes | Yes | Yes | Yes |

═══════════════════════════════════════════════════════════════
ACTIONABLE INSIGHTS FOR PA
═══════════════════════════════════════════════════════════════

1. **For stakeholder challenge**: "Watch status workflows for K-dramas should include 'On-Hold' and 'Dropped' states."
   Source: MyAnimeList's 6-state model is the industry standard for serialized content. K-dramas are serialized (16 episodes typical), so the binary Letterboxd model may not suffice.
   Products: MyAnimeList, Goodreads

2. **For PRD requirement**: "Implement 5-star rating with half-star increments as the default rating system."
   Source: Letterboxd and Goodreads both use 5-star systems. This is the most familiar scale for general audiences while providing sufficient granularity.
   Products: Letterboxd, Goodreads

3. **For PRD requirement**: "Do not enforce character limits on reviews; use display truncation instead."
   Source: Letterboxd, MAL, and Goodreads all allow unlimited review length. This encourages depth while display truncation keeps list views clean.
   Products: Letterboxd, MyAnimeList, Goodreads

4. **Non-standard aspect**: "K-Journal's focus on K-content specifically (vs. all films/anime) is a niche positioning."
   Implication: Smaller total addressable market but deeper engagement from target audience. Content database will be smaller but more focused. Consider Korean drama-specific metadata (network, airing status, episode count).

5. **For MVP scope**: "Core loop must be: Search → Log → Rate → Share. Everything else is Phase 2."
   Source: Both Letterboxd and Goodreads launched with minimal feature sets focused on the core journaling loop.
   Products: Letterboxd, Goodreads

6. **For social discovery**: "Implement public profiles with 4-5 favorites as primary taste signal."
   Source: Letterboxd's "4 favorites" is iconic and immediately communicates user taste. This is more scannable than rating distributions.
   Products: Letterboxd

7. **For engagement**: "Annual recap (like Wrapped) should be a Phase 2 priority, not MVP."
   Source: Spotify Wrapped drives massive engagement but requires a year of data. Launch MVP, collect data, then implement recap feature.
   Products: Spotify

═══════════════════════════════════════════════════════════════
QUESTIONS FOR PA (if any)
═══════════════════════════════════════════════════════════════

1. **Content database source**: Will K-Journal build its own K-drama database or integrate with TMDB (which Letterboxd uses)? TMDB has Korean content but may not be comprehensive for K-dramas specifically.

2. **Episode-level tracking**: Should K-Journal track progress at the episode level (like MAL) or just series-level status (like Letterboxd with films)? This affects data model complexity significantly.

3. **Korean vs. international titles**: Should the primary title be Korean ( Hangul), romanized, or English? MAL uses Japanese titles as primary for anime; Letterboxd uses original language.

4. **Review moderation**: Should reviews be pre-moderated or post-moderated? Goodreads has faced criticism for lax moderation enabling review bombing. K-dramas may have passionate fanbases that could lead to similar issues.

