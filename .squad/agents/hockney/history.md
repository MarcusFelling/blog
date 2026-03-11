# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

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
