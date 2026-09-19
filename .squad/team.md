# Squad Team

> blog

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| Keaton | Lead | [charter](agents/keaton/charter.md) | active |
| Verbal | Content Dev | [charter](agents/verbal/charter.md) | active |
| McManus | Frontend Dev | [charter](agents/mcmanus/charter.md) | active |
| Hockney | Tester | [charter](agents/hockney/charter.md) | active |
| Fenster | Design/UX | [charter](agents/fenster/charter.md) | active |
| Kobayashi | DevRel | [charter](agents/kobayashi/charter.md) | active |
| Scribe | (silent) | [charter](agents/scribe/charter.md) | active |
| Ralph | Work Monitor | On-demand only; no GitHub Issues or scheduled polling | inactive |

## Project Context

- **Project:** blog
- **Owner:** Marcus Felling
- **Stack:** Jekyll, Liquid, HTML/CSS/JS, Playwright, GitHub Pages
- **Universe:** The Usual Suspects
- **Created:** 2026-03-04

## Work Intake

- GitHub Issues are not used. Work comes from Marcus's chat requests, explicit file paths, local diffs, and test failures.
- Use the Squad agent in VS Code or the local CLI. No issue labels, issue assignment, scheduled heartbeat, or unattended work loop.
- Markdown files in `.squad/` own the team definition; do not generate over them with `squad build`.
- Keep changes on the current branch unless Marcus explicitly requests otherwise. Never merge a PR or enable auto-merge.
- The upstream Rai and fact-checker charters are optional specialists, not default fan-out participants.
