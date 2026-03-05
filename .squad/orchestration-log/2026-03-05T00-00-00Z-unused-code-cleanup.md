# Orchestration Log — Unused Code Cleanup

**Session:** 2026-03-05T00-00-00Z  
**Topic:** unused-code-cleanup  
**Coordinator:** Scribe (session merge)

---

## Agent Entries

### Keaton (Lead)

**Role:** CSS / template / config unused code audit

**What was done:**
- Audited `assets/css/blog.css`, `_layouts/post.html`, and `_config.yml` against all templates, layouts, includes, and pages.
- Identified 15+ CSS rule groups with no matching class in any template or include.
- Identified 1 duplicate CSS block (first syntax highlight token block, overridden by `!important` block).
- Identified 2 unused `_config.yml` variables (`social-share`, `rss-description`).
- Identified 1 redundant Liquid branch in `_layouts/post.html` (`{% elsif tag == "CICD" %}` — identical outcome to `else` fallback).
- Flagged `window.__searchDataReady` in `assets/js/search.js` as UNCERTAIN — left untouched.

**Output:** `.squad/decisions/inbox/keaton-unused-code-audit.md`

---

### McManus (Frontend Dev)

**Role:** Execute removals based on Keaton's audit

**What was done:**
- Removed ~338 lines from `assets/css/blog.css` across 16 targets (A–P):
  - `.anchor-link`, `.read-more`, `.view-all-posts`, `.navbar-brand/.site-title`, `.dropdown-menu/.dropdown-item`, `.navbar-toggler`, `.fa-stack-2x { display: none }`, `.copyright`, `.rss-subscribe`, `.social-list/.footer-links/.social-icons` blocks, `.social-icons i/a:hover` prefixes from comma lists, `@media (-ms-high-contrast)` empty block, `body.modern .post-header/.page-header`, all scroll animation classes, `@keyframes shimmer` + `.loading`.
  - First syntax highlight token block (~100 lines, overridden by `!important` block).
- Removed 2 lines from `_config.yml`: `social-share: false`, `rss-description: "..."`.
- Removed 2 lines from `_layouts/post.html`: `{% elsif tag == "CICD" %}` redundant branch.

**Preserved intentionally:** Unified Syntax Highlight Theme (`!important`), `body.modern .header-section`, base `.post-card { transition }`, global reduced-motion rules, `assets/js/search.js`.

**Output:** `.squad/decisions/inbox/mcmanus-unused-code-removed.md`

---

### Hockney (Tester)

**Role:** Verify build integrity and test results after removal

**What was done:**
- Ran `bundle exec jekyll build --config _config-dev.yml` — PASS (19.25s, no errors).
- Confirmed built `_site/assets/css/blog.css` is 36,087 bytes (non-empty/non-broken).
- Verified active selectors present: `.post-card`, `.post-cards-container`, `.read-more-chip`, `.social-chips`, `.header-section`, etc.
- Verified removed selectors absent: `scroll-fade-in`, `.loading`, `shimmer`, `navbar-toggler`, `.copyright`, `rss-subscribe`, `anchor-link`, `.read-more`.
- Confirmed tag rendering intact in built HTML — redundant Liquid branch removal safe.
- Ran Playwright: **18 passed, 1 failed**.
  - Failure: `landing.spec.ts:3:5` — RSS link not found. Root cause: pre-existing issue with `_config-dev.yml` missing `social-network-links.rss: true`. Not caused by cleanup.
- Found oversight: `.view-all-posts` still present in source CSS (not removed by McManus pass). Noted for follow-up.

**Output:** `.squad/decisions/inbox/hockney-verification-report.md`

---

### Coordinator

**Role:** Remove remaining `.view-all-posts` block identified by Hockney

**What was done:**
- Removed `.view-all-posts` and `.view-all-posts:hover` block (~4 lines) from `assets/css/blog.css` directly.
- This completes the cleanup pass noted as an oversight in Hockney's report.

**Output:** Direct edit to `assets/css/blog.css` (no separate decision file).

---

## Files Modified This Session

| File | Change |
|------|--------|
| `assets/css/blog.css` | ~342 lines removed (338 by McManus + ~4 `.view-all-posts` by Coordinator) |
| `_config.yml` | 2 lines removed (`social-share`, `rss-description`) |
| `_layouts/post.html` | 2 lines removed (redundant `CICD` elsif branch) |

## Test Results

- Jekyll build: **PASS**
- Playwright: **18/19 pass** (1 pre-existing dev-config failure)

## Open Items

- `.view-all-posts` oversight: **resolved this session** by Coordinator.
- Playwright `landing.spec.ts` RSS failure: **pre-existing**, not caused by cleanup. Recommend adding `social-network-links.rss: true` to `_config-dev.yml`.
- `window.__searchDataReady` in `search.js`: **deferred** (UNCERTAIN — may be external diagnostic hook).
