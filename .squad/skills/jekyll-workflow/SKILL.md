---
name: "jekyll-workflow"
description: "Build, test, and deploy patterns for this Jekyll blog hosted on GitHub Pages"
domain: "build-test-deploy"
confidence: "low"
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
- Reporter stack: `list` + `html` + `junit` (output to `./test-results/junit.xml`).
- Only Chromium project is configured — no cross-browser matrix.

### Test Suite Coverage

| Test file | What it covers |
|-----------|---------------|
| `landing.spec.ts` | Homepage hero, nav social chips, archive link, footer isolation |
| `archives.spec.ts` | Filter buttons, tag filtering, year groups, visible count |
| `search.spec.ts` | Search box visibility, result rendering, navigation from results |
| `404.spec.ts` | 404 status, error page content, no post navigation |
| `images.spec.ts` | Image loading across latest posts (no broken images) |
| `scroll-to-top.spec.ts` | Scroll-to-top button visibility and function |

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
