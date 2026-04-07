# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-13 — Broken temp gitlink caused CI submodule failure

- The repo accidentally tracked `.tmp/impeccable` as a gitlink (`160000` mode) even though there was no `.gitmodules` file. That state reproduces `fatal: no submodule mapping found in .gitmodules for path '.tmp/impeccable'` on `git submodule status` and can break CI actions that inspect submodules.
- `.tmp/` is temporary tooling workspace state, not project content. It should stay ignored in `.gitignore`, and the correct repo fix is to delete the tracked gitlink entry while leaving any local temp clone untracked.
- Current workflows under `.github/workflows/` use `actions/checkout@v6` without any `submodules:` setting; there is no tracked workflow or package script that should recreate `.tmp/impeccable`.

### 2026-03-06 — Landing social chips regression

- The landing-page regression in [tests/landing.spec.ts](tests/landing.spec.ts#L3-L30) should assert the social chips rendered in the navbar, not hard-code `RSS feed`, because local test runs may be served from config combinations that omit some chips.
- For this site, the stable invariant is location: configured social-chip links belong under `.nav-social` in the main navigation, and the footer should expose zero `.social-chip` links.

### 2026-03-06 — Social chips verification

- For UI verification on this site, use merged Jekyll config (`_config.yml,_config-dev.yml`). `_config-dev.yml` by itself omits `site.social-network-links`, so navbar/footer assertions can give false negatives.
- The landing-page regression belongs in [tests/landing.spec.ts](tests/landing.spec.ts#L3-L25): assert the social links under `navigation[aria-label="Main navigation"]` and explicitly assert the footer no longer exposes those links.
- Watch for accidental media-query nesting near [assets/css/blog.css](assets/css/blog.css#L1223-L1261). A missing closing brace can silently trap later breakpoint rules inside `prefers-reduced-motion`, which makes mobile-only UI behavior look correct in markup but fail in the browser.

### 2026-03-04 — Archives spec rewrite

- The old `archives.spec.ts` targeted an h2-section + tag-cloud structure that was replaced with a JS filter UI (`div.archive-filters`, `button.tag-filter[data-filter]`, `#visible-count`).
- `layout: post` is shared by blog posts AND static pages (like `archives.md`). Test 1 asserts that `"Posted on"` does NOT appear on the archives page because that text is gated on `page.collection == "posts"`.
- Tag slug normalization lives in two places (`archives.md` and `_layouts/post.html`) and must stay in sync per the team decision. Tests 9 and 10 validate the normalization output (`GitHub Copilot → ai`, `DevOps → cicd`).
- Hash-based filter activation (`/archives#ai`) is handled by JS on `DOMContentLoaded`; test 6 verifies this end-to-end.
- The `Fabric` tag was removed from the hackathon post front matter; tests 7 and 8 guard against its reappearance.
- Playwright's `:visible` pseudo-class works inside `.locator()` strings when checking filtered items.

### 2026-03-11 — Verified remote_theme removal + cleaned content-coupled tests

McManus removed `remote_theme` from `_config.yml`, dropped `gem "minima"` from `Gemfile`, and created `_layouts/page.html` locally. Verified: Jekyll build clean (0 warnings), 16/16 Playwright tests pass. Also removed three content-coupled tests from `archives.spec.ts` that targeted specific post slugs — the feature behaviors were already covered generically. Decision captured: archive tests should assert feature behavior without referencing specific post URLs.

### 2026-03-05  Unused code removal verification

- Jekyll build with `--config _config-dev.yml` only loads that one file; `_config.yml` settings (like `social-network-links.rss: true`) are NOT inherited. Landing test `rss` assertion always fails against a dev-config-only server. Fix: add `rss: true` to `_config-dev.yml` or test against a merged config.
- After a ~338-line CSS cleanup, the built `blog.css` was 36,087 bytes  all active selectors intact, all 8 removed selectors absent. One dead selector (`.view-all-posts`) survived the cleanup; it has no template usage and should be removed in a follow-up.
- When verifying CSS removal, always grep both source and built files. Source grep is the ground truth; built output confirms the pipeline worked correctly.
- 18/19 Playwright tests passed; the 1 failure (`landing.spec.ts` RSS link) is a pre-existing config mismatch, not caused by the CSS/Liquid changes. Safe to commit.

### 2026-03-11 — Archive post link checker test

- Added test #11 to `archives.spec.ts`: iterates every `a.archive-post-title` on `/archives`, asserts each has a non-empty `href`, and makes an HTTP request to confirm a 200 response.
- Uses Playwright's built-in `request` fixture for server-side HTTP checks — no extra dependencies needed.
- Custom assertion messages (`Broken link: ${href}`) make failures immediately actionable in CI logs.
- This is a regression net for dead internal links; it will catch slug changes, deleted posts, or misconfigured permalinks before they reach production.

### 2026-03-11 — Archives spec cleanup and rewrite

- Rewrote `archives.spec.ts` from 11 tests → 6 focused tests, removing 3 content-specific tests (hackathon slug, squad slug, tag-link navigation) that coupled tests to individual post URLs.
- Consolidated the "filter works" and "All resets" tests into a single user-flow test.
- Playwright best practices applied:
  - `getByRole('button', { name })` for filter button locators instead of CSS-only selectors.
  - `getByRole('heading', { level: 1, name: 'Archives' })` for the page heading.
  - `evaluateAll()` for batch data-tag checks instead of sequential `nth(i)` loops.
  - `locator.all()` for iterating visible items when web-first assertions are needed per element.
  - Web-first assertions (`toHaveText`, `toBeVisible`) instead of `textContent()` + `parseInt()` where possible.
  - `test.slow()` on the link checker since it issues an HTTP request per post.
  - Removed hardcoded filter count (`toHaveCount(12)`) — now asserts each expected filter button exists without a brittle total.
- Tag normalization is still covered generically: the filter test verifies every visible item carries the expected `data-tags` value, which exercises the normalization pipeline without naming a specific post.

### 2026-03-11 — Remote theme removal verification

- Verified McManus's 3 changes: `remote_theme` removed from `_config.yml`, `gem "minima"` removed from `Gemfile`, `_layouts/page.html` created.
- Jekyll build (`bundle exec jekyll build --config _config.yml`) completed clean in ~8s. Zero "Layout not found" or "Include not found" warnings. Only pre-existing `faraday-retry` gem notice on stderr.
- Site structure verified: `_site/index.html`, `_site/404.html`, `_site/archives/index.html`, `_site/llms.txt` all present. Posts span 2017-2026 (10 year directories).
- Zero references to `remote_theme` or `blog-theme` in any built HTML file.
- Spot checks: index.html has nav, search, footer, Archives link. Post pages have h1, tags, "Posted on", footer, nav.
- All 16 Playwright tests passed (19.8s): 6 archives, 5 search, 3 landing, 1 scroll-to-top, 1 post structure.
- Note: `Gemfile.lock` still lists `minima (~> 2.5)` in DEPENDENCIES section (line 319) — stale entry from the removed gem line. Harmless because `github-pages` gem transitively includes `minima` anyway, but `bundle install` would clean this up.

### 2026-03-18 — llms.txt verification framing

- For publish-readiness checks on this repo, separate repo-backed findings from public-spec guidance. Example: a missing thumbnail asset under `content/uploads/YYYY/MM/` is a concrete repo issue; guidance from `llmstxt.org` about companion context files is external reference material.
- When reviewing `llms.txt`, note that the current site output is a flat post list. Absence of `llms-ctx.txt` or `llms-ctx-full.txt` should be reported as a spec-alignment gap or decision input, not as a regression, unless the team has already committed to shipping those artifacts.

### 2026-04-07 — Full test suite audit (Squad v0.8.18 demo)

- **21 tests across 6 spec files, all passing (2.8 min total run).**
- Coverage breakdown by spec file:
  - `404.spec.ts` (2 tests): 404 page content, no prev/next nav on 404.
  - `archives.spec.ts` (6 tests): heading/meta, filter buttons, year groups, tag filtering + reset, hash deep-link activation, link checker (all archive post links return 200).
  - `images.spec.ts` (3 tests): post images load (naturalWidth > 0 + no HTTP errors), webp format enforcement on `content/uploads` images, homepage card images load with lazy-load decode wait.
  - `landing.spec.ts` (4 tests): social chips in navbar (placement + href validation + footer exclusion), hero section desktop visibility (Pulse, KPIs), Pulse hidden on mobile, post card structure + Browse Archive button.
  - `scroll-to-top.spec.ts` (1 test): button visible class on scroll, click returns to top.
  - `search.spec.ts` (5 tests): search box visibility, results on typing, click-to-navigate, empty results handling, dismiss on outside click.
- The previously documented RSS link test failure (from `_config-dev.yml` drift) is no longer present — that test was rewritten to validate social chip placement generically rather than asserting a hard-coded RSS link.
- Slowest tests are in `images.spec.ts`: "images load successfully on latest posts" (1.0 min) and "images use webp format" (51.7s). Both iterate across the latest 10 posts. No flakiness observed — just inherently slow due to multi-page navigation. The 80s test timeout in `playwright.config.ts` accommodates them.
- No known failures or flaky tests at this time.

### 2026-04-07 — Reading time feature test

- Created `tests/reading-time.spec.ts` (1 test) to verify the new reading time feature on blog posts.
- Strategy: navigate to the first post from the homepage (same pattern as `post-nav.spec.ts`), then assert `.reading-time` is visible, text matches `/\d+ min read/`, and the parsed minute value is >= 1.
- Single test covers visibility, format, and reasonableness — no need for multiple tests since they all operate on the same element on the same page.
