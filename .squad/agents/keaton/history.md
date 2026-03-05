# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Tag normalization in archives.md

- The archives page uses a Liquid `if/elsif` chain in `archives.md` to normalize multi-word/aliased tags to their filter slugs. The default fallback is `tag | slugify`.
- `GitHub Copilot` → `ai`, `DevOps` → `cicd` were added as explicit mappings.
- Removed orphaned `Fabric` tag from the hackathon post (no filter button, no sensible mapping).
- Pattern: any new tag that doesn't produce a valid filter slug via `| slugify` needs either a new filter button or an `elsif` entry in the slug normalization block.

### 2026-03-05  Bootstrap removal decision

- Assessed Bootstrap 4.4.1 usage across `_layouts/base.html`, `_layouts/post.html`, and both custom JS files.
- Decision: **Keep Bootstrap this iteration.** Grid classes in `post.html` are structural; removing them mid-redesign is out of scope for an aesthetic pass.
- Finding: `scroll-to-top.js` and `search.js` are pure vanilla JS  neither uses jQuery. jQuery, Popper.js, and Bootstrap JS are loaded solely to power `data-toggle="tooltip"` on pagination links in `post.html`.
- Flagged as Phase 2 quick-win: drop Bootstrap JS + Popper + jQuery by replacing pagination tooltips with native `title` attributes. Three CDN requests eliminated, no functional regression.
- Decision filed at `.squad/decisions/inbox/keaton-bootstrap-decision-2026.md`.