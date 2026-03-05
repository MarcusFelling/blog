# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

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
