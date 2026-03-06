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

### 2026-03-05 — Unused code audit

- Performed full cross-reference of all CSS selectors in `assets/css/blog.css` against every template, include, layout, post, and page.
- Found ~23 discrete issues. The largest categories are: (1) legacy Bootstrap-era footer/nav classes (`.navbar-brand`, `.navbar-toggler`, `.dropdown-*`, `.social-list`, `.footer-links`, `.rss-subscribe`, `.copyright`) never applied by the current custom nav and footer templates; (2) a full scroll-animation system (`.scroll-fade-in`, `.scroll-slide-*`, `.scroll-scale-in`, `.post-card.scroll-animate`) with no JS and no class applications — ~58 lines of inert CSS; (3) an overridden first syntax-highlight token block (~100 lines) superseded by the `!important` block at EOF.
- Key pattern: the "modern redesign" in `_includes/head.html` (large inline `<style>`) introduced new class names for nav, footer, cards, and hero; the parallel selectors for the old names in `blog.css` were never cleaned up.
- `window.__searchDataReady` in `search.js` is written but never read — UNCERTAIN pending external confirmation.
- Live bug found during audit: `_layouts/post.html` is missing `DevOps → cicd` and `GitHub Copilot → ai` slug mappings that exist in `archives.md`. Affects one current post (`2026-02-26`). Filed alongside audit findings.
- Two `_config.yml` variables are unused: `social-share: false` (remote-theme carry-over) and `rss-description` (not read by any template or by `jekyll-feed`).

### 2026-03-05  Bootstrap removal decision

- Assessed Bootstrap 4.4.1 usage across `_layouts/base.html`, `_layouts/post.html`, and both custom JS files.
- Decision: **Keep Bootstrap this iteration.** Grid classes in `post.html` are structural; removing them mid-redesign is out of scope for an aesthetic pass.
- Finding: `scroll-to-top.js` and `search.js` are pure vanilla JS  neither uses jQuery. jQuery, Popper.js, and Bootstrap JS are loaded solely to power `data-toggle="tooltip"` on pagination links in `post.html`.
- Flagged as Phase 2 quick-win: drop Bootstrap JS + Popper + jQuery by replacing pagination tooltips with native `title` attributes. Three CDN requests eliminated, no functional regression.
- Decision filed at `.squad/decisions/inbox/keaton-bootstrap-decision-2026.md`.

### 2026-03-06 — Keep responsive navbar media queries outside reduced-motion

- The navbar social-chip breakpoint rules in `assets/css/blog.css` must stay as top-level `@media` blocks. Nesting them inside `@media (prefers-reduced-motion: reduce)` breaks responsive navbar/drawer behavior for most users and makes the stylesheet structure misleading.
- For this codebase, reduced-motion overrides should only contain motion/accessibility adjustments; layout and breakpoint rules belong at the normal top level.