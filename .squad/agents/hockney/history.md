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
