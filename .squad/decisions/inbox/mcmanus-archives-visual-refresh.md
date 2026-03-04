# Decision: Archives Page Visual Refresh

**Date:** 2026-03-04  
**Author:** McManus (Frontend Dev)  
**Requested by:** Marcus Felling

---

## Summary

Visually enhanced the archives page with a sticky filter bar, per-tag accent colors, dramatic year headings, hover left-border accents on post rows, colored tag pills, and an empty-state element for zero-result filters.

---

## Changes Made

### `assets/css/blog.css`

1. **Added 11 per-tag accent CSS custom properties to `:root`** (after `--tag-color`):
   `--tag-azure-devops`, `--tag-cicd`, `--tag-playwright`, `--tag-git`, `--tag-github-actions`, `--tag-octopus-deploy`, `--tag-infra-as-code`, `--tag-windows`, `--tag-vs-code-extensions`, `--tag-ai`, `--tag-other`.

2. **Replaced the entire `/* ===== ARCHIVES PAGE ===== */` block** (previously ended just before `/* Enhanced print styles */`) with:
   - Sticky `.archive-filters` bar with `backdrop-filter: blur(10px)` and border-bottom separator
   - Redesigned `.tag-filter` base state (subtle glass-morphism pill) and per-tag `.active` states using accent variables; `cicd`, `infra-as-code`, `other` use dark text on their light-colored active backgrounds
   - `.archive-count` typography with variable-colored strong/span
   - Dramatic `.archive-year-heading` with `::before` left accent bar, uppercase + 800 weight
   - `.archive-post-item` hover row: `border-left: 3px solid transparent` → accent color on hover, with `padding-left` shift and subtle background fill; per-tag overrides via `[data-tags~="..."]` selector
   - `.archive-post-title` styled as `var(--text-col)` → `var(--link-col)` on hover (was always link-col)
   - `.archive-tag` pill redesigned: glass background with per-tag border/text tint via parent `[data-tags~="..."] .archive-tag:first-of-type`
   - `.archive-empty-state` / `.archive-empty-state.visible` for zero-result messaging

### `archives.md`

1. **Added empty-state element** immediately after `{% endfor %}` (year-group loop close), before `<script>`:
   ```html
   <p class="archive-empty-state" id="archive-empty">No posts match this filter.</p>
   ```

2. **Replaced filter JS** with refactored version:
   - Extracted `applyFilter(filter)` function (called by click handler and hash routing)
   - Sets `opacity: '0'` before `display: 'none'` for CSS-transitioned fade
   - Toggles `.visible` on `#archive-empty` when `visible === 0`
   - Hash routing unchanged functionally (`activateFromHash` + `hashchange`)

---

## Design Decisions

| Decision | Rationale |
|---|---|
| Sticky filter bar | Keeps tag filters accessible while scrolling through many posts |
| Per-tag accent as single CSS variable | One place to change a tag color; used by filter button active, row hover border, and pill tint |
| `cicd`/`infra-as-code`/`other` use dark text on active | Their accent colors (`#f8d57e`, `#9cdcfe`, `#aaaaaa`) are light — dark text maintains contrast |
| `border-left: 3px solid transparent` → accent on hover | Subtle directional affordance without layout shift (`border-left` already allocated, only color changes) |
| `applyFilter` extracted from click handler | Allows `activateFromHash` and any future callers (e.g., URL params) to reuse the same logic |
| Empty state via `.classList.toggle` | Clean one-liner, no conditional; `.visible` just sets `display: block` |

---

## Files Touched

- `assets/css/blog.css` — `:root` variables block + archives CSS section
- `archives.md` — empty state element + filter script

---

## Compatibility Notes

- No changes to Liquid template logic or `data-tags` / `data-filter` attribute values — existing tag slug normalization mapping is untouched.
- `backdrop-filter` degrades gracefully in browsers that don't support it (filter bar still visible, just without blur).
