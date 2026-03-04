# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Code block "empty blocks" fix

Jekyll wraps fenced code blocks in `div.highlight > div.highlight > pre.highlight > code`. The `div.highlight` carries `background-color`, so the `pre`'s default `margin: 1em 0` punches visible coloured gaps above and below the code. Fix: remove `padding` from `.highlight`, add `overflow: hidden` (so `border-radius` clips children correctly), and add `.highlight > pre { margin: 0; }` to collapse those margins. This pattern applies any time a background-coloured wrapper contains a block element with vertical margin.
