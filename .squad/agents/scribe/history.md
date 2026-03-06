# Project Context

- **Owner:** Marcus Felling
- **Project:** blog — technical blog built with Jekyll and hosted on GitHub Pages
- **Stack:** Jekyll, Liquid templates, HTML/CSS/JS, Playwright (TypeScript), GitHub Pages
- **Created:** 2026-03-04

## Core Context

Team hired on 2026-03-04. Universe: The Usual Suspects.
Members: Keaton (Lead), Verbal (Content Dev), McManus (Frontend Dev), Hockney (Tester), Fenster (Design/UX), Kobayashi (DevRel).

## Recent Updates

📌 Team initialized on 2026-03-04 by Marcus Felling

📌 2026-03-06: Logged the navbar Liquid regression fix and confirmed there were no pending inbox decisions to merge.

📌 2026-03-06: Logged the navbar utility follow-up, merged two pending inbox decisions into the canonical decision log, and cleared the inbox files without creating a commit.

📌 2026-03-06: Logged Hockney's fresh merged-config validation run, confirmed the decision inbox was empty, and left the canonical decision log unchanged.

## Learnings

Initial setup complete. Team hired and ready for work.

### 2026-03-06 — Regression-fix logging pattern

- For short coordination-only fixes, add a concise session log under `.squad/log/` that records who changed code, who validated the result, and whether the decision inbox was empty.
- If `.squad/decisions/inbox/` has no files, leave `.squad/decisions.md` unchanged and note the empty merge pass in the session log instead.

### 2026-03-06 — Decision-merge follow-up pattern

- When multiple inbox notes describe the same navbar follow-up from different roles, merge them into a single consolidated decision in `.squad/decisions.md` instead of preserving parallel near-duplicates.
- The orchestration note should record which inbox files were consumed and whether validation came from fresh execution or prior verified context.

### 2026-03-06 — Validation-only logging pattern

- When a tester provides a fresh build-and-test pass with no file edits, record it as current validation context in both the session log and orchestration log.
- If the inbox sweep is empty during a validation-only pass, leave `.squad/decisions.md` untouched and explicitly note that no merge was required.
