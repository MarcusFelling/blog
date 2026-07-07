---
name: "jekyll-workflow"
description: "Build, test, and deploy patterns for this Jekyll blog hosted on GitHub Pages"
domain: "build-test-deploy"
confidence: "medium"
source: "observed"
---

## Context

This skill applies whenever agents need to build the site locally, run tests, modify CI, or understand how the Jekyll + Playwright + GitHub Pages pipeline fits together. Read this before touching `_config.yml`, templates, CSS, test files, or the CI workflow.

## Patterns

### Local Build

```bash
# Full production-equivalent build
bundle exec jekyll build

# Local dev server (port 4000)
bundle exec jekyll serve

# Dev server with fast config (skips feed/sitemap generation)
bundle exec jekyll serve --config _config.yml,_config-dev.yml
```

- **Ruby setup:** `gem install jekyll bundler && bundle install`. Uses `github-pages` gem (not standalone Jekyll) to match GitHub Pages runtime.
- **Node setup:** `npm ci` for Playwright and Squad CLI dependencies.

### Key Config Files

| File | Purpose |
|------|---------|
| `_config.yml` | Production config — plugins, excludes, permalink structure, site metadata |
| `_config-dev.yml` | Dev overrides — strips `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap` to speed up local rebuilds |
| `Gemfile` | Ruby dependencies — `github-pages` gem + plugins (`jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-paginate`) |
| `package.json` | Node dependencies — `@playwright/test` for E2E tests, `@bradygaster/squad-cli` |
| `playwright.config.ts` | Test config — Chromium only, `baseURL: http://127.0.0.1:4000`, auto-starts Jekyll via `webServer` |

### Running Tests

```bash
# Playwright auto-starts Jekyll via webServer config — no manual server needed
npx playwright test

# Run a specific test file
npx playwright test tests/landing.spec.ts
```

