# Decisions

Merged decision log. Each entry is a summarized record from an agent inbox file, deduplicated.  
Entries are ordered chronologically (newest at top within same date).

---

## 2026-03-05 — Unused Code Removal

### CSS / Template / Config Dead Code Removed
**By:** McManus (Frontend Dev) — based on Keaton audit  
**Files:** `assets/css/blog.css`, `_config.yml`, `_layouts/post.html`

~342 lines of dead code removed across three files.

**`assets/css/blog.css` (~338 lines removed across 16 targets):**
- `.anchor-link` (5 lines) — never applied in any template
- First syntax highlight token block without `!important` (~100 lines) — fully overridden by the Unified Syntax Highlight Theme `!important` block; never takes effect
- `.read-more` and `.read-more i` (8 lines) — home layout uses `.read-more-chip` exclusively
- `.view-all-posts` and `.view-all-posts:hover` (~18 lines) — CTA uses `.read-more-chip`; also caught as oversight post McManus pass and removed by Coordinator
- `.navbar-brand, .site-title` (3 lines) — nav uses `.brand`
- `.dropdown-menu`, `.dropdown-item` variants (14 lines) — nav uses mobile drawer, no dropdowns
- `.navbar-toggler` variants (16 lines) — nav uses `.nav-toggle`, no Bootstrap toggler elements
- `.fa-stack-2x { display: none !important }` (3 lines) — no matching element anywhere
- `.copyright` and `footer .copyright` (5 lines) — footer uses `.footer-copy`
- `.rss-subscribe` variants (9 lines) — footer uses `.social-chips`
- `.social-list`, `.footer-links`, `.social-icons` full blocks (21 lines) — legacy Bootstrap-era names, no matches
- `.social-icons i,` and `.social-icons a:hover,` prefixes removed from comma lists (live `footer .fa` selectors preserved)
- `@media screen and (-ms-high-contrast)` empty block (4 lines) — IE-only, zero declarations
- `body.modern .post-header` and `body.modern .page-header` (5 lines) — templates use `header-section`; `body.modern .header-section` preserved
- Scroll animation classes: `.scroll-fade-in`, `.scroll-slide-left`, `.scroll-slide-right`, `.scroll-scale-in` and `.visible` variants, `.post-card.scroll-animate` (57 lines) — no template assigns these, no JS adds them
- `@keyframes shimmer`, `.loading` block, `.loading` inside `@media (prefers-reduced-motion)` (19 lines) — no element receives `class="loading"`

**`_config.yml` (2 lines):**
- `social-share: false` — `page.social-share` never referenced in any template
- `rss-description: "..."` — `site.rss-description` never referenced; `jekyll-feed` uses `site.description`

**`_layouts/post.html` (2 lines):**
- `{% elsif tag == "CICD" %}` branch removed — `else` fallback's `tag | slugify` produces identical `"cicd"` result

**Risk:** Low. All removals confirmed against template/include/layout searches. Mixed comma-selector groups handled precisely — dead selectors removed, live selectors preserved.

**Deferred:** `window.__searchDataReady` in `assets/js/search.js` — written but never read in-codebase. May be external diagnostic hook. Left intact.

---

### Unused Code Audit
**By:** Keaton (Lead)  
**Date:** 2026-03-05  
**Output:** Comprehensive audit of `assets/css/blog.css`, `_config.yml`, `_layouts/post.html`, `assets/js/search.js`, all layouts, includes, and pages.

Key findings that drove the removal above. Audit methodology: grep all templates, layouts, includes, pages for each selector/variable before marking as unused. See orchestration log entry for full detail.

---

### Verification — Build and Tests Pass
**By:** Hockney (Tester)  
**Date:** 2026-03-05

- Jekyll build: **PASS** (19.25s, no errors)
- Built CSS: 36,087 bytes; all active selectors confirmed present; all removed selectors confirmed absent
- Tag rendering: intact after redundant Liquid branch removal
- Playwright: **18/19 pass** — 1 failure (`landing.spec.ts:3:5` RSS link) is pre-existing; `_config-dev.yml` missing `social-network-links.rss: true`

**Recommendation:** Add `social-network-links.rss: true` to `_config-dev.yml` to align dev and prod config for testing.

---

## 2026-03-05 — CSS Redesign: Typography, Palette, Component Refresh

**By:** Fenster (Design/UX), requested by Marcus Felling  
**File:** `assets/css/blog.css`, `_layouts/base.html`

Full visual redesign. Key decisions:

