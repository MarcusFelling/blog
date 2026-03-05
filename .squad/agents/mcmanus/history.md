# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Recreated `_layouts/post.html` and fixed archives hash routing

`_layouts/post.html` was deleted and recreated from scratch. It uses `layout: base`, renders a header section with post title/subtitle/date meta, then the post body and thumbnail, followed by a tag list and prev/next pagination. Tag slugs are normalized inline (e.g. "Azure Pipelines" → `azure-devops`, "GitHub Copilot" → `ai`) to match the slug keys used by the archives filter buttons — this mapping must stay in sync with `archives.md` `data-filter` values. The archives JS was also extended with `activateFromHash()` so that landing on `/archives#ai` (or any tag slug) automatically clicks the matching filter button on page load, and responds to `hashchange` for in-page navigation.

### 2026-03-04 — Archives page visual refresh (sticky filter bar, per-tag accents, empty state)

Replaced the entire `/* ===== ARCHIVES PAGE ===== */` CSS block in `assets/css/blog.css`. Key patterns introduced: (1) `.archive-filters` now uses `position: sticky; top: 0` with `backdrop-filter: blur(10px)` so the filter bar floats over content while scrolling. (2) Per-tag accent CSS custom properties (`--tag-azure-devops`, `--tag-cicd`, etc.) were added to `:root` and are used for `.tag-filter[data-filter="..."].active` rules and `.archive-post-item[data-tags~="..."]` hover border/pill tints — single source of truth for all tag colors. (3) Year headings got a left accent bar via `::before` pseudo-element and dramatic uppercase treatment. (4) Post rows use `border-left: 3px solid transparent` transitioning to the tag accent on hover with a subtle `padding-left` shift for depth. (5) An `.archive-empty-state` element (`#archive-empty`) was added to `archives.md` after the Liquid `{% endfor %}` and toggled via `.classList.toggle('visible', visible === 0)` in the filter JS. The JS was also refactored into an `applyFilter(filter)` function called by both click handlers and `activateFromHash`, making hash routing cleaner. Note: `cicd`, `infra-as-code`, and `other` active button text uses dark (`#121212`) text because their accent colors are light/yellow.

### 2026-03-05 — Template cleanup: nav icons removed, hero panel inline styles extracted

`_includes/nav.html`: Removed `<i class="fas fa-folder-open"></i>` from every nav link anchor in both `nav-links` and `drawer-links` lists. The house icon on the brand link was intentionally preserved.

`_layouts/home.html`: Extracted four inline style blocks from the Pulse hero panel into CSS classes. `<h2>` got `class="pulse-heading"`, the stats box div got `class="top-pages-box"`, the "Top Page Views" `<p>` got `class="top-pages-label"`, and the `<a>` anchors inside the top pages list got `class="top-page-link"`.

`assets/css/blog.css`: Appended a `/* ===== HERO PANEL EXTRACTED CLASSES ===== */` block with `.pulse-heading`, `.top-pages-box`, `.top-pages-label`, `.top-page-link`, and `.top-page-link:hover`. Color values were converted from hardcoded hex to CSS custom properties (`var(--text-col)`, `var(--mid-col)`, `var(--link-col)`) so the classes are theme-aware by default.

---

### 2026-03-04 — Code block "empty blocks" fix

Jekyll wraps fenced code blocks in `div.highlight > div.highlight > pre.highlight > code`. The `div.highlight` carries `background-color`, so the `pre`'s default `margin: 1em 0` punches visible coloured gaps above and below the code. Fix: remove `padding` from `.highlight`, add `overflow: hidden` (so `border-radius` clips children correctly), and add `.highlight > pre { margin: 0; }` to collapse those margins. This pattern applies any time a background-coloured wrapper contains a block element with vertical margin.