- Tests run against `http://127.0.0.1:4000` (Jekyll dev server, started automatically by Playwright's `webServer` block).
- CI uses 4 workers, 2 retries, 80s timeout per test.

**Regression runs against a frozen build (avoids racing a parallel editor):** build a snapshot to a dedicated destination, serve it frozen, and let Playwright reuse it:

```bash
bundle exec jekyll build --config _config.yml,_config-dev.yml -d _site_baseline   # fresh dest = full build
bundle exec jekyll serve --skip-initial-build --no-watch -d _site_baseline --port 4000   # frozen, immune to edits
npx playwright test   # reuseExistingServer picks up port 4000
```

Use **Jekyll's** server (not `python -m http.server`) — only it serves the custom `404.html` with a real 404 status, which `404.spec.ts` requires. A fresh destination also sidesteps the `incremental: true` staleness gotcha.

**Classify a failure/overflow as new-vs-pre-existing by A/B-ing two frozen builds.** Before blaming a redesign for a red test, a horizontal-scroll, or a contrast miss, serve the *old* build and the *new* build on different ports and probe the same path:

```bash
bundle exec jekyll serve --skip-initial-build --no-watch -d _site_baseline  --port 4001   # "before"
bundle exec jekyll serve --skip-initial-build --no-watch -d _site_redesign --port 4000   # "after"
# then a small Playwright script probes http://127.0.0.1:4001/... vs :4000/... at the same viewport
```

This once stopped a pre-existing 320px post-page overflow (a long unwrapped URL in prose; `.blog-post a` lacks `overflow-wrap`) from being mislabeled a redesign regression — the "after" build had actually *halved* the overflow (62px → 30px). Keep `_site_baseline` on disk after a baseline run precisely so this A/B is cheap. Report a finding as a regression **only** if the "before" build is clean.

**Two low-flake verification tricks worth reusing:**
- **Font-family guard without network flake:** `getComputedStyle(el).fontFamily` returns the *declared* CSS stack even if the webfont never loaded, so asserting `.hero-intro h1` computes `/fraunces/i` and `.blog-post` computes `/inter/i` locks the CSS targeting deterministically (no font-fetch dependency).
- **Focus-ring checks need real keyboard focus:** programmatic `.focus()` doesn't reliably trigger `:focus-visible` — drive `page.keyboard.press('Tab')` and read `getComputedStyle(activeEl).outline*`. Watch for `outline-style: auto` (`5px auto …`) — that means the element has NO custom `:focus-visible` rule and is falling back to the UA default ring. A non-flaky CI assertion Tab-*searches* to the target (`for i<30: press Tab; break when activeElement.matches(sel)`) — this also guards keyboard-reachability, and survives nav reordering because it doesn't hard-code a Tab count.
- **Detect (and correctly attribute) horizontal scroll from a `position:fixed` box:** `documentElement.scrollWidth - clientWidth` MISSES an off-canvas `position:fixed` element (it's viewport-relative, out of document flow) and reports 0. Drive the scroller instead — `se = document.scrollingElement; b = se.scrollLeft; se.scrollLeft = 99999; canScrollRight = se.scrollLeft; se.scrollLeft = b`. To *attribute* the scroll to a suspect, hide it (`el.style.display='none'`), re-measure, take the delta — never infer causation from an off-screen bounding box. This corrected a misattribution: an off-canvas `.mobile-drawer` (`translateX(110%)`, no transformed ancestor) contributes **0px** on all 48 posts; the real 320px overflow on 9 posts is content — long `<em>`/`<code>` prose tokens, one unconstrained `<img>`, a wide code `<table>`. Harness: `tests/redesign/verify-polish.mjs`.
- Reporter stack: `list` + `html` + `junit` (output to `./test-results/junit.xml`).
- Only Chromium project is configured — no cross-browser matrix.

### Test Suite Coverage

**12 spec files, 71 tests** (verified green 2026-07-06 against the editorial redesign + polish pass). The full selector contract (~80 hooks the specs assert) is in the `hockney-redesign-baseline` decision — treat those hooks as an API. Standalone harnesses (not `*.spec.ts`, so `npx playwright test` skips them): `tests/redesign/verify-redesign.mjs` (a11y/contrast/focus sweep) and `tests/redesign/verify-polish.mjs` (polish-pass + drawer/overflow attribution).

| Test file | Tests | What it covers |
|-----------|------:|---------------|
| `404.spec.ts` | 2 | 404 status, `.not-found` copy, home/archives links, no `.blog-pager` |
| `archives.spec.ts` | 6 | filter buttons, tag filtering, year groups, `#visible-count`, hash deep-link, link checker |
| `command-palette.spec.ts` | 13 | ⌘K/Ctrl+K palette open/close, search, keyboard nav, cross-page |
| `copy-code.spec.ts` | 6 | code toolbar, language label, copy button + clipboard |
| `images.spec.ts` | 3 | image loading, webp enforcement, homepage card images |
| `landing.spec.ts` | 9 | editorial hero, featured lead + Popular list, nav social chips, footer isolation, Fraunces/Inter font guard, ⌘K 2px-accent focus ring |
| `post-nav.spec.ts` | 2 | prev/next pager rules |
| `post-toc.spec.ts` | 12 | TOC generation/visibility, reading progress, mobile toggle |
| `reading-time.spec.ts` | 2 | `.reading-time` "X min read" + Fraunces/Inter font guard |
| `related-posts.spec.ts` | 10 | 3 related cards + titles/dates/links/arrows/shared-tags |
| `scroll-to-top.spec.ts` | 1 | `#scroll-to-top` visibility + function |
| `search.spec.ts` | 5 | search trigger opens the command palette |

> Search is now trigger → command palette: `search.spec.ts` clicks `.search-trigger` and drives `#cmd-palette`; there is no standalone search box.

### CI Workflow (`.github/workflows/playwright.yml`)

- **Triggers:** Daily cron (`0 0 * * *`), PRs to `main`, manual dispatch.
- **Environment:** Ubuntu, Node 18, Ruby 3.3 with bundler cache.
- **Steps:** Checkout → Ruby/Node setup → `gem install jekyll bundler` → `npm ci` → Playwright browser cache → `npx playwright test`.
- **Artifacts:** HTML report (30-day retention), JUnit summary via `test-summary/action@v2`.
- **Timeout:** 7 minutes for the entire job.

### Verified Build-Test Loop

The canonical local workflow is:

1. `bundle exec jekyll build` — verify the site compiles
2. `npx playwright test` — Playwright starts its own Jekyll server, runs E2E tests
3. Check `playwright-report/index.html` for results

## Anti-Patterns

### `_config-dev.yml` Drift

The dev config intentionally strips plugins for speed, but it can cause false test failures. Example: `social-network-links.rss: true` exists in `_config.yml` but not in `_config-dev.yml` — tests asserting RSS link presence fail when running against the dev config. **Playwright's `webServer` uses `bundle exec jekyll serve` (production config) by default, so CI is not affected.** But manual `--config _config.yml,_config-dev.yml` testing can hit this.

**Rule:** If a test depends on a config value, verify it exists in both configs or ensure the test only runs against production config.

### Editing Templates Without Building

Never assume a Liquid/HTML change is correct without running `bundle exec jekyll build`. Jekyll silently ignores some Liquid errors and produces broken HTML without failing the build.

### Tag Slug Sync

Tag slug normalization mappings in `archives.md` and `_layouts/post.html` must stay in sync. Adding a mapping to one but not the other causes filter mismatches. See the "Tag Slug Normalization Strategy" decision in `decisions.md`.

### Bootstrap Dependency

Bootstrap 4.4.1 is still loaded (CSS + JS + jQuery + Popper). Grid classes in `post.html` are structural. Don't attempt removal without a full layout replacement plan. The JS stack exists solely for pagination tooltips — flagged as a future quick-win (replace with native `title` attributes).
