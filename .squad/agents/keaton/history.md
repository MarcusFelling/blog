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
