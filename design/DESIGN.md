# DESIGN.md — GTA Wiki

Source of truth for the wiki and community hub screens in `gta-wiki-hub.figcraft`. Read this before changing tokens or adding a page; it wins over generic defaults.

## 1. Product truth

- **Who:** GTA players on desktop and phone. Two groups: people looking something up (a character, a vehicle, a place, whether something is confirmed), and regulars who edit pages, plot map markers, vote on theories and post in the forum.
- **What it is:** a fan-run wiki and forum for the whole Grand Theft Auto series. GTA VI is featured now to catch launch traffic; it is not the scope of the site.
- **What it does for them, in one sentence:** tells you what is known about any GTA game, where each fact came from, and lets the community fix it.
- **Constraints:** fan project, never presented as Rockstar (disclaimer in every footer, own wordmark, no official logo as branding). Dark theme. WCAG AA. IAB ad sizes.
- **Success per page:** home: you know in 3 seconds it's a wiki for the whole series, and that GTA VI is out on 19 Nov 2026. Article: the answer is in the lead paragraph or the infobox. Map: find a place in under 10 seconds. History: decide keep or revert without leaving the page.
- **Real material:** official key art, character portraits and region photos in `public/media/` (`bg/`, `characters/`, `world/`, `editions/`).

## 2. Reading and page intent

Reading: a GTA series fan wiki and forum for players, with GTA VI featured during launch, mostly read/operate pages with one convincing home page, in a documentary language led by official photography and signage-style type, designed in FigCraft.

| Page | Intent | Variation | Motion | Density |
|---|---|---|---|---|
| Home | convince | medium | low | medium |
| All games, game hub | read | low | low | medium |
| Article, search, news | read | low | low | medium |
| Map, compare, build creator, history | operate | low | low | high |
| Forum, thread, profile | operate | low | low | medium-high |
| Sign in, create account, onboarding | convince (low stakes) | low | low | low |

## 3. Visual direction and project bans

