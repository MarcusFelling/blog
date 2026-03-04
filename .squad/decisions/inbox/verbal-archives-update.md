# Decision: Archives Page — AI Tag + Cleanup Rules

**Date:** 2026-03-04  
**Agent:** Verbal  
**Requested by:** Marcus Felling  

## What changed

1. **AI tag added** to tag cloud (between "VS Code Extensions" and "Other") and a new `## AI` section added after `## GitHub Actions` with two 2026 posts.
2. **Duplicate removed** — "Trigger an Azure Function (PowerShell) from an Azure DevOps Pipeline" appeared twice in `## Azure DevOps / TFS`; the trailing duplicate was removed.
3. **Misplaced entry removed** — "Visual Studio Marketplace Metrics" was in `## VS Code Extensions` but covers the old TFS/VSTS extension marketplace. It has no VS Code tag and was removed without replacement.

## Decision / Rule

**Tag cloud and section lists must stay in sync.** Any new `## Section` in archives.md requires a matching anchor link in the tag cloud div, using the same lowercase-hyphenated `#anchor` pattern. Future agents must audit both places when adding or removing topics.

**Placement accuracy over quantity.** A post should only appear in a section if it genuinely relates to that tag. When in doubt, omit rather than guess.
