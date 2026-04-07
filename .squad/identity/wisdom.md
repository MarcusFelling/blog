---
last_updated: 2026-03-04T15:29:50.534Z
---

# Team Wisdom

Reusable patterns and heuristics learned through work. NOT transcripts — each entry is a distilled, actionable insight.

## Patterns

**Pattern:** Jekyll builds are the ground truth for CSS/template changes — always run `bundle exec jekyll build` and verify the output before considering work done.
**Context:** Any change to `_layouts/`, `_includes/`, `assets/css/`, or `_config.yml`.

**Pattern:** Dead code removal requires grep-all-templates verification before deleting. Mixed comma-selector groups need surgical removal — dead selectors removed, live selectors preserved.
**Context:** CSS cleanup, template refactoring, config pruning.

**Pattern:** `_config-dev.yml` and `_config.yml` can drift. Dev config may be missing settings that exist in prod, causing false test failures (e.g., RSS link test failing because `social-network-links.rss: true` is missing from dev config).
**Context:** Playwright tests, local development, CI configuration.

**Pattern:** Liquid `{% capture %}` is the correct way to reuse markup across responsive variants (desktop nav vs mobile drawer). Keeps templates DRY while CSS handles layout differences.
**Context:** Navigation components, any markup that appears in both desktop and mobile contexts.

**Pattern:** When agents modify `.squad/` state files, use the drop-box pattern to avoid conflicts — write to `decisions/inbox/{agent}-{slug}.md`, let Scribe merge.
**Context:** Multi-agent parallel work, any decision that needs team visibility.