- **Typography:** Inter (body + headings) + JetBrains Mono (code). Replaces Lora + Open Sans. One Google Fonts request.
- **CSS variables:** `--body-font`, `--header-font`, `--mono-font` added. `html, body { font-size: 17px; line-height: 1.75; }`.
- **Accent color:** `#f97316` (amber-orange). Replaces `#008aff`. Orange on dark is distinctive in the DevOps space.
- **Palette:** Three-level depth — page `#0d1117`, card surface `#161b22`, card inset `#1c2128`. Full variable update across all `--*-col` vars.
- **Cards:** Border 1px/12px radius. Hover `translateY(-2px)` + left border accent transition.
- **H1:** `clamp()` size, weight 800, `letter-spacing: -0.5px`, bottom border in `--accent-col`. No gradient/shadow.
- **Code blocks:** `.highlight::before` chrome bar (`"● ● ●"`). `.highlight > pre` transparent.

**Rules going forward:**
1. Accent is orange (`#f97316` / `#fb923c` hover). No second accent without design review.
2. New components use `--page-col`, `--card-bg`, or `--card-image-placeholder`. No new hardcoded dark hex.
3. Grep hardcoded color values whenever a palette variable changes.
4. Unified Syntax Highlight Theme block owns token colors only. Structural code-block rules go in main sections.
5. Inter is the sole typeface. No serif reintroduction without full typography review.

---

## 2026-03-05 — CSS Variables Over Hardcoded Colors in Extracted Classes

**By:** McManus (Frontend Dev)

When extracting inline styles from `_layouts/home.html` into `blog.css`, color values were converted to CSS custom properties (`var(--text-col)`, `var(--mid-col)`, `var(--link-col)`) rather than lifting hardcoded hex values.

Classes affected: `.pulse-heading`, `.top-pages-label`, `.top-page-link`.

**Rule:** Extracted classes must use CSS variables. If intentional deviation from global palette is required, override at component scope.

---

## 2026-03-05 — Bootstrap 4.4.1 Retained (Phase 2 Removal Candidate)

**By:** Keaton (Lead)

Bootstrap 4.4.1 (CSS and JS) kept for this redesign iteration. Rationale:
- Bootstrap grid (`col-xl-8 offset-xl-2`, etc.) is load-bearing in `post.html` — removing requires a template rewrite not in scope.
- `data-toggle="tooltip"` on pagination links activates Bootstrap JS + jQuery + Popper chain.

**Phase 2 quick-win:** Drop pagination tooltips (swap to native `title` attributes or CSS-only) → cut jQuery slim (87KB), Popper.js (21KB), Bootstrap JS (60KB). Three CDN requests saved. Flag for McManus.

---

## 2026-03-04 — Archives Page Visual Refresh

**By:** McManus (Frontend Dev), requested by Marcus Felling  
**Files:** `assets/css/blog.css`, `archives.md`

- 11 per-tag accent CSS variables added to `:root` (`--tag-azure-devops`, `--tag-cicd`, etc.)
- Archives CSS section replaced: sticky filter bar with `backdrop-filter: blur(10px)`, per-tag active states, dramatic year headings with `::before` accent bar, row hover left-border accent, colored tag pills, empty-state element.
- `archives.md`: empty-state `<p>` element added; filter JS refactored with extracted `applyFilter()` function, fade transition, `.visible` toggle on empty state.

**Design decisions:**
- Sticky filter bar: keeps tags accessible while scrolling.
- `cicd`/`infra-as-code`/`other` use dark text on active (light accent colors).
- `border-left` already allocated — only color changes on hover (no layout shift).
- `applyFilter` extracted so hash routing and click handler share same logic.

---

## 2026-03-04 — Archives Spec: Selector Strategy for JS-Filtered Pages

**By:** Hockney (Tester)

`archives.spec.ts` rewritten to match current JS-filter UI. Old tests targeted non-existent h2 sections and tag-cloud div.

**Patterns established:**
1. Use `:visible` inside `.locator()` for filtered-item checks (JS toggles `display: none`, items remain in DOM).
2. Each test navigates independently — no shared filter state between tests.
3. Hash-navigation tests use `page.goto('/archives#ai')` directly — exercises JS hash-read path on `DOMContentLoaded`.
4. Normalization tests use `data-tags` attribute selectors, not text matching.

**Standard for future tests driving the archives filter UI:** `:visible` for DOM-hidden items, direct hash navigation, `data-*` attribute assertions.
