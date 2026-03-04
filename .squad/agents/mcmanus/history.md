# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Recreated `_layouts/post.html` and fixed archives hash routing

`_layouts/post.html` was deleted and recreated from scratch. It uses `layout: base`, renders a header section with post title/subtitle/date meta, then the post body and thumbnail, followed by a tag list and prev/next pagination. Tag slugs are normalized inline (e.g. "Azure Pipelines" → `azure-devops`, "GitHub Copilot" → `ai`) to match the slug keys used by the archives filter buttons — this mapping must stay in sync with `archives.md` `data-filter` values. The archives JS was also extended with `activateFromHash()` so that landing on `/archives#ai` (or any tag slug) automatically clicks the matching filter button on page load, and responds to `hashchange` for in-page navigation.

### 2026-03-04 — Code block "empty blocks" fix

Jekyll wraps fenced code blocks in `div.highlight > div.highlight > pre.highlight > code`. The `div.highlight` carries `background-color`, so the `pre`'s default `margin: 1em 0` punches visible coloured gaps above and below the code. Fix: remove `padding` from `.highlight`, add `overflow: hidden` (so `border-radius` clips children correctly), and add `.highlight > pre { margin: 0; }` to collapse those margins. This pattern applies any time a background-coloured wrapper contains a block element with vertical margin.
