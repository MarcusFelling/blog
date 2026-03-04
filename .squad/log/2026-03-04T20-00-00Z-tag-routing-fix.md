# Session Log — Tag Routing Fix

**Date:** 2026-03-04T20-00-00Z  
**Topic:** tag-routing-fix  

## Summary

Two agents worked to fix broken tag → archives routing.

**Keaton (Lead):** Added `GitHub Copilot → ai` and `DevOps → cicd` slug normalizations to `archives.md`. Removed orphaned `Fabric` tag from the hackathon post front matter.

**McManus (Frontend Dev):** Recreated deleted `_layouts/post.html` with full tag slug normalization inline. Added `activateFromHash()` JS to `archives.md` so landing on `/archives#<slug>` auto-activates the correct filter button.

## Decisions

- Tag slug normalization lives in both `archives.md` and `_layouts/post.html`; the two must remain in sync.
- New multi-word or aliased tags need either a new filter button or an `elsif` mapping.
- Deep-link routing from post tags to archives is now functional via hash-based JS activation.