- Photography leads. Text sits on solid ground beside an image, not on a gradient laid over it.
- Signage-style condensed type for titles, plain reading type for text, mono only for data.
- Lists, tables and rules before cards. A card only where content is a self-contained object (infobox, review panel, best match).
- **Banned here (on top of the skill catalogue):** coloured pill badges for status or tags; one colour per tag or category; glow or shadow on buttons; any glass or blur on panels; uppercase labels except table column heads and map labels; the official GTA logo used as our branding.
- **Allowed exceptions:** blur on spoiler images (it hides content, it isn't decoration); map labels in spaced uppercase (map convention); Discord/Google/Apple brand colours on their sign-in buttons.

## 4. Colour

```design-tokens
fonts: Barlow Condensed, Barlow, Archivo, JetBrains Mono
colors: #0B0E14, #131823, #1C2230, #262D3B, #646D7E, #F3F4F6, #D7DAE0, #9CA3AF, #858C99, #FF2A75, #00E5FF, #FFB800, #C9CED8, #34D399, #F87171
radii: 2px, 4px, 6px, 8px
```

| Token | Hex | Function | Contrast on bg |
|---|---|---|---|
| `bg` | `#0B0E14` | page | — |
| `surface` | `#131823` | infobox, panels, inputs on panels | — |
| `raised` | `#1C2230` | selected row, neutral tag | — |
| `line` | `#262D3B` | dividers (decorative) | 1.4:1 |
| `control` | `#646D7E` | input, checkbox and radio outlines | 3.7:1 (UI ≥ 3) |
| `text` | `#F3F4F6` | titles, interface | 17.6:1 |
| `body` | `#D7DAE0` | reading text | 13.8:1 |
| `muted` | `#9CA3AF` | meta, captions | 7.6:1 |
| `dim` | `#858C99` | placeholders, timestamps, footer legal | 5.7:1 |
| `accent` | `#FF2A75` | primary action, links, current state. Nothing else | 5.4:1 |
| `official` / `leak` / `theory` | `#00E5FF` / `#FFB800` / `#C9CED8` | verification status only | ≥ 11:1 |
| `added` / `removed` | `#34D399` / `#F87171` | diffs and validation only | ≥ 7:1 |

The primary button is `#0B0E14` text on `#FF2A75` (5.4:1). White on pink fails AA at 15px.

## 5. Typography

- Display: the font Bahnschrift at 600 weight, width 75 (condensed), line-height 105%. Sizes 72 / 56 / 41 / 33 / 26.
- Interface: the font Bahnschrift at width 100, 400 and 600. 12–17px.
- Reading: the font Archivo, 15–19px, 160%. Article column 660px (≈ 70 characters).
- Data: the font JetBrains Mono, for the countdown, specs, counts, timestamps and diffs only.
- Scale ratio 1.25: 12 · 13 · 15 · 17 · 21 · 26 · 33 · 41 · 56 · 72.
- The mockups use Bahnschrift, which ships with Windows only. The web build uses the fonts Barlow Condensed (display) and Barlow (interface).

## 6. Space and grid

- 4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 72 · 96.
- Desktop: 1440 frame, 12 columns, 80 margin, 32 gutter. Main splits 8/4 (home, news), 3-column reading layout (TOC 180 · article 660 · infobox 340).
- Mobile: 390 frame, 4 columns, 16 margin, 16 gutter. Section padding about 0.6× desktop.
- Layout grids exist on every frame but are hidden by default.

## 7. Components

- Radius by role: 2 images and tags, 4 controls and buttons, 6 panels, 8 modals. Square avatars (4). No pills.
- Elevation: none on the page. One shadow, on modals and the map marker card.
- Verification marker: 8px square (outlined for theory) + status word + source, inline in the meta line.
- Votes: up arrow, mono count, down arrow. The user's own vote takes the accent.
- Ads: dashed 1px placeholder labelled with size. Leaderboard above the header, rectangles in the right rail, native rows inside feeds marked Sponsored.

## 8. Motion

Not specified in the mockups. When built: state changes only (hover on interactive elements, focus, disclosure open/close), 150–200ms ease-out, `prefers-reduced-motion` respected. The countdown ticks; nothing else moves on its own.

## 9. Images and content

- Images: official Rockstar media from `public/media/`, credited in captions. Spoiler images are blurred until revealed.
- Voice: plain, specific, sentence case. Facts carry a source. No benefit slogans.
- Sample data: vote counts, usernames, comment counts, vehicle specs and mod prices are placeholders. Facts marked Official are real: release 19 Nov 2026, Trailer 1 (5 Dec 2023), Trailer 2 (6 May 2025), character and region names.

## 10. Do / don't

- Do put the source next to every claim. Do lead with a real image. Do use a table when rows share columns.
- Don't add a label above a title, a coloured strip on a card, a gradient on text, or a pulsing dot. Don't colour tags by category.

## 11. Decision log

### 2026-11-04 — v2 replaces the first draft
- Context: v1 used gradient titles, glass cards, neon glows, pill badges, icon tiles and uppercase eyebrows. It read as AI-generated.
- Decision: rebuilt every screen against the ui-humanizer catalogue with the tokens above.
- Why: each of those was the average choice, not one taken from this product.
- Don't: bring back glass, glows or pills for "gaming feel". The photography carries the mood.
- Pages: all. Refs: `gta-wiki-hub-v1.figcraft` (old), `gta-wiki-hub.figcraft` (current).

### 2026-11-04 — Verification as inline marker
- Decision: status is a square + word + source in the meta line.
- Why: status is information to read next to the source, not a decoration to scan for.
- Don't: turn it into a coloured pill.
- Pages: all.

### 2026-11-04 — Contrast fixes after QA
- Decision: `dim` from `#6B7280` (4.0:1) to `#858C99` (5.7:1); control outlines from `#323A4A`/`#4B5363` (1.7–2.5:1) to `#646D7E` (3.7:1).
- Why: small meta text failed AA 4.5:1; form controls failed the 3:1 boundary rule.
- Pages: all.

### 2026-11-04 — Layout grids hidden
- Decision: grids stay on frames with `visible: false`.
- Why: the visible 4-column overlay read as stray vertical bars when reviewing the design.

### 2026-11-04 — The site is GTA Wiki, for the whole series
- Context: the screens read as a GTA VI wiki called Leonida Wiki. The owner's brief is a franchise wiki that focuses on GTA VI only for the launch.
- Decision: renamed to GTA Wiki. Added an "Explore by game" section on the home, an All games index, a per-game hub and a mobile menu. Characters and confirmed facts on the home are labelled GTA VI.
- Why: GTA VI is a moment, the series is the product. After launch the featured slot changes and nothing else has to.
- Don't: name or structure anything around GTA VI alone. Game-specific pages always show their game in the breadcrumb.
- Pages: all.

### 2026-11-04 — No game switcher: one continuous wiki
- Context: a header switcher and a series bar treated the site as one app per game. The owner rejected that: the wiki is a single site with organic navigation between games.
- Decision: removed both. Global nav is fixed (Explore Wiki, Database, Forums, News, Map). Games are reached through the home, All games and each game hub. Context comes from breadcrumbs (Home > Games > GTA VI > Characters > Lucia) and subtle game tags. Search covers the whole wiki and every suggestion names its game.
- Why: a wiki is linked pages, not modes. Nothing in the interface should change depending on the game being read.
- Don't: add a game selector, toggle or per-game mode anywhere, desktop or mobile.
- Pages: all.

## 12. References

None chosen yet. Phase 3 of the ui-humanizer process (user-picked references, 2–3 directions) was skipped to deliver all screens in one pass. Add boards or sites here and revisit section 3 against them.
