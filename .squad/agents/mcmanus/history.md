# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Recreated `_layouts/post.html` and fixed archives hash routing

`_layouts/post.html` was deleted and recreated from scratch. It uses `layout: base`, renders a header section with post title/subtitle/date meta, then the post body and thumbnail, followed by a tag list and prev/next pagination. Tag slugs are normalized inline (e.g. "Azure Pipelines" → `azure-devops`, "GitHub Copilot" → `ai`) to match the slug keys used by the archives filter buttons — this mapping must stay in sync with `archives.md` `data-filter` values. The archives JS was also extended with `activateFromHash()` so that landing on `/archives#ai` (or any tag slug) automatically clicks the matching filter button on page load, and responds to `hashchange` for in-page navigation.

### 2026-03-04 — Archives page visual refresh (sticky filter bar, per-tag accents, empty state)

Replaced the entire `/* ===== ARCHIVES PAGE ===== */` CSS block in `assets/css/blog.css`. Key patterns introduced: (1) `.archive-filters` now uses `position: sticky; top: 0` with `backdrop-filter: blur(10px)` so the filter bar floats over content while scrolling. (2) Per-tag accent CSS custom properties (`--tag-azure-devops`, `--tag-cicd`, etc.) were added to `:root` and are used for `.tag-filter[data-filter="..."].active` rules and `.archive-post-item[data-tags~="..."]` hover border/pill tints — single source of truth for all tag colors. (3) Year headings got a left accent bar via `::before` pseudo-element and dramatic uppercase treatment. (4) Post rows use `border-left: 3px solid transparent` transitioning to the tag accent on hover with a subtle `padding-left` shift for depth. (5) An `.archive-empty-state` element (`#archive-empty`) was added to `archives.md` after the Liquid `{% endfor %}` and toggled via `.classList.toggle('visible', visible === 0)` in the filter JS. The JS was also refactored into an `applyFilter(filter)` function called by both click handlers and `activateFromHash`, making hash routing cleaner. Note: `cicd`, `infra-as-code`, and `other` active button text uses dark (`#121212`) text because their accent colors are light/yellow.

### 2026-03-05 — Template cleanup: nav icons removed, hero panel inline styles extracted

`_includes/nav.html`: Removed `<i class="fas fa-folder-open"></i>` from every nav link anchor in both `nav-links` and `drawer-links` lists. The house icon on the brand link was intentionally preserved.

`_layouts/home.html`: Extracted four inline style blocks from the Pulse hero panel into CSS classes. `<h2>` got `class="pulse-heading"`, the stats box div got `class="top-pages-box"`, the "Top Page Views" `<p>` got `class="top-pages-label"`, and the `<a>` anchors inside the top pages list got `class="top-page-link"`.

`assets/css/blog.css`: Appended a `/* ===== HERO PANEL EXTRACTED CLASSES ===== */` block with `.pulse-heading`, `.top-pages-box`, `.top-pages-label`, `.top-page-link`, and `.top-page-link:hover`. Color values were converted from hardcoded hex to CSS custom properties (`var(--text-col)`, `var(--mid-col)`, `var(--link-col)`) so the classes are theme-aware by default.

---

### 2026-03-05 — Unused code purge across blog.css, _config.yml, _layouts/post.html

Removed all confirmed-unused code identified in Keaton's audit (`keaton-unused-code-audit.md`). Approximate savings: ~338 lines removed from `assets/css/blog.css` (1732 → 1394 lines), 2 lines from `_config.yml`, 2 lines from `_layouts/post.html`.

**CSS removed (by target letter):**
- **A** — `.anchor-link` block (5 lines) — legacy utility, never referenced in any template
- **B** — First syntax highlight token block (~100 lines: `.highlight .c` through `.language-json .highlight .attr`) — fully superseded by the later `!important`-qualified Unified Syntax Highlight Theme block
- **C** — `.read-more` and `.read-more i` (8 lines) — replaced by `.read-more-chip` in home layout
- **D** — `.view-all-posts` and `.view-all-posts:hover` (18 lines) — class never applied in any template
- **E** — `.navbar-brand, .site-title` (3 lines) — nav uses `.brand` class; Bootstrap selectors never present
- **F** — `.dropdown-menu`, `.dropdown-item`, `.dropdown-item:hover/focus` (14 lines) — no dropdown menus in any template
- **G** — `.navbar-toggler`, `:hover`, `:focus`, `.navbar-toggler-icon` (16 lines) — nav uses `.nav-toggle`, not Bootstrap toggler
- **H** — `.fa-stack-2x { display: none !important }` (3 lines) — no matching elements in any template
- **I** — `.copyright` and `footer .copyright` (5 lines) — footer uses `.footer-copy`, not `.copyright`
- **J** — `.rss-subscribe`, `footer .rss-subscribe`, `.rss-subscribe:hover` (9 lines) — footer uses `.social-chips`
- **K** — `.social-list`, `.footer-links`, `.social-icons` full selector blocks (21 lines) — legacy Bootstrap-era classes, no matching elements
- **L** — `.social-icons i,` and `.social-icons a:hover,` prefixes removed from comma-separated selector lists (2 lines) — kept the live `footer .fa` etc. selectors intact
- **M** — `@media screen and (-ms-high-contrast)` empty block (4 lines) — IE-only, zero declarations
- **N** — `body.modern .post-header` and `body.modern .page-header` selectors removed from combined rules (5 lines), keeping `body.modern .header-section` intact as it IS used in `_layouts/post.html`
- **O** — Scroll animation classes: `.scroll-fade-in`, `.scroll-slide-left`, `.scroll-slide-right`, `.scroll-scale-in` (all with `.visible` variants) and `.post-card.scroll-animate` / `.visible` (57 lines) — no JS Intersection Observer implementation, never applied
- **P** — `@keyframes shimmer`, `.loading` block, and `.loading { animation: none }` override inside `@media (prefers-reduced-motion)` (19 lines) — class never applied; kept the rest of the reduced-motion block untouched

