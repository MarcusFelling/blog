# Session Log — Remove Remote Theme Dependency

**Date:** 2026-03-11
**Requested by:** Marcus Felling

## Summary

McManus removed the `remote_theme` dependency from `_config.yml`, dropped the unused `minima` gem from `Gemfile`, and created `_layouts/page.html` locally. Hockney verified: Jekyll build clean (0 warnings), 16/16 Playwright tests pass. Hockney also cleaned up three content-coupled archive tests (decision captured). No breakage.

## Agents

| Agent | Role | Work |
|-------|------|------|
| McManus | Frontend Dev | Removed remote_theme, pruned Gemfile, created page.html layout |
| Hockney | Tester | Verified build + all 16 Playwright tests pass, removed brittle tests |

## Decisions

- Remove remote_theme dependency (McManus)
- Remove content-coupled archive tests (Hockney)
