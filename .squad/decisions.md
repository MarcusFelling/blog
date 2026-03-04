# Squad Decisions

## Active Decisions

---

### Tag Slug Normalization Strategy

**Date:** 2026-03-04  
**Authors:** Keaton (Lead), McManus (Frontend Dev)

Tag slug normalization is handled via an explicit `if/elsif` chain in both `archives.md` and `_layouts/post.html`. These two implementations **must stay in sync**. The default fallback is `tag | slugify`.

**Current mappings:**

| Raw tag value   | Slug used       |
|-----------------|-----------------|
| Azure Pipelines | `azure-devops`  |
| Azure DevOps    | `azure-devops`  |
| GitHub Copilot  | `ai`            |
| DevOps          | `cicd`          |
| CICD            | `cicd`          |
| (all others)    | `tag \| slugify` |

**Rules for future tags:** When adding a new tag that is multi-word or an alias, either add a `data-filter` button to `archives.md` **and** an `if/elsif` mapping to `_layouts/post.html`, or map to the closest existing filter slug in both files.

Also: removed orphaned `Fabric` tag from the hackathon post front matter (no filter button, no sensible mapping).

---

### Archives Page — Cleanup and AI Section Rules

**Date:** 2026-03-04  
**Author:** Verbal

1. AI tag added to tag cloud and a new `## AI` section added after `## GitHub Actions`.
2. Duplicate entry removed from `## Azure DevOps / TFS`.
3. Misplaced entry ("Visual Studio Marketplace Metrics") removed from `## VS Code Extensions`.

**Rules:**
- Tag cloud anchors and `## Section` headings must stay in sync (same lowercase-hyphenated pattern).
- A post should only appear in a section it genuinely relates to — omit rather than guess.

---

### CSS: Eliminate Empty Blocks in Jekyll Code Highlights

**Date:** 2026-03-04  
**Author:** McManus (Frontend Dev)

In `assets/css/blog.css`:
- Removed `padding: 1px` from `.highlight`
- Added `overflow: hidden` to `.highlight` so `border-radius` clips children correctly
- Added `.highlight > pre { margin: 0; }` to suppress `pre` margins inside the coloured wrapper

Pattern applies any time a background-coloured wrapper contains a block element with vertical margin.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