**Config removed:**
- **Q** — `social-share: false` from posts defaults — `page.social-share` never referenced in any template
- **R** — `rss-description: "..."` top-level variable — `site.rss-description` never referenced; `jekyll-feed` uses `site.description`

**Liquid removed:**
- **S** — `{% elsif tag == "CICD" %}` branch in `_layouts/post.html` tag slug normalization — redundant because `"CICD" | slugify` produces `"cicd"` identically via the `else` fallback

Key lesson: when removing selectors from comma-separated lists, always read the full selector before acting — several blocks mixed live selectors (`footer .fa`, `footer .fab`) with dead ones (`.social-icons`), and only the dead portions were removed.

### 2026-03-11 — Removed remote_theme dependency, inlined everything locally

Removed `remote_theme: marcusfelling/blog-theme` from `_config.yml`. All layouts, includes, and assets the blog actually uses were already local — the remote theme was a no-op fetch at build time. Created `_layouts/page.html` (extends `base`, Bootstrap grid, title/subtitle header, content body) to satisfy the `layout: "page"` default in `_config.yml` for non-post pages. Removed `gem "minima"` from `Gemfile` — never used, leftover from Jekyll scaffold. The `github-pages` gem remains (still deploying via GitHub Pages). Build verified clean: no missing layout/include warnings.

---

### 2026-03-04 — Code block "empty blocks" fix

Jekyll wraps fenced code blocks in `div.highlight > div.highlight > pre.highlight > code`. The `div.highlight` carries `background-color`, so the `pre`'s default `margin: 1em 0` punches visible coloured gaps above and below the code. Fix: remove `padding` from `.highlight`, add `overflow: hidden` (so `border-radius` clips children correctly), and add `.highlight > pre { margin: 0; }` to collapse those margins. This pattern applies any time a background-coloured wrapper contains a block element with vertical margin.

### 2026-03-06 — Reused social links via Liquid capture for desktop nav and mobile drawer

Moved the site social links out of `_includes/footer.html` and into `_includes/nav.html`, but kept the markup DRY by capturing the anchor list once with `{% capture %}` and reusing it in both the desktop navbar and the mobile drawer. Styling stays in `assets/css/blog.css` using more specific `.navbar-modern .nav-social` and `.mobile-drawer .nav-social` selectors so the nav version can look richer without disturbing the generic `.social-chips` rules already injected from `_includes/head.html`.

### 2026-03-06 — Use bracket-key Liquid access for dashed config keys in nav includes

`_config.yml` stores navigation and social settings under dashed keys like `navbar-links` and `social-network-links`. In `_includes/nav.html`, those values must be read via bracket access (`site['navbar-links']`, `social_links['github']`, etc.) after assigning the parent hashes first; dashed dot access can evaluate incorrectly in Liquid and silently render empty nav lists or empty social chip groups.

### 2026-03-13 — Homepage polish should preserve copy/IA and adjust intensity at the head include source

The homepage’s hero, Pulse panel, recent-card, and archive CTA styling is still primarily controlled by the inline style block in `_includes/head.html`, not by `_layouts/home.html`. For restrained homepage passes, keep the text and section order frozen in `_layouts/home.html` and tune intensity at the source: remove gradient headline treatments, reduce glass/glow strength, and use smaller hover/focus deltas instead of stacking override CSS in `assets/css/blog.css`.
### 2026-04-07 — Added estimated reading time to blog posts

In `_layouts/post.html`: calculated word count via `content | number_of_words`, divided by 200, clamped to a 1-minute floor. Displayed inline after the "Posted on" date, separated by a middle dot (`·`), inside a `.reading-time` span for testability. Added a minimal `.reading-time` rule in `assets/css/blog.css` using `var(--mid-col)` to keep it subtle and consistent with the muted post-meta aesthetic.

### 2026-04-07 — Built command palette (⌘K / Ctrl+K) for quick post navigation

Created `_includes/command-palette.html` (dialog markup with search input, results listbox, ⌘K kbd hint), `assets/js/command-palette.js` (vanilla JS — keyboard shortcut listener, debounced fuzzy search against `/search-data.json`, keyboard nav ↑/↓/Enter, focus trap, backdrop click to close, highlight matching text, recent-posts default view), and appended `/* 14. COMMAND PALETTE */` CSS block to `assets/css/blog.css` (~200 lines — backdrop blur overlay, centered modal with scale animation, scrollable results with accent-col left border on active, tag pills, empty state, responsive mobile layout). Wired into `_layouts/base.html` (include before footer-scripts, script after search.js). Added `tags` field to `search-data.json`. Added a ⌘K hint pill button in `_includes/nav.html` next to the social chips. The JS shares search data with `search.js` via `window.__searchData` when possible, otherwise fetches independently.

**Coordinator fixes applied post-implementation:**
- Test selector mismatches resolved (dialog role, class naming)
- Async data loading race condition fixed (re-render results after data loads)
- Nav hint Ctrl/⌘ platform detection fixed for cross-platform test compatibility
- 13 Playwright tests in `tests/command-palette.spec.ts` all passing