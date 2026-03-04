# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-04 — Archives page structure
- The archives page (`archives.md`) maintains a hand-curated tag cloud (div.tag-cloud) and a set of manually maintained `## Section` lists. Both must be kept in sync when adding new topics.
- Tag cloud anchor hrefs use lowercase, hyphenated versions of the section headings (e.g., `#ai`, `#vs-code-extensions`).
- Posts without relevant tags should not be placed in a section just to fill it — remove misplaced entries rather than leave noise (e.g., "Visual Studio Marketplace Metrics" was TFS/VSTS marketplace content, not a VS Code extension).
- Prefer removing duplicates silently rather than normalising — keep the first occurrence, drop the trailing duplicate.
